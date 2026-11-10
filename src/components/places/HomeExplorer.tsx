"use client";

import { useEffect, useMemo, useState } from "react";
import type { Place } from "@/types/place";
import { MapPanel } from "@/components/map/MapPanel";
import type { MapRequest } from "@/components/map/PlaceMap";
import { PlaceCard } from "@/components/places/PlaceCard";
import { SearchPanel } from "@/components/places/SearchPanel";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import {
  DEFAULT_FILTERS,
  filterPlaces,
  type PlaceFilters,
} from "@/lib/places/filter";
import { cn } from "@/lib/utils/cn";

type MobileView = "list" | "map";

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

  // Setelah tampilan daftar muncul, gulir ke kartu yang dituju lalu fokuskan.
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
    <section aria-labelledby="explorer-heading" className="space-y-4">
      <h2 id="explorer-heading" className="text-2xl font-bold">
        Jelajahi tempat
      </h2>

      <SearchPanel
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* role="status": perubahan jumlah hasil dibacakan screen reader dengan sopan. */}
      <p role="status" className="text-muted">
        Menampilkan {results.length} dari {places.length} tempat.
        {filters.criteria.length > 0
          ? " Label dan penanda mengikuti kriteria yang dipilih."
          : ""}
      </p>

      {/* Hanya tampil di layar kecil. Di desktop, daftar dan peta tampil berdampingan. */}
      <div
        role="group"
        aria-label="Pilih tampilan"
        className="flex gap-1 rounded-xl border border-line bg-surface p-1 lg:hidden"
      >
        <button
          type="button"
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
          className={cn(
            toggleBase,
            view === "list"
              ? "bg-brand-700 text-white"
              : "text-ink hover:bg-brand-50",
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
              ? "bg-brand-700 text-white"
              : "text-ink hover:bg-brand-50",
          )}
        >
          Peta
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section
          aria-labelledby="list-heading"
          className={cn(view === "list" ? "block" : "hidden", "lg:block")}
        >
          <h3 id="list-heading" className="mb-3 text-lg font-bold">
            Daftar tempat ({results.length})
          </h3>
          {results.length === 0 ? (
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
          ) : (
            <ul className="space-y-4">
              {results.map(({ place, match }) => (
                <li key={place.id}>
                  <PlaceCard
                    place={place}
                    match={match}
                    selected={place.id === activeSelectedId}
                    onShowOnMap={handleShowOnMap}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <div
          className={cn(
            view === "map" ? "block" : "hidden",
            "lg:sticky lg:top-4 lg:block lg:self-start",
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