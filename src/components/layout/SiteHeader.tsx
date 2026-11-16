import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/Button";
import { signOut } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

const navLinkStyles =
  "inline-flex min-h-11 items-center rounded-lg px-3 font-medium text-ink hover:bg-brand-50";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold text-brand-800">
          AksesKita
        </Link>

        <nav aria-label="Navigasi utama">
          <ul className="flex flex-wrap gap-1">
            <li>
              <Link href="/" className={navLinkStyles}>
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/#cara-menggunakan" className={navLinkStyles}>
                Cara menggunakan
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-wrap gap-2">
          {user ? (
            <>
              <Link
                href="/akun"
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Akun saya
              </Link>
              {/* Keluar memakai form + server action agar dikirim lewat POST. */}
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Keluar
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className={buttonStyles({ variant: "secondary", size: "sm" })}
              >
                Masuk
              </Link>
              <Link href="/daftar" className={buttonStyles({ size: "sm" })}>
                Daftar
              </Link>
            </>
          )}
          {/* Dinonaktifkan sementara: fitur kontribusi dibuat di fase berikutnya. */}
          <Button size="sm" disabled>
            Kontribusi
          </Button>
        </div>
      </div>
    </header>
  );
}