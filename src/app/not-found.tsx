import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="text-muted">
        Alamat yang Anda buka tidak ada, atau tempatnya belum dipublikasikan.
      </p>
      <Link href="/" className={buttonStyles({ size: "md" })}>
        Kembali ke beranda
      </Link>
    </div>
  );
}