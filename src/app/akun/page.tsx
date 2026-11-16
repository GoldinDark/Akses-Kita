import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Akun saya",
  robots: { index: false },
};

const ROLE_LABELS: Record<string, string> = {
  user: "Pengguna",
  moderator: "Moderator",
  admin: "Administrator",
};

export default async function AccountPage() {
  // Lapis kedua: proxy.ts sudah menjaga halaman ini, tetapi halaman tidak
  // boleh bergantung pada satu penjaga saja.
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=/akun");

  // Dibaca lewat RLS: pengguna hanya bisa melihat profilnya sendiri.
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight">Akun saya</h1>

      <dl className="space-y-4 rounded-xl border border-line bg-surface p-6">
        <div>
          <dt className="text-sm text-muted">Email</dt>
          <dd className="font-semibold">{user.email ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Nama tampilan</dt>
          <dd className="font-semibold">
            {profile?.display_name ?? "Belum diisi"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Peran</dt>
          <dd className="font-semibold">
            {profile ? (ROLE_LABELS[profile.role] ?? profile.role) : "Tidak diketahui"}
          </dd>
        </div>
      </dl>
    </div>
  );
}