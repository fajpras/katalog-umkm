import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat klien Supabase untuk sesi admin menggunakan @supabase/ssr dan cookies.
 * Memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 * Digunakan untuk login, keluar, ganti password, dan aksi terproteksi admin lainnya.
 */
export async function buatKlienSesi() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Abaikan jika dipanggil dari Server Component (read-only)
        }
      },
    },
  });
}

export const buatKlienAuth = buatKlienSesi;

