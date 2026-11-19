import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  STATUS_DESCRIPTIONS,
  STATUS_ORDER,
} from "@/lib/accessibility";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { AttributeCode } from "@/types/place";

export const metadata: Metadata = {
  title: "Pedoman observasi",
  description:
    "Cara mengamati dan mencatat akses fisik sebuah tempat dengan jujur dan seragam.",
};

// Yang diperiksa untuk tiap atribut. Kami meminta Anda mencatat apa yang terlihat,
// bukan menilai apakah memenuhi standar tertentu.
const WHAT_TO_CHECK: Record<AttributeCode, string> = {
  step_free_entrance:
    "Apakah Anda bisa sampai ke pintu masuk utama tanpa melewati anak tangga atau undakan?",
  ramp: "Apakah ada ramp? Catat juga bila ada ramp tetapi tampak terlalu curam, licin, atau terhalang.",
  elevator:
    "Apakah ada lift, dan apakah berfungsi? Pilih Tidak relevan bila bangunan hanya satu lantai.",
  accessible_toilet:
    "Apakah ada toilet yang ditandai untuk penyandang disabilitas, dan apakah pintunya bisa dilalui kursi roda?",
  accessible_parking:
    "Apakah ada tempat parkir yang ditandai khusus, dekat dengan pintu masuk?",
  path_to_entrance:
    "Apakah jalur dari tempat turun kendaraan atau parkir ke pintu masuk rata dan tidak terhalang?",
};

const STEPS = [
  {
    title: "Datang dan amati",
    text: "Amati dari area yang terbuka untuk umum. Jangan masuk ke area yang dibatasi.",
  },
  {
    title: "Catat apa yang Anda lihat",
    text: "Tulis kondisi nyata hari itu, beserta tanggalnya. Jangan menilai apakah memenuhi standar.",
  },
  {
    title: "Pilih status yang jujur",
    text: "Bila ragu atau tidak sempat memeriksa, pilih Belum diketahui.",
  },
];

const RULES = [
  "Jangan memotret wajah orang. Foto hanya untuk fasilitasnya.",
  "Minta izin pengelola bila perlu masuk ke area dalam.",
  "Jangan memperkirakan. Yang tidak Anda periksa, biarkan Belum diketahui.",
  "Catat tanggal observasi. Kondisi lapangan bisa berubah.",
];

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
        Pedoman observasi
      </h1>
      <p className="mt-6 text-lg text-muted">
        Pedoman ini membuat catatan dari banyak relawan tetap seragam dan jujur.
        Membaca satu halaman ini sudah cukup untuk mulai.
      </p>

      <section aria-labelledby="langkah" className="mt-12">
        <h2 id="langkah" className="text-2xl font-bold">
          Tiga langkah
        </h2>
        <ol className="mt-6 flex flex-col gap-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-800 font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="atribut" className="mt-12">
        <h2 id="atribut" className="text-2xl font-bold">
          Yang diperiksa
        </h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {ATTRIBUTE_CODES.map((code) => (
            <div key={code} className="py-4">
              <dt className="font-bold">{ATTRIBUTE_LABELS[code]}</dt>
              <dd className="mt-1 text-muted">{WHAT_TO_CHECK[code]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="status" className="mt-12">
        <h2 id="status" className="text-2xl font-bold">
          Memilih status
        </h2>
        <ul className="mt-6 flex flex-col gap-4">
          {STATUS_ORDER.map((status) => (
            <li key={status} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <span className="sm:w-44 sm:shrink-0">
                <StatusBadge status={status} />
              </span>
              <span className="text-muted">{STATUS_DESCRIPTIONS[status]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="aturan" className="mt-12 rounded-2xl bg-accent-50 p-6">
        <h2 id="aturan" className="text-2xl font-bold text-accent-800">
          Aturan penting
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-sm text-muted">
        Catatan Anda adalah pengamatan, bukan sertifikasi aksesibilitas.
      </p>

      <div className="mt-6">
        <Link href="/relawan" className={buttonStyles({ size: "md" })}>
          Pilih tempat untuk diamati
        </Link>
      </div>
    </div>
  );
}