import * as React from "react";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../utils/supabase";
import { deleteRecord, syncAppData, upsertRecord } from "../data/appStore";
import { UserRecord, UserRole } from "../data/mymsuDatabase";

type PublicUserRole = Exclude<UserRole, "admin">;
type SignupRole = Extract<UserRole, "student" | "faculty" | "employee">;

type SignUpInput = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type AuthResult =
  | {
      ok: true;
      user: UserRecord;
    }
  | {
      ok: false;
      message: string;
    };

const MSU_STUDENT_DOMAIN = "@s.msumain.edu.ph";

let currentUser: UserRecord | null = null;
const listeners = new Set<() => void>();

const normalize = (value: string) => value.trim().toLowerCase();
const isSignupRole = (role: unknown): role is SignupRole =>
  role === "student" || role === "faculty" || role === "employee";
const isMsuStudentEmail = (email: string) =>
  normalize(email).endsWith(MSU_STUDENT_DOMAIN);

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
  };
}

function profileFromAuthUser(authUser: SupabaseAuthUser): UserRecord | null {
  const email = normalize(authUser.email ?? "");

  if (!email) {
    return null;
  }

  const metadata = authUser.user_metadata as Record<string, unknown>;
  const metadataUsername =
    typeof metadata.username === "string" ? metadata.username : "";
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
  const resolvedRole = resolveSignupRole(email, requestedRole);
  const username = normalize(metadataUsername || email.split("@")[0]);

  return {
    id: authUser.id,
    name: metadataName.trim() || username,
    role: resolvedRole.ok ? resolvedRole.role : "visitor",
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

async function findProfileByIdentifier(identifier: string) {
  const cleanIdentifier = normalize(identifier);

  if (cleanIdentifier.includes("@")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", cleanIdentifier)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? toPublicUser(data) : null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", cleanIdentifier)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? toPublicUser(data) : null;
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

  if (requestedRole === "admin") {
    return {
      ok: false,
      message: "Admin account creation is disabled. Use an existing Supabase admin account.",
    };
  }

  if (isMsuStudentEmail(cleanEmail)) {
    return {
      ok: true,
      role: requestedRole === "faculty" ? "faculty" : "student",
    };
  }

  return {
    ok: false,
    message: "Use your MSU student email ending in @s.msumain.edu.ph.",
  };
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
      setSignedInUser(profile);
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
      message: "Enter your username/email and password.",
    };
  }

  try {
    await syncAppData();

    const profile = await findProfileByIdentifier(cleanIdentifier);

    if (!profile && !cleanIdentifier.includes("@")) {
      return {
        ok: false,
        message:
          "Use your email address for the first sign-in. After the profile is restored, username sign-in will work.",
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

    setSignedInUser(signedInProfile);

    return {
      ok: true,
      user: signedInProfile,
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
  const username = input.username.trim();
  const email = normalize(input.email);
  const password = input.password.trim();

  if (!name || !username || !email || !password) {
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
        message: "Username is already registered.",
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
          username: normalize(username),
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
      username: normalize(username),
      email,
    };

    await saveProfile(user);
    setSignedInUser(user);

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
  const username = input.username.trim();
  const email = normalize(input.email);
  const password = input.password.trim();

  if (!name || !username || !email || !password) {
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
        message: "Username is already registered.",
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
          username: normalize(username),
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
      username: normalize(username),
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
    username: normalize(patch.username),
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
