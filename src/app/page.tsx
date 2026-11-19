import Link from "next/link";
import { StatusLegend } from "@/components/accessibility/StatusLegend";
import { HomeExplorer } from "@/components/places/HomeExplorer";
import { StateMessage } from "@/components/ui/StateMessage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { buttonStyles } from "@/components/ui/Button";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/accessibility";
import { getPublishedPlaces } from "@/lib/places/repository";
import { formatDate } from "@/lib/utils/date";

// Data diambil dari database pada setiap kunjungan, bukan dibekukan saat build.
export const dynamic = "force-dynamic";

const PRINCIPLES = [
  {
    title: "Belum diketahui bukan berarti tidak ada",
    text: "Atribut yang belum pernah diamati ditandai Belum diketahui. Kami tidak menebak.",
  },
  {
    title: "Tidak ada satu skor",
    text: "Kebutuhan setiap orang berbeda, jadi setiap atribut punya status sendiri.",
  },
  {
    title: "Tanggal dan sumber selalu tampil",
    text: "Kondisi di lapangan bisa berubah. Periksa tanggal observasi sebelum berangkat.",
  },
];

export default async function HomePage() {
  const result = await getPublishedPlaces();

  // Contoh catatan di bagian atas: tempat demo pertama (jika ada), selalu berlabel simulasi.
  const specimen = result.ok
    ? (result.places.find((place) => place.isDemo) ?? null)
    : null;

  return (
    <>
      <section
        aria-labelledby="hero-heading"
        className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pb-20 lg:pt-20"
      >
        <div>
          <h1
            id="hero-heading"
            className="text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-900 sm:text-5xl lg:text-6xl"
          >
            Tahu akses sebuah tempat sebelum Anda berangkat.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Catatan pintu masuk, ramp, lift, toilet, dan parkir di tempat umum
            Bandung. Setiap catatan menyebut tanggal dan sumbernya, dan dibuat
            agar warga bisa ikut memperbaruinya.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#jelajah" className={buttonStyles({ size: "md" })}>
              Cari tempat
            </a>
            <Link
              href="/daftar"
              className={buttonStyles({ variant: "secondary", size: "md" })}
            >
              Bergabung
            </Link>
          </div>
        </div>

        {specimen ? (
          <aside
            aria-labelledby="specimen-heading"
            className="mt-12 hidden rounded-2xl border border-line bg-surface p-6 md:block lg:mt-0 lg:p-8"
          >
            <p className="text-sm text-muted">
              Contoh catatan (data demo, simulasi)
            </p>
            <h2 id="specimen-heading" className="mt-2 text-2xl font-bold">
              {specimen.name}
            </h2>
            <p className="text-muted">
              {CATEGORY_LABELS[specimen.category]}, {specimen.area}
            </p>
            <dl className="mt-5 divide-y divide-line">
              {ATTRIBUTE_CODES.map((code) => (
                <div
                  key={code}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <dt className="text-sm">{ATTRIBUTE_LABELS[code]}</dt>
                  <dd className="shrink-0">
                    <StatusBadge status={specimen.attributes[code]} />
                  </dd>
                </div>
              ))}
            </dl>
            {specimen.observedAt ? (
              <p className="mt-4 text-sm text-muted">
                Diamati (simulasi): {formatDate(specimen.observedAt)}
              </p>
            ) : null}
          </aside>
        ) : null}
      </section>

      <div id="jelajah" className="scroll-mt-4 border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {!result.ok ? (
            <StateMessage
              variant="error"
              title="Data tempat belum bisa dimuat"
              description={result.message}
            />
          ) : result.places.length === 0 ? (
            <StateMessage
              variant="empty"
              title="Belum ada tempat yang dipublikasikan"
              description="Data akan muncul di sini setelah tempat pertama dipublikasikan."
            />
          ) : (
            <HomeExplorer places={result.places} />
          )}
        </div>
      </div>

      <section
        id="cara-menggunakan"
        aria-labelledby="howto-heading"
        className="mx-auto max-w-6xl scroll-mt-4 px-4 py-14 sm:px-6 sm:py-20"
      >
        <h2 id="howto-heading" className="max-w-2xl text-3xl font-bold">
          Cara kami mencatat dan cara Anda membacanya
        </h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <li key={item.title}>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <StatusLegend />
        </div>
        <p className="mt-6 max-w-3xl text-sm text-muted">
          Informasi ini bukan sertifikasi aksesibilitas. Hubungi pengelola
          tempat bila Anda membutuhkan kepastian.
        </p>
      </section>

      <section
        aria-labelledby="join-heading"
        className="border-y border-accent-100 bg-accent-50"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2
              id="join-heading"
              className="text-2xl font-bold text-accent-800"
            >
              Tempat di sekitar Anda belum tercatat?
            </h2>
            <p className="mt-2 text-accent-800">
              Fitur kirim observasi sedang disiapkan. Buat akun sekarang agar
              siap ikut mencatat saat fitur itu dibuka.
            </p>
          </div>
          <Link
            href="/daftar"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-accent-700 px-6 font-semibold text-white transition-colors hover:bg-accent-800"
          >
            Buat akun
          </Link>
        </div>
      </section>
    </>
  );
}