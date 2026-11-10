"use client";

import dynamic from "next/dynamic";
import { MapErrorBoundary } from "@/components/map/MapErrorBoundary";
import { MapLegend } from "@/components/map/MapLegend";
import type { PlaceMapProps } from "@/components/map/PlaceMap";
import { StateMessage } from "@/components/ui/StateMessage";

// Leaflet membutuhkan `window`, yang tidak ada di server. ssr: false membuat
// peta hanya dimuat di browser, sehingga tidak ada error hydration.
const PlaceMap = dynamic(
  () => import("@/components/map/PlaceMap").then((module) => module.PlaceMap),
  {
    ssr: false,
    loading: () => (
      <StateMessage
        variant="loading"
        title="Memuat peta..."
        description="Daftar tempat tetap bisa dipakai selagi peta dimuat."
      />
    ),
  },
);

export function MapPanel(props: PlaceMapProps) {
  return (
    <section
      aria-labelledby="map-heading"
      className="rounded-xl border border-line bg-surface p-5"
    >
      <h3 id="map-heading" className="text-lg font-bold">
        Peta
      </h3>

      {/* isolate: lapisan peta tidak boleh menimpa elemen lain, seperti tautan "Lewati". */}
      <div className="isolate mt-3">
        <MapErrorBoundary>
          <PlaceMap {...props} />
        </MapErrorBoundary>
      </div>

      <MapLegend />
      <p className="mt-3 text-sm text-muted">
        Peta hanya pelengkap. Semua informasi tetap tersedia di daftar tempat.
      </p>
    </section>
  );
}