import * as React from "react";
import {
  apiCreateUser,
  apiDeleteUser,
  apiSignIn,
  apiSignUp,
  apiUpdateUser,
  isBackendConfigured,
  setApiAuthToken,
} from "../data/apiClient";
import { deleteRecord, syncAppData, upsertRecord } from "../data/appStore";
import { UserRecord, UserRole, users } from "../data/mymsuDatabase";

type AuthAccount = Required<Pick<UserRecord, "passwordHash">> & UserRecord;
type PublicUserRole = Exclude<UserRole, "admin">;
type SignupRole = Extract<UserRole, "student" | "faculty" | "employee">;

type SignUpInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: SignupRole;
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

const DEMO_PASSWORDS: Record<string, string> = {
  student: "student123",
  visitor: "visitor123",
  admin: "admin123",
};

const GMAIL_DOMAIN = "@gmail.com";
const MSU_ACADEMIC_DOMAINS = ["@s.msumain.edu.ph", "@msumain.edu.ph"];

const hashPassword = (password: string) => `demo:${password}`;

const normalize = (value: string) => value.trim().toLowerCase();
const isMsuEmail = (email: string) =>
  MSU_ACADEMIC_DOMAINS.some((domain) => email.endsWith(domain));

const seedAccounts = users
  .filter((user) => !!user.passwordHash)
  .map<AuthAccount>((user) => ({
    ...user,
    passwordHash:
      user.passwordHash ??
      hashPassword(DEMO_PASSWORDS[user.username] ?? "password123"),
  }));

let accounts: AuthAccount[] = [...seedAccounts];
let currentUser: UserRecord | null = null;
const listeners = new Set<() => void>();

function toPublicUser(account: AuthAccount): UserRecord {
  const { passwordHash: _passwordHash, ...publicUser } = account;

  return publicUser;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setSignedInUser(user: UserRecord, token?: string) {
  currentUser = user;
  setApiAuthToken(token ?? null);

  if (!isBackendConfigured()) {
    upsertRecord("users", user);
  }

  emit();
}

function resolveSignupRole(
  email: string,
  requestedRole: UserRole,
): { ok: true; role: PublicUserRole } | { ok: false; message: string } {
  const cleanEmail = normalize(email);

  if (requestedRole === "admin") {
    return {
      ok: false,
      message: "Admin account creation is disabled. Use the fixed admin account.",
    };
  }

  if (cleanEmail.endsWith(GMAIL_DOMAIN)) {
    return {
      ok: true,
      role: "visitor",
    };
  }

  if (isMsuEmail(cleanEmail)) {
    return {
      ok: true,
      role:
        requestedRole === "student" ||
        requestedRole === "faculty" ||
        requestedRole === "employee"
          ? requestedRole
          : "student",
    };
  }

  return {
    ok: false,
    message:
      "Use a Gmail address for visitor access or an MSU email address for student, faculty, or employee access.",
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

export function getDemoAccounts() {
  return [
    {
      role: "student" as const,
      username: "student",
      password: "student123",
      label: "Student Account",
    },
    {
      role: "visitor" as const,
      username: "visitor",
      password: "visitor123",
      label: "Visitor Account",
    },
    {
      role: "admin" as const,
      username: "admin",
      password: "admin123",
      label: "Admin Account",
    },
  ];
}

export async function signIn(
  identifier: string,
  password: string,
): Promise<AuthResult> {
  const cleanIdentifier = normalize(identifier);
  const cleanPassword = password.trim();

  if (!cleanIdentifier || !cleanPassword) {
    return {
      ok: false,
      message: "Enter your username/email and password.",
    };
  }

  if (isBackendConfigured()) {
    try {
      await syncAppData();
      const result = await apiSignIn(cleanIdentifier, cleanPassword);
      setSignedInUser(result.user, result.token);

      return {
        ok: true,
        user: result.user,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to sign in through the backend.",
      };
    }
  }

  const account = accounts.find(
    (item) =>
      normalize(item.username) === cleanIdentifier ||
      normalize(item.email) === cleanIdentifier,
  );

  if (!account || account.passwordHash !== hashPassword(cleanPassword)) {
    return {
      ok: false,
      message: "Invalid account or password.",
    };
  }

  currentUser = toPublicUser(account);
  emit();

  return {
    ok: true,
    user: currentUser,
  };
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const name = input.name.trim();
  const username = input.username.trim();
  const email = input.email.trim();
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

  const resolvedRole = resolveSignupRole(email, input.role);

  if (!resolvedRole.ok) {
    return resolvedRole;
  }

  if (isBackendConfigured()) {
    try {
      await syncAppData();
      const result = await apiSignUp({
        name,
        username,
        email,
        password,
        role: resolvedRole.role,
      });

      setSignedInUser(result.user, result.token);

      return {
        ok: true,
        user: result.user,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create the account through the backend.",
      };
    }
  }

  const duplicate = accounts.some(
    (account) =>
      normalize(account.username) === normalize(username) ||
      normalize(account.email) === normalize(email),
  );

  if (duplicate) {
    return {
      ok: false,
      message: "Username or email is already registered.",
    };
  }

  const account: AuthAccount = {
    id: `user-${resolvedRole.role}-${Date.now()}`,
    name,
    role: resolvedRole.role,
    username,
    email,
    passwordHash: hashPassword(password),
  };

  accounts = [account, ...accounts];
  currentUser = toPublicUser(account);
  upsertRecord("users", currentUser);
  emit();

  return {
    ok: true,
    user: currentUser,
  };
}

export function signOut() {
  currentUser = null;
  setApiAuthToken(null);
  emit();
}

export async function createStudentAccount(input: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const name = input.name.trim();
  const username = input.username.trim();
  const email = input.email.trim();
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

  const duplicate = accounts.some(
    (account) =>
      normalize(account.username) === normalize(username) ||
      normalize(account.email) === normalize(email),
  );

  if (duplicate) {
    return {
      ok: false,
      message: "Username or email is already registered.",
    };
  }

  if (isBackendConfigured()) {
    try {
      const result = await apiCreateUser({
        name,
        username,
        email,
        password,
        role: "student",
      });
      upsertRecord("users", result.user);

      return {
        ok: true,
        user: result.user,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create the student account.",
      };
    }
  }

  const account: AuthAccount = {
    id: `user-student-${Date.now()}`,
    name,
    role: "student",
    username,
    email,
    passwordHash: hashPassword(password),
  };

  accounts = [account, ...accounts];
  const publicUser = toPublicUser(account);
  upsertRecord("users", publicUser);
  emit();

  return {
    ok: true,
    user: publicUser,
  };
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
  const account = accounts.find((item) => item.id === id);
  const nextEmail = patch.email.trim();
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

  if (isBackendConfigured()) {
    try {
      const result = await apiUpdateUser(id, {
        name: patch.name,
        username: patch.username,
        email: patch.email,
        password: patch.password?.trim() || undefined,
        role: "student",
      });
      upsertRecord("users", result.user);

      if (currentUser?.id === id) {
        currentUser = result.user;
      }

      emit();

      return {
        ok: true,
        user: result.user,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update the student account.",
      };
    }
  }

  if (!account || account.role !== "student") {
    return {
      ok: false,
      message: "Student account was not found.",
    };
  }

  const duplicate = accounts.some(
    (item) =>
      item.id !== id &&
      (normalize(item.username) === normalize(patch.username) ||
        normalize(item.email) === normalize(patch.email)),
  );

  if (duplicate) {
    return {
      ok: false,
      message: "Username or email is already registered.",
    };
  }

  const nextAccount: AuthAccount = {
    ...account,
    name: patch.name.trim(),
    username: patch.username.trim(),
    email: nextEmail,
    passwordHash: patch.password?.trim()
      ? hashPassword(patch.password.trim())
      : account.passwordHash,
  };

  accounts = accounts.map((item) => (item.id === id ? nextAccount : item));

  const publicUser = toPublicUser(nextAccount);
  upsertRecord("users", publicUser);

  if (currentUser?.id === id) {
    currentUser = publicUser;
  }

  emit();

  return {
    ok: true,
    user: publicUser,
  };
}

export async function deleteStudentAccount(id: string): Promise<AuthResult> {
  if (isBackendConfigured()) {
    try {
      await apiDeleteUser(id);
      deleteRecord("users", id);

      if (currentUser?.id === id) {
        currentUser = null;
      }

      emit();

      return {
        ok: true,
        user: {
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
            : "Unable to delete the student account.",
      };
    }
  }

  const account = accounts.find((item) => item.id === id);

  if (!account || account.role !== "student") {
    return {
      ok: false,
      message: "Student account was not found.",
    };
  }

  accounts = accounts.filter((item) => item.id !== id);
  deleteRecord("users", id);

  if (currentUser?.id === id) {
    currentUser = null;
  }

  emit();

  return {
    ok: true,
    user: toPublicUser(account),
  };
}
