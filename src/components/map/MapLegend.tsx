import {
  MATCH_DESCRIPTIONS,
  MATCH_STATE_ORDER,
} from "@/lib/places/match";
import { MatchBadge } from "@/components/places/MatchBadge";

/** Penjelasan arti setiap penanda peta, dilipat di dasar peta. */
export function MapLegend() {
  return (
    <details className="border-t border-line bg-surface px-5">
      <summary className="flex min-h-12 cursor-pointer items-center font-semibold">
        Arti penanda di peta
      </summary>
      <div className="max-h-48 overflow-y-auto pb-4">
        <p className="text-sm text-muted">
          Tanpa kriteria, penanda berisi nomor yang sama dengan nomor tempat di
          daftar. Dengan kriteria, penanda memakai simbol di bawah ini. Penanda
          bukan skor umum dan bukan jaminan aksesibilitas.
        </p>
        <ul className="mt-3 space-y-3">
          {MATCH_STATE_ORDER.filter((state) => state !== "no_criteria").map(
            (state) => (
              <li key={state} className="space-y-1">
                <MatchBadge state={state} />
                <p className="text-sm text-muted">
                  {MATCH_DESCRIPTIONS[state]}
                </p>
              </li>
            ),
          )}
        </ul>
      </div>
    </details>
  );
}