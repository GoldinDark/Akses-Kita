import type { AttributeCode, Place, PlaceCategory } from "@/types/place";
import { evaluateMatch, type MatchState } from "@/lib/places/match";

export type ResultMode = "all" | "matching_only";

export interface PlaceFilters {
  query: string;
  category: PlaceCategory | "all";
  criteria: AttributeCode[];
  resultMode: ResultMode;
}

export const DEFAULT_FILTERS: PlaceFilters = {
  query: "",
  category: "all",
  criteria: [],
  resultMode: "all",
};

export interface PlaceResult {
  place: Place;
  match: MatchState;
}

/** Huruf kecil dan tanpa tanda aksen, agar "Pasar" dan "pásar" dianggap sama. */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function hasActiveFilters(filters: PlaceFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.category !== "all" ||
    filters.criteria.length > 0
  );
}

// Urutan tampil saat kriteria dipilih: yang sesuai di atas, yang berhambatan di bawah.
const MATCH_RANK: Record<MatchState, number> = {
  no_criteria: 0,
  match: 0,
  not_relevant: 1,
  insufficient: 2,
  barrier: 3,
};

export function filterPlaces(
  places: readonly Place[],
  filters: PlaceFilters,
): PlaceResult[] {
  const query = normalizeText(filters.query);

  const results: PlaceResult[] = [];
  for (const place of places) {
    if (filters.category !== "all" && place.category !== filters.category) {
      continue;
    }
    if (
      query !== "" &&
      !normalizeText(`${place.name} ${place.area}`).includes(query)
    ) {
      continue;
    }

    const match = evaluateMatch(place.attributes, filters.criteria);
    if (
      filters.resultMode === "matching_only" &&
      filters.criteria.length > 0 &&
      match !== "match"
    ) {
      continue;
    }
    results.push({ place, match });
  }

  // sort() pada JavaScript modern stabil: urutan awal dipertahankan bila peringkat sama.
  return results.sort((a, b) => MATCH_RANK[a.match] - MATCH_RANK[b.match]);
}