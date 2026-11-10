import {
  MATCH_LABELS,
  MATCH_STYLES,
  MATCH_SYMBOLS,
  type MatchState,
} from "@/lib/places/match";
import { cn } from "@/lib/utils/cn";

/** Label kecocokan tempat terhadap kriteria terpilih (simbol + teks, bukan warna saja). */
export function MatchBadge({
  state,
  className,
}: {
  state: MatchState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium",
        MATCH_STYLES[state].badge,
        className,
      )}
    >
      <span aria-hidden="true">{MATCH_SYMBOLS[state]}</span>
      {MATCH_LABELS[state]}
    </span>
  );
}