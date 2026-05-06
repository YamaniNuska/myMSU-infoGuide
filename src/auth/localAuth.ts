import * as React from "react";
import { deleteRecord, upsertRecord } from "../data/appStore";
import { UserRecord, UserRole, users } from "../data/mymsuDatabase";

type AuthAccount = Required<Pick<UserRecord, "passwordHash">> & UserRecord;

type SignUpInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Extract<UserRole, "student" | "admin">;
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
  admin: "admin123",
};

const hashPassword = (password: string) => `demo:${password}`;

const normalize = (value: string) => value.trim().toLowerCase();

const seedAccounts = users
  .filter((user) => user.role === "student" || user.role === "admin")
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
  return { ...account };
}

function emit() {
  listeners.forEach((listener) => listener());
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
      role: "admin" as const,
      username: "admin",
      password: "admin123",
      label: "Admin Account",
    },
  ];
}

export function signIn(identifier: string, password: string): AuthResult {
  const cleanIdentifier = normalize(identifier);
  const cleanPassword = password.trim();

  if (!cleanIdentifier || !cleanPassword) {
    return {
      ok: false,
      message: "Enter your username/email and password.",
    };
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

export function signUp(input: SignUpInput): AuthResult {
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

  if (password.length < 6) {
    return {
      ok: false,
      message: "Password must be at least 6 characters.",
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

  const account: AuthAccount = {
    id: `user-${input.role}-${Date.now()}`,
    name,
    role: input.role,
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
  emit();
}

export function createStudentAccount(input: {
  name: string;
  username: string;
  email: string;
  password: string;
}): AuthResult {
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

export function updateStudentAccount(
  id: string,
  patch: {
    name: string;
    username: string;
    email: string;
    password?: string;
  },
): AuthResult {
  const account = accounts.find((item) => item.id === id);

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
    email: patch.email.trim(),
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

export function deleteStudentAccount(id: string): AuthResult {
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
