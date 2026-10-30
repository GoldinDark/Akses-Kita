import type { Metadata } from "next";
import { StatusLegend } from "@/components/accessibility/StatusLegend";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StateMessage } from "@/components/ui/StateMessage";

// Halaman ini hanya alat bantu pengembangan. Akan dihapus sebelum rilis (Fase 10).
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold">Design system (alat pengembangan)</h1>

      <section aria-labelledby="ds-buttons" className="space-y-4">
        <h2 id="ds-buttons" className="text-2xl font-bold">
          Tombol
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button>Utama</Button>
          <Button variant="secondary">Sekunder</Button>
          <Button variant="ghost">Teks</Button>
          <Button disabled>Nonaktif</Button>
        </div>
      </section>

      <section aria-labelledby="ds-input" className="max-w-md space-y-4">
        <h2 id="ds-input" className="text-2xl font-bold">
          Kolom isian
        </h2>
        <Input
          id="ds-normal"
          label="Nama tempat"
          hint="Tulis nama yang dikenal warga."
        />
        <Input
          id="ds-error"
          label="Alamat"
          defaultValue="x"
          error="Alamat terlalu pendek. Tulis minimal 5 karakter."
        />
      </section>

      <section aria-labelledby="ds-status" className="space-y-4">
        <h2 id="ds-status" className="text-2xl font-bold">
          Status akses
        </h2>
        <StatusLegend />
      </section>

      <section aria-labelledby="ds-states" className="space-y-4">
        <h2 id="ds-states" className="text-2xl font-bold">
          Loading, kosong, dan error
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <StateMessage
            variant="loading"
            title="Memuat data tempat..."
            description="Mohon tunggu sebentar."
          />
          <StateMessage
            variant="empty"
            title="Tidak ada hasil"
            description="Coba ubah kata kunci atau kurangi filter."
          />
          <StateMessage
            variant="error"
            title="Data gagal dimuat"
            description="Periksa koneksi internet Anda, lalu coba lagi."
          >
            <Button variant="secondary" size="sm">
              Coba lagi
            </Button>
          </StateMessage>
        </div>
      </section>
    </div>
  );
}
