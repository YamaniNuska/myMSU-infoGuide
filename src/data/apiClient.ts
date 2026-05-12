import type { AppData } from "./appStore";
import type { UserRecord, UserRole } from "./mymsuDatabase";

type ApiErrorBody = {
  message?: string;
  error?: string;
};

export type AuthApiResult = {
  user: UserRecord;
  token?: string;
};

export type SignUpApiInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
};

export type UserApiInput = {
  name: string;
  username: string;
  email: string;
  password?: string;
  role?: Exclude<UserRole, "admin">;
};

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

let authToken: string | null = null;

export function isBackendConfigured() {
  return API_BASE_URL.length > 0;
}

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

async function getErrorMessage(response: Response) {
  const fallback = `Backend request failed with status ${response.status}.`;

  try {
    const body = (await response.json()) as ApiErrorBody;

    return body.message ?? body.error ?? fallback;
  } catch {
    return fallback;
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  if (!isBackendConfigured()) {
    throw new Error("Backend API is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiGetData() {
  return apiRequest<AppData>("/api/data");
}

export async function apiSeedData(data: AppData) {
  return apiRequest<AppData>("/api/data/seed", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpsertRecord(
  collection: keyof AppData,
  item: AppData[keyof AppData][number],
) {
  return apiRequest<{ item: AppData[keyof AppData][number] }>(
    `/api/data/${encodeURIComponent(collection)}`,
    {
      method: "POST",
      body: JSON.stringify(item),
    },
  );
}

export async function apiDeleteRecord(collection: keyof AppData, id: string) {
  return apiRequest<void>(
    `/api/data/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}

export async function apiSignIn(identifier: string, password: string) {
  return apiRequest<AuthApiResult>("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function apiSignUp(input: SignUpApiInput) {
  return apiRequest<AuthApiResult>("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function apiCreateUser(input: Required<UserApiInput>) {
  return apiRequest<{ user: UserRecord }>("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function apiUpdateUser(id: string, input: UserApiInput) {
  return apiRequest<{ user: UserRecord }>(
    `/api/users/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export async function apiDeleteUser(id: string) {
  return apiRequest<void>(`/api/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
