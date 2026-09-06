import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Storage bucket name specified by user
export const STORAGE_BUCKET = "product-images";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

/**
 * Check if real Supabase credentials have been configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project-id") &&
    supabaseKey &&
    !supabaseKey.includes("your-supabase-publishable")
  );
}

// Fallback dummy client for build time or before credentials are set
const dummyUrl = "https://placeholder-project.supabase.co";
const dummyKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : dummyUrl,
  isSupabaseConfigured() ? supabaseKey : dummyKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
