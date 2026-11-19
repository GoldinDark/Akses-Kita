import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privasi",
  description: "Data apa yang dikumpulkan AksesKita dan untuk apa.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
        Privasi
      </h1>
      <p className="mt-6 text-lg text-muted">
        Halaman ini menjelaskan data apa yang AksesKita simpan dan untuk apa.
        AksesKita adalah proyek pilot, dan kebijakan ini bukan nasihat hukum.
      </p>

      <section aria-labelledby="dikumpulkan" className="mt-12">
        <h2 id="dikumpulkan" className="text-2xl font-bold">
          Data yang kami simpan
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
          <li>
            Bila Anda membuat akun: email, password (disimpan dalam bentuk
            terenkripsi satu arah oleh Supabase, kami tidak bisa
            membacanya), dan nama tampilan bila Anda mengisinya.
          </li>
          <li>
            Bila Anda hanya membaca peta dan daftar, Anda tidak perlu akun dan
            kami tidak meminta data apa pun.
          </li>
          <li>
            Kami tidak memasang pelacak iklan atau analitik pada situs ini.
          </li>
        </ul>
      </section>

      <section aria-labelledby="pihak-ketiga" className="mt-12">
        <h2 id="pihak-ketiga" className="text-2xl font-bold">
          Layanan pihak ketiga
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
          <li>
            <strong className="text-ink">Supabase</strong> menyimpan data akun
            dan data tempat.
          </li>
          <li>
            <strong className="text-ink">OpenStreetMap</strong> menyajikan
            gambar peta. Saat peta dimuat, browser Anda meminta gambar langsung
            ke server mereka, sehingga alamat IP Anda terlihat oleh
            OpenStreetMap. Kami tidak mengendalikan hal itu.
          </li>
          <li>
            <strong className="text-ink">Penyedia hosting</strong> mencatat
            permintaan ke situs ini sebagai log teknis.
          </li>
        </ul>
      </section>

      <section aria-labelledby="hak" className="mt-12">
        <h2 id="hak" className="text-2xl font-bold">
          Pilihan Anda
        </h2>
        <p className="mt-3 text-muted">
          Anda bisa memakai situs ini tanpa akun. Bila Anda ingin akun Anda
          dihapus, hubungi pengelola proyek melalui kontak yang tercantum di
          tempat Anda menemukan tautan situs ini.
        </p>
      </section>
    </div>
  );
}