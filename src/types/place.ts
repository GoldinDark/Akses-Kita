/** Status satu atribut akses. `unknown` TIDAK sama dengan `not_available`. */
export type AccessibilityStatus =
  | "available"
  | "not_available"
  | "unknown"
  | "not_applicable"
  | "needs_review";

/** Atribut akses fisik awal. Kode memakai Bahasa Inggris, tampilan Bahasa Indonesia. */
export type AttributeCode =
  | "step_free_entrance"
  | "ramp"
  | "elevator"
  | "accessible_toilet"
  | "accessible_parking"
  | "path_to_entrance";

export type PlaceCategory =
  | "public_service"
  | "education"
  | "health"
  | "market"
  | "park"
  | "transport";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  /** Nama area/wilayah umum, bukan alamat lengkap. */
  area: string;
  /** Koordinat WGS84 (derajat desimal). Pada data demo, posisinya simulasi. */
  latitude: number;
  longitude: number;
  /** true jika data ini simulasi dan tidak boleh dianggap fakta nyata. */
  isDemo: boolean;
  /** Tanggal observasi format YYYY-MM-DD, atau null jika belum pernah diobservasi. */
  observedAt: string | null;
  attributes: Record<AttributeCode, AccessibilityStatus>;
}