import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/Button";
import { HeaderMenu } from "@/components/layout/HeaderMenu";
import { signOut } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

const navLinkStyles =
  "inline-flex min-h-11 items-center rounded-lg px-3 font-medium text-ink hover:bg-brand-50";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-brand-900">
          AksesKita
        </Link>

        {/* Di ponsel dilipat menjadi tombol "Menu"; di layar lebar tampil biasa. */}
        <HeaderMenu>
          <nav aria-label="Navigasi utama">
            <ul className="flex flex-col gap-1 md:flex-row">
              <li>
                <Link href="/" className={navLinkStyles}>
                  Beranda
                </Link>
              </li>
                            <li>
                <Link href="/relawan" className={navLinkStyles}>
                  Butuh relawan
                </Link>
              </li>
              <li>
                <Link href="/pedoman" className={navLinkStyles}>
                  Pedoman
                </Link>
              </li>
              <li>
                <Link href="/tentang" className={navLinkStyles}>
                  Tentang
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
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
          </div>
        </HeaderMenu>
      </div>
    </header>
  );
}