import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Membuat klien Supabase untuk server memakai SUPABASE_URL dan SUPABASE_SECRET_KEY.
 * Hanya digunakan di sisi server (Server Component, Server Action, Route Handler).
 */
export function buatKlienServer() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createClient = buatKlienServer;

