import {
  MATCH_DESCRIPTIONS,
  MATCH_STATE_ORDER,
} from "@/lib/places/match";
import { MatchBadge } from "@/components/places/MatchBadge";

/** Penjelasan arti setiap penanda peta. */
export function MapLegend() {
  return (
    <details className="mt-3 rounded-lg border border-line p-3">
      <summary className="cursor-pointer font-semibold">
        Arti penanda di peta
      </summary>
      <p className="mt-2 text-sm text-muted">
        Penanda mengikuti kriteria akses yang Anda pilih di filter. Penanda
        bukan skor umum dan bukan jaminan aksesibilitas.
      </p>
      <ul className="mt-3 space-y-3">
        {MATCH_STATE_ORDER.map((state) => (
          <li key={state} className="space-y-1">
            <MatchBadge state={state} />
            <p className="text-sm text-muted">{MATCH_DESCRIPTIONS[state]}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}