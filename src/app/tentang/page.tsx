import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Tentang AksesKita",
  description:
    "AksesKita adalah peta komunitas tentang akses fisik tempat umum di Bandung.",
};

const PRINCIPLES = [
  {
    title: "Belum diketahui bukan berarti tidak ada",
    text: "Atribut yang belum pernah diamati ditandai Belum diketahui. Kami tidak menebak, dan status itu tidak pernah dihitung sebagai sesuai kebutuhan Anda.",
  },
  {
    title: "Tidak ada satu skor",
    text: "Kebutuhan setiap orang berbeda. Karena itu setiap atribut punya status sendiri, dan tidak ada nilai gabungan yang menyatakan sebuah tempat ramah atau tidak.",
  },
  {
    title: "Tanggal dan sumber selalu tampil",
    text: "Kondisi di lapangan bisa berubah. Setiap catatan menyebut kapan diamati dan dari mana asalnya.",
  },
  {
    title: "Dibuat oleh warga, untuk warga",
    text: "Siapa pun boleh membaca. Relawan membantu mengamati dan memperbarui catatan, supaya informasinya tidak bergantung pada satu orang.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
        Tentang AksesKita
      </h1>
      <p className="mt-6 text-lg text-muted">
        AksesKita adalah peta komunitas yang mencatat akses fisik tempat umum
        di Bandung: pintu masuk, ramp, lift, toilet, dan parkir. Tujuannya
        sederhana: Anda bisa tahu keadaan sebuah tempat sebelum berangkat.
      </p>

      <section aria-labelledby="prinsip" className="mt-12">
        <h2 id="prinsip" className="text-2xl font-bold">
          Cara kami bekerja
        </h2>
        <ul className="mt-6 flex flex-col gap-6">
          {PRINCIPLES.map((item) => (
            <li key={item.title} className="border-l-4 border-brand-700 pl-5">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-1 text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="status" className="mt-12">
        <h2 id="status" className="text-2xl font-bold">
          Status saat ini
        </h2>
        <p className="mt-3 text-muted">
          AksesKita masih versi pilot dan dibuat sebagai proyek belajar. Yang
          perlu Anda ketahui:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
          <li>
            Sebagian besar tempat baru memuat nama dan koordinat perkiraan dari
            Wikipedia. Informasi aksesnya belum diketahui sampai ada yang
            mengamatinya.
          </li>
          <li>
            Tempat bertanda &quot;Data demo&quot; adalah simulasi dan bukan
            fakta.
          </li>
          <li>
            Informasi di sini bukan sertifikasi aksesibilitas. Hubungi
            pengelola tempat bila Anda membutuhkan kepastian.
          </li>
          <li>
            Situs ini belum diaudit penuh terhadap WCAG. Targetnya WCAG 2.2 AA,
            dan kami belum menyatakan sudah memenuhinya.
          </li>
        </ul>
      </section>

      <section aria-labelledby="sumber" className="mt-12">
        <h2 id="sumber" className="text-2xl font-bold">
          Sumber data
        </h2>
        <p className="mt-3 text-muted">
          Peta dasar dari OpenStreetMap contributors (lisensi ODbL). Nama dan
          koordinat perkiraan tempat dari Wikipedia (lisensi CC BY-SA 4.0).
          Status akses hanya berasal dari observasi yang dicatat di sini.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/relawan" className={buttonStyles({ size: "md" })}>
          Lihat yang butuh relawan
        </Link>
        <Link
          href="/pedoman"
          className={buttonStyles({ variant: "secondary", size: "md" })}
        >
          Baca pedoman observasi
        </Link>
      </div>
    </div>
  );
}