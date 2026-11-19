import type { Metadata } from "next";
import Link from "next/link";
import { StateMessage } from "@/components/ui/StateMessage";
import { buttonStyles } from "@/components/ui/Button";
import { ATTRIBUTE_CODES, CATEGORY_LABELS } from "@/lib/accessibility";
import { getPublishedPlaces } from "@/lib/places/repository";

export const metadata: Metadata = {
  title: "Butuh relawan",
  description:
    "Tempat di Bandung yang informasi aksesnya masih belum diketahui dan perlu diamati.",
};

// Data diambil dari database pada setiap kunjungan.
export const dynamic = "force-dynamic";

export default async function VolunteerPage() {
  const result = await getPublishedPlaces();

  // Tempat demo dikeluarkan: datanya simulasi, jadi tidak perlu diamati.
  const needs = result.ok
    ? result.places
        .filter((place) => !place.isDemo)
        .map((place) => ({
          place,
          unknownCount: ATTRIBUTE_CODES.filter(
            (code) => place.attributes[code] === "unknown",
          ).length,
        }))
        .filter((item) => item.unknownCount > 0)
        .sort(
          (a, b) =>
            b.unknownCount - a.unknownCount ||
            a.place.name.localeCompare(b.place.name, "id"),
        )
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
        Butuh relawan
      </h1>
      <p className="mt-6 text-lg text-muted">
        Tempat di bawah ini masih punya atribut akses yang belum diketahui.
        Urutannya dari yang paling banyak. Setiap pengamatan membantu orang lain
        merencanakan perjalanan.
      </p>

      <aside className="mt-8 rounded-2xl bg-accent-50 p-6">
        <h2 className="text-xl font-bold text-accent-800">Cara ikut membantu</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-6">
          <li>Baca pedoman observasi (cukup satu halaman).</li>
          <li>Pilih tempat dari daftar, lalu amati langsung.</li>
          <li>Catat kondisi dan tanggalnya dengan jujur.</li>
        </ol>
        <p className="mt-4 text-sm text-accent-800">
          Pengiriman catatan lewat situs ini belum tersedia di versi pilot.
          Untuk sementara, pengamatan Anda dikumpulkan oleh pengelola proyek.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pedoman"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent-700 px-5 font-semibold text-white hover:bg-accent-800"
          >
            Baca pedoman
          </Link>
          <Link
            href="/daftar"
            className={buttonStyles({ variant: "secondary", size: "md" })}
          >
            Buat akun relawan
          </Link>
        </div>
      </aside>

      <section aria-labelledby="daftar-tempat" className="mt-12">
        <h2 id="daftar-tempat" className="text-2xl font-bold">
          Tempat yang perlu diamati
          {result.ok ? ` (${needs.length})` : ""}
        </h2>

        {!result.ok ? (
          <div className="mt-6">
            <StateMessage
              variant="error"
              title="Data tempat belum bisa dimuat"
              description={result.message}
            />
          </div>
        ) : needs.length === 0 ? (
          <div className="mt-6">
            <StateMessage
              variant="empty"
              title="Belum ada tempat yang menunggu"
              description="Semua tempat sudah punya catatan. Terima kasih!"
            />
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {needs.map(({ place, unknownCount }) => (
              <li
                key={place.id}
                className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold">{place.name}</h3>
                  <p className="text-sm text-muted">
                    {CATEGORY_LABELS[place.category]}, {place.area}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-accent-800">
                    {unknownCount} dari {ATTRIBUTE_CODES.length} atribut belum
                    diketahui
                  </p>
                </div>
                <Link
                  href={`/tempat/${place.id}`}
                  className={buttonStyles({ variant: "secondary", size: "sm" })}
                  aria-label={`Lihat detail ${place.name}`}
                >
                  Lihat detail
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}