"use client";

import { useState } from "react";
import type { Place } from "@/types/place";
import { MapPanel } from "@/components/map/MapPanel";
import { PlaceCard } from "@/components/places/PlaceCard";
import { StateMessage } from "@/components/ui/StateMessage";
import { cn } from "@/lib/utils/cn";

type MobileView = "list" | "map";

const toggleBase =
  "min-h-11 flex-1 rounded-lg px-4 font-semibold transition-colors";

export function HomeExplorer({ places }: { places: Place[] }) {
  // "use client" diperlukan karena komponen ini menyimpan state (tab Daftar/Peta).
  const [view, setView] = useState<MobileView>("list");

  return (
    <section aria-labelledby="explorer-heading" className="space-y-4">
      <h2 id="explorer-heading" className="text-2xl font-bold">
        Jelajahi tempat
      </h2>

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
            Daftar tempat ({places.length})
          </h3>
          {places.length === 0 ? (
            <StateMessage
              variant="empty"
              title="Belum ada tempat"
              description="Belum ada tempat yang cocok untuk ditampilkan."
            />
          ) : (
            <ul className="space-y-4">
              {places.map((place) => (
                <li key={place.id}>
                  <PlaceCard place={place} />
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
          <MapPanel />
        </div>
      </div>
    </section>
  );
}
