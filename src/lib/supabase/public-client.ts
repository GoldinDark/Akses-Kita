import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk membaca data PUBLIK (tanpa login).
 * Memakai publishable key, yang aman berada di sisi publik karena
 * akses sebenarnya dibatasi oleh aturan RLS di database.
 * JANGAN pernah memakai secret key di sini.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diisi di .env.local (lalu restart npm run dev).",
    );
  }

  return createClient(url, key, {
    // Belum ada login, jadi tidak perlu menyimpan sesi.
    auth: { persistSession: false, autoRefreshToken: false },
  });
}