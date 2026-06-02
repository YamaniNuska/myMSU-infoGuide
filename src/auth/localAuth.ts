import * as React from "react";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../utils/supabase";
import { deleteRecord, syncAppData, upsertRecord } from "../data/appStore";
import { UserRecord, UserRole } from "../data/mymsuDatabase";

type PublicUserRole = Exclude<UserRole, "admin">;
type SignupRole = Extract<UserRole, "student" | "faculty" | "employee" | "visitor">;

type SignUpInput = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type ProfileDetailsInput = {
  name: string;
  idNumber?: string;
  avatarUrl?: string;
  college?: string;
  program?: string;
  yearLevel?: string;
  section?: string;
  phone?: string;
  address?: string;
  bio?: string;
};

type AuthResult =
  | {
      ok: true;
      user: UserRecord;
      requiresEmailConfirmation?: false;
    }
  | {
      ok: true;
      message: string;
      requiresEmailConfirmation: true;
    }
  | {
      ok: false;
      message: string;
    };

const MSU_STUDENT_DOMAIN = "@s.msumain.edu.ph";
const MSU_FACULTY_DOMAIN = "@msumain.edu.ph";
const FIXED_ADMIN_EMAIL = "admin@msumain.edu.ph";
const PROFILE_AVATAR_BUCKET = "profile-avatars";

let currentUser: UserRecord | null = null;
const listeners = new Set<() => void>();

const normalize = (value: string) => value.trim().toLowerCase();
const usernameFromName = (name: string) => normalize(name);
const isSignupRole = (role: unknown): role is SignupRole =>
  role === "student" || role === "faculty" || role === "employee";
const isMsuStudentEmail = (email: string) =>
  normalize(email).endsWith(MSU_STUDENT_DOMAIN);
const isMsuFacultyEmail = (email: string) =>
  normalize(email).endsWith(MSU_FACULTY_DOMAIN);
const isFixedAdminEmail = (email: string) =>
  normalize(email) === FIXED_ADMIN_EMAIL;
const optionalString = (value: unknown) =>
  value === null || value === undefined ? undefined : String(value);

function emit() {
  listeners.forEach((listener) => listener());
}

function validateSupabase() {
  if (!isSupabaseConfigured()) {
    return "Supabase is not configured. Add the Supabase URL and publishable key to .env.local.";
  }

  return null;
}

function toPublicUser(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    role: (row.role as UserRole) ?? "visitor",
    username: String(row.username ?? ""),
    email: String(row.email ?? ""),
    idNumber: optionalString(row.id_number) ?? optionalString(row.student_id),
    avatarUrl: optionalString(row.avatar_url),
    college: optionalString(row.college),
    program: optionalString(row.program),
    yearLevel: optionalString(row.year_level),
    section: optionalString(row.section),
    phone: optionalString(row.phone),
    address: optionalString(row.address),
    bio: optionalString(row.bio),
  };
}

function profileFromAuthUser(authUser: SupabaseAuthUser): UserRecord | null {
  const email = normalize(authUser.email ?? "");

  if (!email) {
    return null;
  }

  const metadata = authUser.user_metadata as Record<string, unknown>;
  const metadataName =
    typeof metadata.name === "string"
      ? metadata.name
      : typeof metadata.full_name === "string"
        ? metadata.full_name
        : "";
  const requestedRole =
    isSignupRole(metadata.role) && metadata.role !== "employee"
      ? metadata.role
      : "student";
  const isFixedAdmin = isFixedAdminEmail(email);
  const resolvedRole = resolveSignupRole(email, requestedRole);
  const username = usernameFromName(metadataName || email.split("@")[0]);

  return {
    id: authUser.id,
    name: metadataName.trim() || username,
    role: isFixedAdmin ? "admin" : resolvedRole.ok ? resolvedRole.role : "visitor",
    username,
    email,
  };
}

async function ensureProfileForAuthUser(authUser: SupabaseAuthUser) {
  const existingProfile = await getProfileById(authUser.id);

  if (existingProfile) {
    return existingProfile;
  }

  const fallbackProfile = profileFromAuthUser(authUser);

  if (!fallbackProfile) {
    return null;
  }

  await saveProfile(fallbackProfile);
  return fallbackProfile;
}

async function findProfileByField(field: string, value: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq(field, value)
    .limit(1);

  if (error) {
    throw error;
  }

  return data[0] ? toPublicUser(data[0]) : null;
}

async function findProfileByIdentifier(identifier: string) {
  const cleanIdentifier = normalize(identifier);

  if (cleanIdentifier.includes("@")) {
    return findProfileByField("email", cleanIdentifier);
  }

  return (
    (await findProfileByField("username", cleanIdentifier)) ??
    (await findProfileByField("id_number", cleanIdentifier)) ??
    (await findProfileByField("student_id", cleanIdentifier))
  );
}

async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toPublicUser(data) : null;
}

async function saveProfile(user: UserRecord) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      name: user.name,
      role: user.role,
      username: normalize(user.username),
      email: normalize(user.email),
      id_number: user.idNumber ?? null,
      student_id: user.idNumber ?? null,
      avatar_url: user.avatarUrl ?? null,
      college: user.college ?? null,
      program: user.program ?? null,
      year_level: user.yearLevel ?? null,
      section: user.section ?? null,
      phone: user.phone ?? null,
      address: user.address ?? null,
      bio: user.bio ?? null,
    },
    { onConflict: "id" },
  );

  if (error) {
    throw error;
  }

  const { data, error: verifyError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (verifyError) {
    throw verifyError;
  }

  if (!data) {
    throw new Error("Supabase accepted the profile save, but the profile was not found afterward.");
  }
}

const cleanOptional = (value?: string) => {
  const clean = value?.trim() ?? "";

  return clean || undefined;
};

export async function updateProfileDetails(
  patch: ProfileDetailsInput,
): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  if (!currentUser) {
    return {
      ok: false,
      message: "Sign in before updating your profile.",
    };
  }

  const name = patch.name.trim();

  if (!name) {
    return {
      ok: false,
      message: "Enter your display name.",
    };
  }

  const nextUser: UserRecord = {
    ...currentUser,
    name,
    username: usernameFromName(name),
    idNumber: cleanOptional(patch.idNumber),
    avatarUrl: cleanOptional(patch.avatarUrl),
    college: cleanOptional(patch.college),
    program: cleanOptional(patch.program),
    yearLevel: cleanOptional(patch.yearLevel),
    section: cleanOptional(patch.section),
    phone: cleanOptional(patch.phone),
    address: cleanOptional(patch.address),
    bio: cleanOptional(patch.bio),
  };

  try {
    await saveProfile(nextUser);
    setSignedInUser(nextUser);

    return {
      ok: true,
      user: nextUser,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update your profile details.",
    };
  }
}

export async function uploadProfileAvatar(input: {
  uri: string;
  name?: string;
  mimeType?: string | null;
}): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  if (!currentUser) {
    return {
      ok: false,
      message: "Sign in before setting a profile picture.",
    };
  }

  try {
    const response = await fetch(input.uri);
    const blob = await response.blob();
    const extension =
      input.name?.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ||
      input.mimeType?.split("/").pop()?.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ||
      "jpg";
    const path = `${currentUser.id}/avatar-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .upload(path, blob, {
        contentType: input.mimeType ?? blob.type ?? "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .getPublicUrl(path);
    const avatarUrl = data.publicUrl;
    const nextUser = {
      ...currentUser,
      avatarUrl,
    };

    await saveProfile(nextUser);
    setSignedInUser(nextUser);

    return {
      ok: true,
      user: nextUser,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload your profile picture.",
    };
  }
}

function setSignedInUser(user: UserRecord) {
  currentUser = user;
  void upsertRecord("users", user);
  emit();
}

function resolveSignupRole(
  email: string,
  requestedRole: UserRole = "student",
): { ok: true; role: PublicUserRole } | { ok: false; message: string } {
  const cleanEmail = normalize(email);

  if (requestedRole === "admin" || isFixedAdminEmail(cleanEmail)) {
    return {
      ok: false,
      message: "Admin account creation is disabled. Use the existing fixed admin account.",
    };
  }

  if (isMsuStudentEmail(cleanEmail)) {
    return {
      ok: true,
      role: "student",
    };
  }

  if (isMsuFacultyEmail(cleanEmail)) {
    return {
      ok: true,
      role: "faculty",
    };
  }

  return {
    ok: true,
    role: "visitor",
  };
}

const roleFromInstitutionEmail = (email: string): UserRole | null => {
  const cleanEmail = normalize(email);

  if (isFixedAdminEmail(cleanEmail)) {
    return "admin";
  }

  if (isMsuStudentEmail(cleanEmail)) {
    return "student";
  }

  if (isMsuFacultyEmail(cleanEmail)) {
    return "faculty";
  }

  return null;
};

async function syncDetectedRole(profile: UserRecord) {
  const detectedRole = roleFromInstitutionEmail(profile.email);

  if (!detectedRole || profile.role === "admin" || profile.role === detectedRole) {
    return profile;
  }

  const nextProfile = {
    ...profile,
    role: detectedRole,
  };

  await saveProfile(nextProfile);
  return nextProfile;
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
}

export function subscribeAuth(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function getCurrentUser() {
  return currentUser;
}

export function useAuthSession() {
  return React.useSyncExternalStore(
    subscribeAuth,
    getCurrentUser,
    getCurrentUser,
  );
}

export async function restoreAuthSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    const profile = await ensureProfileForAuthUser(data.user);

    if (profile) {
      const roleSyncedProfile = await syncDetectedRole(profile);
      setSignedInUser(roleSyncedProfile);
      return roleSyncedProfile;
    }

    return profile;
  } catch (error) {
    console.warn("Unable to restore Supabase session", error);
    return null;
  }
}

export async function signIn(
  identifier: string,
  password: string,
): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  const cleanIdentifier = normalize(identifier);
  const cleanPassword = password.trim();

  if (!cleanIdentifier || !cleanPassword) {
    return {
      ok: false,
      message: "Enter your name/email and password.",
    };
  }

  try {
    await syncAppData();

    const profile = await findProfileByIdentifier(cleanIdentifier);

    if (!profile && !cleanIdentifier.includes("@")) {
      return {
        ok: false,
        message:
          "Use your email address for the first sign-in. After the profile is restored, name or ID number sign-in will work.",
      };
    }

    const email = profile?.email ?? cleanIdentifier;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: cleanPassword,
    });

    if (error || !data.user) {
      return {
        ok: false,
        message: error?.message ?? "Invalid account or password.",
      };
    }

    const signedInProfile = profile ?? (await ensureProfileForAuthUser(data.user));

    if (!signedInProfile) {
      return {
        ok: false,
        message:
          "Signed in, but the app could not create a profile for this account. Check that the Auth user has an email address.",
      };
    }

    const roleSyncedProfile = await syncDetectedRole(signedInProfile);
    setSignedInUser(roleSyncedProfile);

    return {
      ok: true,
      user: roleSyncedProfile,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to sign in through Supabase.",
    };
  }
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  const name = input.name.trim();
  const username = usernameFromName(name);
  const email = normalize(input.email);
  const password = input.password.trim();

  if (!name || !email || !password) {
    return {
      ok: false,
      message: "Complete all sign-up fields.",
    };
  }

  const passwordMessage = validatePassword(password);

  if (passwordMessage) {
    return {
      ok: false,
      message: passwordMessage,
    };
  }

  const resolvedRole = resolveSignupRole(email);

  if (!resolvedRole.ok) {
    return resolvedRole;
  }

  try {
    const existingProfile = await findProfileByIdentifier(username);

    if (existingProfile) {
      return {
        ok: false,
        message: "Name / username is already registered.",
      };
    }

    const existingEmail = await findProfileByIdentifier(email);

    if (existingEmail) {
      return {
        ok: false,
        message: "Email is already registered.",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          role: resolvedRole.role,
        },
      },
    });

    if (error || !data.user) {
      return {
        ok: false,
        message: error?.message ?? "Unable to create the account.",
      };
    }

    const user: UserRecord = {
      id: data.user.id,
      name,
      role: resolvedRole.role,
      username,
      email,
    };

    await saveProfile(user);
    await supabase.auth.signOut();

    return {
      ok: true,
      requiresEmailConfirmation: true,
      message:
        "Account created. Please confirm your email before signing in.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create the account through Supabase.",
    };
  }
}

export async function signOut() {
  currentUser = null;

  if (isSupabaseConfigured()) {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.warn("Supabase sign out failed", error);
    }
  }

  emit();
}

export async function createStudentAccount(input: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  const name = input.name.trim();
  const username = usernameFromName(name);
  const email = normalize(input.email);
  const password = input.password.trim();

  if (!name || !email || !password) {
    return {
      ok: false,
      message: "Complete all student account fields.",
    };
  }

  const passwordMessage = validatePassword(password);

  if (passwordMessage) {
    return {
      ok: false,
      message: passwordMessage,
    };
  }

  const resolvedRole = resolveSignupRole(email, "student");

  if (!resolvedRole.ok) {
    return resolvedRole;
  }

  if (resolvedRole.role !== "student") {
    return {
      ok: false,
      message: "Student accounts must use an MSU email address.",
    };
  }

  try {
    const existingProfile = await findProfileByIdentifier(username);

    if (existingProfile) {
      return {
        ok: false,
        message: "Name / username is already registered.",
      };
    }

    const existingEmail = await findProfileByIdentifier(email);

    if (existingEmail) {
      return {
        ok: false,
        message: "Email is already registered.",
      };
    }

    const { data: previousSession } = await supabase.auth.getSession();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          role: "student",
        },
      },
    });

    if (previousSession.session) {
      await supabase.auth.setSession({
        access_token: previousSession.session.access_token,
        refresh_token: previousSession.session.refresh_token,
      });
    }

    if (error || !data.user) {
      return {
        ok: false,
        message: error?.message ?? "Unable to create the student account.",
      };
    }

    const user: UserRecord = {
      id: data.user.id,
      name,
      role: "student",
      username,
      email,
    };

    await saveProfile(user);
    void upsertRecord("users", user);

    return {
      ok: true,
      user,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create the student account through Supabase.",
    };
  }
}

export async function updateStudentAccount(
  id: string,
  patch: {
    name: string;
    username: string;
    email: string;
    password?: string;
  },
): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  const nextEmail = normalize(patch.email);
  const resolvedRole = resolveSignupRole(nextEmail, "student");

  if (!resolvedRole.ok) {
    return resolvedRole;
  }

  if (resolvedRole.role !== "student") {
    return {
      ok: false,
      message: "Student accounts must use an MSU email address.",
    };
  }

  const user: UserRecord = {
    id,
    name: patch.name.trim(),
    role: "student",
    username: usernameFromName(patch.name),
    email: nextEmail,
  };

  try {
    await saveProfile(user);
    void upsertRecord("users", user);

    if (currentUser?.id === id) {
      currentUser = user;
      emit();
    }

    return {
      ok: true,
      user,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update the student profile.",
    };
  }
}

export async function deleteStudentAccount(id: string): Promise<AuthResult> {
  const configError = validateSupabase();

  if (configError) {
    return {
      ok: false,
      message: configError,
    };
  }

  try {
    const deletedUser = currentUser?.id === id ? currentUser : null;

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      throw error;
    }

    const { data: stillExists, error: verifyError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (verifyError) {
      throw verifyError;
    }

    if (stillExists) {
      throw new Error("Supabase accepted the profile delete, but the profile still exists.");
    }

    await deleteRecord("users", id);

    if (currentUser?.id === id) {
      currentUser = null;
      emit();
    }

    return {
      ok: true,
      user:
        deletedUser ?? {
          id,
          name: "Deleted student",
          role: "student",
          username: id,
          email: "",
        },
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete the student profile.",
    };
  }
}
