/**
 * Placeholder panel peta. Peta interaktif (Leaflet) dibuat di Fase 4.
 * Panel ini sengaja jujur: tidak berpura-pura menjadi peta sungguhan.
 */
export function MapPanel() {
  return (
    <section
      aria-labelledby="map-heading"
      className="rounded-xl border border-line bg-surface p-5"
    >
      <h3 id="map-heading" className="text-lg font-bold">
        Peta
      </h3>
      <div className="mt-3 flex min-h-72 items-center justify-center rounded-lg border-2 border-dashed border-slate-400 bg-brand-50 p-6 text-center lg:min-h-[28rem]">
        <p className="max-w-xs text-brand-900">
          Peta interaktif belum aktif. Gunakan daftar tempat untuk melihat
          informasi akses.
        </p>
      </div>
      <p className="mt-3 text-sm text-muted">
        Peta hanya pelengkap. Semua informasi tetap tersedia di daftar tempat.
      </p>
    </section>
  );
}
