"use client";

import { useEffect, useMemo, useState } from "react";
import type { Place } from "@/types/place";
import { MapPanel } from "@/components/map/MapPanel";
import type { MapRequest } from "@/components/map/PlaceMap";
import { PlaceCard } from "@/components/places/PlaceCard";
import { SearchPanel } from "@/components/places/SearchPanel";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/accessibility";
import {
  DEFAULT_FILTERS,
  filterPlaces,
  type PlaceFilters,
} from "@/lib/places/filter";
import { cn } from "@/lib/utils/cn";

type MobileView = "list" | "map";

const STATUS_SYMBOLS = {
  available: "✓",
  not_available: "✕",
  unknown: "?",
  not_applicable: "–",
  needs_review: "!",
} as const;

const toggleBase =
  "min-h-11 flex-1 rounded-lg px-4 font-semibold transition-colors";

export function HomeExplorer({ places }: { places: Place[] }) {
  // "use client" diperlukan: komponen ini menyimpan state filter, pilihan, dan tab.
  const [filters, setFilters] = useState<PlaceFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<MobileView>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapRequest, setMapRequest] = useState<MapRequest | null>(null);
  const [listRequest, setListRequest] = useState<MapRequest | null>(null);

  // Dihitung ulang hanya saat data atau filter berubah.
  const results = useMemo(
    () => filterPlaces(places, filters),
    [places, filters],
  );

  // Pilihan yang sudah tersaring keluar dianggap tidak ada (tanpa setState tambahan).
  const activeSelectedId = results.some(({ place }) => place.id === selectedId)
    ? selectedId
    : null;

  function handleShowOnMap(id: string) {
    setSelectedId(id);
    setView("map");
    setMapRequest((previous) => ({ id, nonce: (previous?.nonce ?? 0) + 1 }));
  }

  function handleViewInList(id: string) {
    setSelectedId(id);
    setView("list");
    setListRequest((previous) => ({ id, nonce: (previous?.nonce ?? 0) + 1 }));
  }

  // Setelah tampilan daftar muncul, gulir ke baris yang dituju lalu fokuskan.
  useEffect(() => {
    if (!listRequest) return;
    const card = document.getElementById(`place-${listRequest.id}`);
    if (!card) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    card.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
    card.focus({ preventScroll: true });
  }, [listRequest]);

  return (
    <section aria-labelledby="explorer-heading">
      <h2 id="explorer-heading" className="text-3xl font-bold">
        Jelajahi tempat
      </h2>
      <p className="mb-6 mt-2 max-w-2xl text-muted">
        Cari berdasarkan nama, kategori, atau kebutuhan akses fisik Anda.
      </p>

      <SearchPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* role="status": perubahan jumlah hasil dibacakan screen reader dengan sopan. */}
      <p role="status" className="mb-3 mt-6 text-muted">
        Menampilkan {results.length} dari {places.length} tempat.
        {filters.criteria.length > 0
          ? " Label dan penanda mengikuti kriteria yang dipilih."
          : ""}
      </p>

      {/* Hanya tampil di layar kecil. Di laptop, daftar dan peta tampil berdampingan. */}
      <div
        role="group"
        aria-label="Pilih tampilan"
        className="mb-3 flex gap-1 rounded-xl bg-canvas p-1 lg:hidden"
      >
        <button
          type="button"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
          className={cn(
            toggleBase,
            view === "list"
              ? "bg-brand-800 text-white"
              : "text-ink hover:bg-brand-100",
          )}
        >
          Daftar
        </button>
        <button
          type="button"
          aria-pressed={view === "map"}
          onClick={() => setView("map")}
          className={cn(
            toggleBase,
            view === "map"
              ? "bg-brand-800 text-white"
              : "text-ink hover:bg-brand-100",
          )}
        >
          Peta
        </button>
      </div>

      {/* Satu bingkai berisi dua panel. Di laptop tingginya tetap dan daftar bergulir sendiri,
          sehingga peta selalu terlihat tanpa perlu "menempel". */}
      <div className="overflow-hidden rounded-2xl border border-line lg:grid lg:h-[42rem] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <section
          aria-labelledby="list-heading"
          className={cn(
            view === "list" ? "block" : "hidden",
            "bg-surface lg:flex lg:min-h-0 lg:flex-col lg:border-r lg:border-line",
          )}
        >
          <h3 id="list-heading" className="sr-only">
            Daftar tempat ({results.length})
          </h3>

          <ul
            aria-label="Arti simbol status"
            className="flex flex-wrap gap-x-4 gap-y-1 border-b border-line px-5 py-3 text-sm text-muted"
          >
            {STATUS_ORDER.map((status) => (
              <li key={status}>
                <span aria-hidden="true" className="font-bold text-ink">
                  {STATUS_SYMBOLS[status]}
                </span>{" "}
                {STATUS_LABELS[status]}
              </li>
            ))}
          </ul>

          <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-5">
                <StateMessage
                  variant="empty"
                  title="Tidak ada tempat yang cocok"
                  description="Coba ubah kata kunci, pilih kategori lain, atau kurangi kriteria."
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                  >
                    Atur ulang filter
                  </Button>
                </StateMessage>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {results.map(({ place, match }, index) => (
                  <li key={place.id}>
                    <PlaceCard
                      place={place}
                      match={match}
                      number={index + 1}
                      selected={place.id === activeSelectedId}
                      onShowOnMap={handleShowOnMap}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div
          className={cn(
            view === "map" ? "block" : "hidden",
            "h-[70vh] min-h-[28rem] lg:block lg:h-auto lg:min-h-0",
          )}
        >
          <MapPanel
            results={results}
            selectedId={activeSelectedId}
            mapRequest={mapRequest}
            onSelect={setSelectedId}
            onViewInList={handleViewInList}
          />
        </div>
      </div>
    </section>
  );
}