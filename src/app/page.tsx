import { DEMO_PLACES } from "@/data/demo-places";
import { StatusLegend } from "@/components/accessibility/StatusLegend";
import { HomeExplorer } from "@/components/places/HomeExplorer";
import { SearchPanel } from "@/components/places/SearchPanel";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 sm:py-12">
      <section aria-labelledby="hero-heading" className="space-y-4">
        <h1
          id="hero-heading"
          className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Cari tahu akses fisik sebuah tempat sebelum Anda berkunjung
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          AksesKita menyajikan informasi aksesibilitas tempat umum yang
          spesifik, transparan, dan dapat diperbarui bersama komunitas.
        </p>
      </section>

      <SearchPanel />

      <HomeExplorer places={DEMO_PLACES} />

      <section
        id="cara-menggunakan"
        aria-labelledby="howto-heading"
        className="scroll-mt-4 space-y-4"
      >
        <h2 id="howto-heading" className="text-2xl font-bold">
          Cara membaca status
        </h2>
        <p className="max-w-3xl text-muted">
          Setiap atribut akses punya status sendiri. AksesKita tidak memberi
          satu skor yang menyebut sebuah tempat &quot;aksesibel&quot;, karena
          kebutuhan setiap orang berbeda.
        </p>
        <StatusLegend />
        <p className="max-w-3xl text-sm text-muted">
          Informasi berasal dari kontribusi komunitas dan bukan sertifikasi
          aksesibilitas. Selalu periksa tanggal observasi, dan hubungi pengelola
          tempat bila Anda membutuhkan kepastian.
        </p>
      </section>
    </div>
  );
}
