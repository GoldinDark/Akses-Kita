import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StateMessage } from "@/components/ui/StateMessage";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
  STATUS_DESCRIPTIONS,
} from "@/lib/accessibility";
import { getPlaceById } from "@/lib/places/repository";
import { SOURCE_LABELS } from "@/lib/places/source";
import { formatDate } from "@/lib/utils/date";

// Data diambil dari database pada setiap kunjungan.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getPlaceById(id);
  if (!result.ok || !result.place) return { title: "Tempat tidak ditemukan" };
  return {
    title: result.place.name,
    description: `Informasi akses fisik ${result.place.name} di ${result.place.area}.`,
  };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPlaceById(id);

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <StateMessage
          variant="error"
          title="Data tempat belum bisa dimuat"
          description={result.message}
        />
      </div>
    );
  }
  if (!result.place) notFound();

  const place = result.place;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${place.latitude}&mlon=${place.longitude}#map=18/${place.latitude}/${place.longitude}`;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Navigasi halaman">
        <Link href="/" className="font-semibold text-brand-800 underline">
          &larr; Kembali ke peta dan daftar
        </Link>
      </nav>

      <header className="space-y-2">
        {place.isDemo ? (
          <p className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-900">
            Data demo (simulasi)
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight">{place.name}</h1>
        <p className="text-lg text-muted">
          {CATEGORY_LABELS[place.category]} · {place.area}
        </p>
        <p className="text-muted">
          Observasi terakhir:{" "}
          {place.observedAt ? formatDate(place.observedAt) : "belum pernah diobservasi"}
          {place.isDemo ? " (simulasi)" : ""}
        </p>
      </header>

      <section aria-labelledby="status-heading" className="space-y-4">
        <h2 id="status-heading" className="text-2xl font-bold">
          Status akses fisik
        </h2>
        <ul className="space-y-3">
          {ATTRIBUTE_CODES.map((code) => {
            const detail = place.attributeDetails[code];
            return (
              <li
                key={code}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{ATTRIBUTE_LABELS[code]}</h3>
                  <StatusBadge status={detail.status} />
                </div>
                <p className="mt-2 text-sm text-muted">
                  {STATUS_DESCRIPTIONS[detail.status]}
                </p>
                <p className="mt-2 text-sm">
                  {detail.observedOn
                    ? `Diamati: ${formatDate(detail.observedOn)}${
                        detail.sourceType
                          ? ` · Sumber: ${SOURCE_LABELS[detail.sourceType]}`
                          : ""
                      }`
                    : "Belum ada observasi untuk atribut ini."}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="location-heading" className="space-y-2">
        <h2 id="location-heading" className="text-2xl font-bold">
          Lokasi
        </h2>
        <p className="text-muted">
          Koordinat: {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
          {place.isDemo ? " (posisi simulasi)" : ""}
        </p>
        <p>
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-800 underline"
          >
            Buka di OpenStreetMap (tab baru)
          </a>
        </p>
      </section>

      <section aria-label="Catatan penting" className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        <p>
          Informasi berasal dari kontribusi komunitas dan bukan sertifikasi
          aksesibilitas. &quot;Belum diketahui&quot; berarti belum ada bukti,
          bukan berarti fasilitasnya tidak ada. Hubungi pengelola tempat bila
          Anda membutuhkan kepastian.
        </p>
      </section>
    </div>
  );
}