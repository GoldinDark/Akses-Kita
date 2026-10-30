import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navLinkStyles =
  "inline-flex min-h-11 items-center rounded-lg px-3 font-medium text-ink hover:bg-brand-50";

export function SiteHeader() {
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

        {/* Dinonaktifkan sementara: halaman login dan kontribusi dibuat di fase berikutnya. */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled>
            Masuk
          </Button>
          <Button size="sm" disabled>
            Kontribusi
          </Button>
        </div>
      </div>
    </header>
  );
}
