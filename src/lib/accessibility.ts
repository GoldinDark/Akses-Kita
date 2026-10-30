import type {
  AccessibilityStatus,
  AttributeCode,
  PlaceCategory,
} from "@/types/place";

/** Urutan tampilan atribut di seluruh website. */
export const ATTRIBUTE_CODES: readonly AttributeCode[] = [
  "step_free_entrance",
  "ramp",
  "elevator",
  "accessible_toilet",
  "accessible_parking",
  "path_to_entrance",
];

export const ATTRIBUTE_LABELS: Record<AttributeCode, string> = {
  step_free_entrance: "Pintu masuk tanpa anak tangga",
  ramp: "Ramp tersedia",
  elevator: "Lift tersedia",
  accessible_toilet: "Toilet aksesibel",
  accessible_parking: "Parkir aksesibel",
  path_to_entrance: "Jalur dari area turun kendaraan/parkir ke pintu masuk",
};

/** Urutan tampilan status pada legenda. */
export const STATUS_ORDER: readonly AccessibilityStatus[] = [
  "available",
  "not_available",
  "unknown",
  "not_applicable",
  "needs_review",
];

export const STATUS_LABELS: Record<AccessibilityStatus, string> = {
  available: "Ada",
  not_available: "Tidak ada",
  unknown: "Belum diketahui",
  not_applicable: "Tidak relevan",
  needs_review: "Perlu ditinjau",
};

export const STATUS_DESCRIPTIONS: Record<AccessibilityStatus, string> = {
  available: "Ada, berdasarkan observasi atau bukti yang dicatat.",
  not_available:
    "Tidak ada, hanya jika memang sudah diperiksa atau dikonfirmasi.",
  unknown:
    "Belum diketahui atau bukti belum cukup. Ini tidak berarti fasilitasnya tidak ada.",
  not_applicable:
    "Tidak relevan untuk tempat atau konteks ini, misalnya lift di bangunan satu lantai.",
  needs_review:
    "Data mungkin usang atau saling bertentangan, sehingga perlu ditinjau ulang.",
};

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  public_service: "Layanan publik",
  education: "Pendidikan",
  health: "Kesehatan",
  market: "Pasar",
  park: "Taman",
  transport: "Transportasi",
};
