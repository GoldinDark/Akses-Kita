import { StatusLegend } from "@/components/accessibility/StatusLegend";
import { HomeExplorer } from "@/components/places/HomeExplorer";
import { StateMessage } from "@/components/ui/StateMessage";
import { getPublishedPlaces } from "@/lib/places/repository";

// Data diambil dari database pada setiap kunjungan, bukan dibekukan saat build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await getPublishedPlaces();

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