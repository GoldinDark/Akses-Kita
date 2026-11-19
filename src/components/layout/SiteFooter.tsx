import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-sm text-muted sm:px-6">
        <p className="font-semibold text-ink">AksesKita</p>
        <nav aria-label="Tautan footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <Link href="/tentang" className="underline">
                Tentang
              </Link>
            </li>
            <li>
              <Link href="/pedoman" className="underline">
                Pedoman observasi
              </Link>
            </li>
            <li>
              <Link href="/relawan" className="underline">
                Butuh relawan
              </Link>
            </li>
            <li>
              <Link href="/privasi" className="underline">
                Privasi
              </Link>
            </li>
          </ul>
        </nav>
        <p>
          Informasi akses berasal dari kontribusi komunitas dan bukan
          sertifikasi aksesibilitas. Kondisi di lapangan dapat berbeda atau
          berubah sewaktu-waktu.
        </p>
        <p>
          Peta dasar: &copy;{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            OpenStreetMap contributors<span className="sr-only"> (tab baru)</span>
          </a>
          , lisensi ODbL.
        </p>
        <p>
          Nama dan koordinat perkiraan tempat bersumber dari{" "}
          <a
            href="https://www.wikipedia.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Wikipedia<span className="sr-only"> (tab baru)</span>
          </a>
          , lisensi{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            CC BY-SA 4.0<span className="sr-only"> (tab baru)</span>
          </a>
          .
        </p>
      </div>
    </footer>
  );
}