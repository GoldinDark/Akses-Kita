"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  divIcon,
  latLngBounds,
  type DivIcon,
  type LatLngBounds,
  type Marker as LeafletMarker,
} from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { CATEGORY_LABELS } from "@/lib/accessibility";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  TILE_PROVIDER,
} from "@/lib/map/map-config";
import type { PlaceResult } from "@/lib/places/filter";
import {
  MATCH_LABELS,
  MATCH_STYLES,
  MATCH_SYMBOLS,
  type MatchState,
} from "@/lib/places/match";
import { MatchBadge } from "@/components/places/MatchBadge";

/** Permintaan dari daftar: "tampilkan tempat ini di peta". `nonce` berubah tiap klik. */
export interface MapRequest {
  id: string;
  nonce: number;
}

export interface PlaceMapProps {
  results: PlaceResult[];
  selectedId: string | null;
  mapRequest: MapRequest | null;
  onSelect: (id: string) => void;
  onViewInList: (id: string) => void;
}

// Ikon dibuat sekali per kombinasi (status, terpilih) lalu dipakai ulang.
const iconCache = new Map<string, DivIcon>();

function getMarkerIcon(
  state: MatchState,
  selected: boolean,
  label: string,
): DivIcon {
  const key = `${state}-${selected}-${label}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  // Isi HTML hanya string tetap dari kode kita (bukan nama tempat), jadi aman dari XSS.
  // Tanpa kriteria, penanda berisi nomor yang sama dengan nomor di daftar.
  const ring = selected ? " ring-4 ring-brand-900" : "";
  const style =
    state === "no_criteria"
      ? "rounded-full border-white bg-brand-800 text-white"
      : MATCH_STYLES[state].marker;
  const icon = divIcon({
    className: "",
    html: `<span aria-hidden="true" class="flex h-9 w-9 items-center justify-center border-2 text-base font-bold shadow-md ${style}${ring}">${label}</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
  iconCache.set(key, icon);
  return icon;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface MapControllerProps {
  results: PlaceResult[];
  mapRequest: MapRequest | null;
  markerRefs: RefObject<Map<string, LeafletMarker>>;
}

/** Komponen tanpa tampilan: mengatur perilaku peta lewat objek map Leaflet. */
function MapController({ results, mapRequest, markerRefs }: MapControllerProps) {
  const map = useMap();
  const boundsRef = useRef<LatLngBounds | null>(null);

  // 1) Label aksesibilitas untuk wadah peta (Leaflet sudah menjadikannya fokus keyboard).
  useEffect(() => {
    const container = map.getContainer();
    container.setAttribute("role", "group");
    container.setAttribute(
      "aria-label",
      "Peta tempat. Gunakan tombol panah untuk menggeser peta, plus dan minus untuk memperbesar atau memperkecil.",
    );
  }, [map]);

  // 2) Arahkan peta agar semua tempat hasil filter terlihat.
  useEffect(() => {
    if (results.length === 0) {
      boundsRef.current = null;
      return;
    }
    const bounds = latLngBounds(
      results.map(({ place }) => [place.latitude, place.longitude]),
    );
    boundsRef.current = bounds;
    // Jika peta sedang tersembunyi (tab Daftar di ponsel), ukurannya 0: tunda sampai terlihat.
    if (map.getSize().x > 0) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    }
  }, [map, results]);

  // 3) Saat wadah peta berubah ukuran (misalnya muncul dari tersembunyi), hitung ulang.
  useEffect(() => {
    const container = map.getContainer();
    let wasHidden = container.clientWidth === 0;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
      const hiddenNow = container.clientWidth === 0;
      if (wasHidden && !hiddenNow && boundsRef.current) {
        map.fitBounds(boundsRef.current, { padding: [48, 48], maxZoom: 16 });
      }
      wasHidden = hiddenNow;
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  // 4) Tombol Escape menutup popup. Bawaan Leaflet mengandalkan event "keypress",
  //    yang tidak dikirim browser untuk Escape. Event didengarkan di seluruh dokumen
  //    (bukan hanya di dalam peta), karena popup juga bisa dibuka dari tombol
  //    "Tampilkan di peta" di daftar, saat fokus keyboard ada di luar peta.
  //    Fokus hanya dikembalikan ke penanda jika sebelumnya memang berada di dalam peta.
  useEffect(() => {
    const container = map.getContainer();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      for (const marker of markerRefs.current.values()) {
        if (marker.isPopupOpen()) {
          const focusWasInMap = container.contains(document.activeElement);
          marker.closePopup();
          if (focusWasInMap) marker.getElement()?.focus();
          break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [map, markerRefs]);

  // 5) Permintaan dari daftar: pusatkan peta ke tempat itu lalu buka popup-nya.
  useEffect(() => {
    if (!mapRequest) return;
    const marker = markerRefs.current.get(mapRequest.id);
    if (!marker) return;

    map.invalidateSize();
    map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14), {
      animate: !prefersReducedMotion(),
    });
    marker.openPopup();
  }, [map, mapRequest, markerRefs]);

  return null;
}

export function PlaceMap({
  results,
  selectedId,
  mapRequest,
  onSelect,
  onViewInList,
}: PlaceMapProps) {
  const markerRefs = useRef<Map<string, LeafletMarker>>(new Map());
  const [tileFailed, setTileFailed] = useState(false);

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        zoomControl={false}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url={TILE_PROVIDER.url}
          attribution={TILE_PROVIDER.attribution}
          maxZoom={TILE_PROVIDER.maxZoom}
          referrerPolicy={TILE_PROVIDER.referrerPolicy}
          eventHandlers={{ tileerror: () => setTileFailed(true) }}
        />
        <ZoomControl
          position="topright"
          zoomInTitle="Perbesar peta"
          zoomOutTitle="Perkecil peta"
        />
        <MapController
          results={results}
          mapRequest={mapRequest}
          markerRefs={markerRefs}
        />

        {results.map(({ place, match }, index) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={getMarkerIcon(
              match,
              place.id === selectedId,
              match === "no_criteria" ? String(index + 1) : MATCH_SYMBOLS[match],
            )}
            title={
              match === "no_criteria"
                ? `${index + 1}. ${place.name}`
                : `${place.name}: ${MATCH_LABELS[match]}`
            }
            ref={(marker) => {
              if (marker) markerRefs.current.set(place.id, marker);
              else markerRefs.current.delete(place.id);
            }}
            eventHandlers={{ click: () => onSelect(place.id) }}
          >
            <Popup>
              <div className="space-y-2">
                <div className="text-base font-bold">{place.name}</div>
                <div>
                  {CATEGORY_LABELS[place.category]} · {place.area}
                </div>
                {match !== "no_criteria" ? <MatchBadge state={match} /> : null}
                {place.isDemo ? (
                  <div className="text-sm font-semibold">
                    Data demo: posisi dan status adalah simulasi.
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => onViewInList(place.id)}
                  className="min-h-11 rounded-lg border border-slate-500 px-3 font-semibold hover:bg-brand-50"
                >
                  Lihat di daftar
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {tileFailed ? (
        <p
          role="alert"
          className="absolute inset-x-3 bottom-3 z-[1000] rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900"
        >
          Sebagian gambar peta gagal dimuat. Penanda dan daftar tempat tetap
          bisa dipakai; periksa koneksi internet Anda.
        </p>
      ) : null}
    </div>
  );
}