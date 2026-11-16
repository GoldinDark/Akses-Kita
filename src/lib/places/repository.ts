import { cache } from "react";
import { ATTRIBUTE_CODES, CATEGORY_LABELS, STATUS_ORDER } from "@/lib/accessibility";
import { isSourceType, type SourceType } from "@/lib/places/source";
import { createPublicClient } from "@/lib/supabase/public-client";
import type {
  AccessibilityStatus,
  AttributeCode,
  Place,
  PlaceCategory,
} from "@/types/place";

/** Baris mentah dari database (bentuknya mengikuti nama kolom SQL). */
interface PlaceRow {
  id: string;
  name: string;
  category: string;
  area: string;
  latitude: number;
  longitude: number;
  is_demo: boolean;
}

interface AttributeRow {
  place_id: string;
  attribute_code: string;
  status: string;
  observed_on: string;
  source_type?: string;
}

/** Status satu atribut beserta kapan dan dari mana informasinya. */
export interface AttributeDetail {
  status: AccessibilityStatus;
  observedOn: string | null;
  sourceType: SourceType | null;
}

export interface PlaceDetail extends Place {
  attributeDetails: Record<AttributeCode, AttributeDetail>;
}

export type PlaceDetailResult =
  | { ok: true; place: PlaceDetail | null }
  | { ok: false; message: string };

export type PlacesResult =
  | { ok: true; places: Place[] }
  | { ok: false; message: string };

/**
 * Batas baris yang dikembalikan sekali permintaan oleh Supabase (bawaan 1000).
 * Jika data mendekati batas ini kita berhenti dengan pesan jelas, bukan
 * diam-diam menampilkan data terpotong. Paginasi dibuat saat data membesar.
 */
const MAX_ROWS = 1000;

const CATEGORY_CODES = new Set<string>(Object.keys(CATEGORY_LABELS));
const STATUS_CODES = new Set<string>(STATUS_ORDER);
const ATTRIBUTE_SET = new Set<string>(ATTRIBUTE_CODES);

/**
 * Menggabungkan baris tempat dan baris status menjadi objek Place untuk UI.
 * Atribut yang tidak punya observasi menjadi "unknown" (BUKAN "not_available").
 */
export function buildPlaces(
  placeRows: PlaceRow[],
  attributeRows: AttributeRow[],
): Place[] {
  const byPlace = new Map<string, AttributeRow[]>();
  for (const row of attributeRows) {
    const list = byPlace.get(row.place_id) ?? [];
    list.push(row);
    byPlace.set(row.place_id, list);
  }

  const places: Place[] = [];
  for (const row of placeRows) {
    if (!CATEGORY_CODES.has(row.category)) continue; // data tak dikenal: lewati

    const attributes = Object.fromEntries(
      ATTRIBUTE_CODES.map((code) => [code, "unknown"]),
    ) as Record<AttributeCode, AccessibilityStatus>;

    let observedAt: string | null = null;
    for (const attr of byPlace.get(row.id) ?? []) {
      if (!ATTRIBUTE_SET.has(attr.attribute_code)) continue;
      attributes[attr.attribute_code as AttributeCode] = STATUS_CODES.has(
        attr.status,
      )
        ? (attr.status as AccessibilityStatus)
        : "unknown";
      // Tanggal format YYYY-MM-DD bisa dibandingkan sebagai teks.
      if (observedAt === null || attr.observed_on > observedAt) {
        observedAt = attr.observed_on;
      }
    }

    places.push({
      id: row.id,
      name: row.name,
      category: row.category as PlaceCategory,
      area: row.area,
      latitude: row.latitude,
      longitude: row.longitude,
      isDemo: row.is_demo,
      observedAt,
      attributes,
    });
  }
  return places;
}

/** Mengambil semua tempat yang dipublikasikan beserta status akses terbarunya. */
export async function getPublishedPlaces(): Promise<PlacesResult> {
  try {
    const supabase = createPublicClient();

    const [placesResponse, attributesResponse] = await Promise.all([
      supabase
        .from("places")
        .select("id, name, category, area, latitude, longitude, is_demo")
        .eq("status", "published")
        .order("name"),
      supabase
        .from("place_attribute_current")
        .select("place_id, attribute_code, status, observed_on"),
    ]);

    if (placesResponse.error) throw placesResponse.error;
    if (attributesResponse.error) throw attributesResponse.error;

    const placeRows = (placesResponse.data ?? []) as PlaceRow[];
    const attributeRows = (attributesResponse.data ?? []) as AttributeRow[];

    if (placeRows.length >= MAX_ROWS || attributeRows.length >= MAX_ROWS) {
      throw new Error(
        "Jumlah data mencapai batas 1000 baris per permintaan; perlu paginasi.",
      );
    }

    return { ok: true, places: buildPlaces(placeRows, attributeRows) };
  } catch (error) {
    // Detail teknis hanya di terminal server, tidak ditampilkan ke pengunjung.
    console.error("[getPublishedPlaces] gagal mengambil data:", error);
    return {
      ok: false,
      message: "Data tempat belum bisa dimuat. Coba muat ulang halaman.",
    };
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Menambahkan rincian tanggal dan sumber per atribut ke objek Place. */
export function buildPlaceDetail(
  placeRow: PlaceRow,
  attributeRows: AttributeRow[],
): PlaceDetail | null {
  const [place] = buildPlaces([placeRow], attributeRows);
  if (!place) return null;

  const attributeDetails = Object.fromEntries(
    ATTRIBUTE_CODES.map((code) => [
      code,
      { status: "unknown", observedOn: null, sourceType: null },
    ]),
  ) as Record<AttributeCode, AttributeDetail>;

  for (const row of attributeRows) {
    if (!ATTRIBUTE_SET.has(row.attribute_code)) continue;
    attributeDetails[row.attribute_code as AttributeCode] = {
      status: STATUS_CODES.has(row.status)
        ? (row.status as AccessibilityStatus)
        : "unknown",
      observedOn: row.observed_on,
      sourceType:
        row.source_type && isSourceType(row.source_type)
          ? row.source_type
          : null,
    };
  }

  return { ...place, attributeDetails };
}

/**
 * Satu tempat yang dipublikasikan, atau place: null jika tidak ada.
 * cache() membuat pemanggilan berulang pada satu permintaan hanya memakai satu kueri.
 */
export const getPlaceById = cache(
  async (id: string): Promise<PlaceDetailResult> => {
    // ID yang bukan UUID pasti tidak ada; hindari galat dari database.
    if (!UUID_PATTERN.test(id)) return { ok: true, place: null };

    try {
      const supabase = createPublicClient();

      const [placeResponse, attributesResponse] = await Promise.all([
        supabase
          .from("places")
          .select("id, name, category, area, latitude, longitude, is_demo")
          .eq("id", id)
          .eq("status", "published")
          .maybeSingle(),
        supabase
          .from("place_attribute_current")
          .select("place_id, attribute_code, status, observed_on, source_type")
          .eq("place_id", id),
      ]);

      if (placeResponse.error) throw placeResponse.error;
      if (attributesResponse.error) throw attributesResponse.error;
      if (!placeResponse.data) return { ok: true, place: null };

      return {
        ok: true,
        place: buildPlaceDetail(
          placeResponse.data as PlaceRow,
          (attributesResponse.data ?? []) as AttributeRow[],
        ),
      };
    } catch (error) {
      console.error("[getPlaceById] gagal mengambil data:", error);
      return {
        ok: false,
        message: "Data tempat belum bisa dimuat. Coba muat ulang halaman.",
      };
    }
  },
);