import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/auth/validation";

export const metadata: Metadata = {
  title: "Daftar",
  robots: { index: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  if (await getCurrentUser()) redirect(nextPath);

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight">Daftar akun</h1>
      <p className="text-muted">
        Akun dibutuhkan untuk berkontribusi. Membaca informasi di AksesKita
        tidak memerlukan akun.
      </p>
      <RegisterForm next={nextPath} />
    </div>
  );
}