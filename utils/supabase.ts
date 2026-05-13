import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  process.env.REACT_APP_SUPABASE_URL ??
  "";
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ??
  "";
const configured = supabaseUrl.length > 0 && supabaseKey.length > 0;
const fallbackUrl = "https://example.supabase.co";
const fallbackKey = "public-anon-key";
const localStorage =
  typeof globalThis !== "undefined" && "localStorage" in globalThis
    ? globalThis.localStorage
    : undefined;

export function isSupabaseConfigured() {
  return configured;
}

export const supabase = createClient(
  configured ? supabaseUrl : fallbackUrl,
  configured ? supabaseKey : fallbackKey,
  {
    auth: {
      persistSession: configured && !!localStorage,
      autoRefreshToken: configured,
      detectSessionInUrl: false,
      storage: localStorage,
    },
  },
);
