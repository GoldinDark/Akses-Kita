import { ATTRIBUTE_CODES, CATEGORY_LABELS, STATUS_ORDER } from "@/lib/accessibility";
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
}

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