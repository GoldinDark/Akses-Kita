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
      <div className="p-5">
        <StateMessage
          variant="loading"
          title="Memuat peta..."
          description="Daftar tempat tetap bisa dipakai selagi peta dimuat."
        />
      </div>
    ),
  },
);

export function MapPanel(props: PlaceMapProps) {
  return (
    <section
      aria-labelledby="map-heading"
      className="flex h-full flex-col bg-surface"
    >
      <h3 id="map-heading" className="sr-only">
        Peta
      </h3>

      {/* isolate: lapisan peta tidak boleh menimpa elemen lain, seperti tautan "Lewati". */}
      <div className="isolate relative min-h-0 flex-1">
        <MapErrorBoundary>
          <PlaceMap {...props} />
        </MapErrorBoundary>
      </div>

      <MapLegend />
    </section>
  );
}