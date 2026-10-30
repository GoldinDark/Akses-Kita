import type { AttributeCode, Place } from "@/types/place";

/**
 * Hasil membandingkan sebuah tempat dengan kriteria yang dipilih pengguna.
 * Ini BUKAN skor universal: hasilnya hanya berlaku untuk kriteria yang sedang dipilih.
 */
export type MatchState =
  | "no_criteria"
  | "match"
  | "barrier"
  | "insufficient"
  | "not_relevant";

export const MATCH_STATE_ORDER: readonly MatchState[] = [
  "match",
  "barrier",
  "insufficient",
  "not_relevant",
  "no_criteria",
];

export const MATCH_LABELS: Record<MatchState, string> = {
  match: "Indikasi akses sesuai kriteria",
  barrier: "Hambatan dilaporkan",
  insufficient: "Informasi belum cukup/perlu ditinjau",
  not_relevant: "Kriteria tidak relevan di tempat ini",
  no_criteria: "Belum ada kriteria dipilih",
};

export const MATCH_DESCRIPTIONS: Record<MatchState, string> = {
  match:
    "Semua kriteria terpilih berstatus “Ada”. Ini indikasi dari data yang tercatat, bukan jaminan.",
  barrier:
    "Setidaknya satu kriteria terpilih berstatus “Tidak ada” menurut data yang tercatat.",
  insufficient:
    "Ada kriteria terpilih yang “Belum diketahui” atau “Perlu ditinjau”. Ini bukan berarti fasilitasnya tidak ada.",
  not_relevant:
    "Semua kriteria terpilih berstatus “Tidak relevan” untuk tempat ini.",
  no_criteria:
    "Pilih kriteria akses di filter agar label dan penanda menyesuaikan kebutuhan Anda.",
};

/** Simbol selalu dipakai bersama teks, jadi status tidak bergantung pada warna. */
export const MATCH_SYMBOLS: Record<MatchState, string> = {
  match: "✓",
  barrier: "✕",
  insufficient: "?",
  not_relevant: "–",
  no_criteria: "•",
};

/** Class Tailwind untuk label (badge) dan penanda peta (marker). */
export const MATCH_STYLES: Record<
  MatchState,
  { badge: string; marker: string }
> = {
  match: {
    badge: "border-emerald-700 bg-emerald-50 text-emerald-900",
    marker: "rounded-full border-white bg-emerald-700 text-white",
  },
  barrier: {
    badge: "border-red-700 bg-red-50 text-red-900",
    marker: "rounded-md border-white bg-red-700 text-white",
  },
  insufficient: {
    badge: "border-dashed border-amber-700 bg-amber-50 text-amber-900",
    marker: "rounded-full border-dashed border-amber-800 bg-amber-100 text-amber-950",
  },
  not_relevant: {
    badge: "border-dashed border-slate-500 bg-white text-slate-700",
    marker: "rounded-full border-dashed border-slate-600 bg-white text-slate-800",
  },
  no_criteria: {
    badge: "border-slate-500 bg-slate-100 text-slate-800",
    marker: "rounded-full border-white bg-slate-700 text-white",
  },
};

/**
 * Menentukan status kecocokan sebuah tempat terhadap kriteria terpilih.
 *
 * Aturan (urutan penting):
 * 1. Tidak ada kriteria         -> no_criteria
 * 2. Kriteria "not_applicable" diabaikan. Jika semua diabaikan -> not_relevant
 * 3. Ada "not_available"        -> barrier
 * 4. Ada "unknown"/"needs_review" -> insufficient   (unknown BUKAN kecocokan)
 * 5. Selebihnya (semua "available") -> match
 */
export function evaluateMatch(
  attributes: Place["attributes"],
  criteria: readonly AttributeCode[],
): MatchState {
  if (criteria.length === 0) return "no_criteria";

  const statuses = criteria
    .map((code) => attributes[code])
    .filter((status) => status !== "not_applicable");

  if (statuses.length === 0) return "not_relevant";
  if (statuses.includes("not_available")) return "barrier";
  if (statuses.some((s) => s === "unknown" || s === "needs_review")) {
    return "insufficient";
  }
  return "match";
}