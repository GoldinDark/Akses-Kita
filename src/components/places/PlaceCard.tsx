import Link from "next/link";
import type { Place } from "@/types/place";
import { ATTRIBUTE_CODES, CATEGORY_LABELS } from "@/lib/accessibility";
import type { MatchState } from "@/lib/places/match";
import { AttributeChip } from "@/components/places/AttributeChip";
import { MatchBadge } from "@/components/places/MatchBadge";
import { Button, buttonStyles } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface PlaceCardProps {
  place: Place;
  match: MatchState;
  /** Nomor urut di daftar; sama dengan nomor pada penanda peta (saat tanpa kriteria). */
  number: number;
  selected: boolean;
  onShowOnMap: (id: string) => void;
}

/** Satu baris tempat di daftar: ringkas, tanpa kotak, dipisahkan garis tipis. */
export function PlaceCard({
  place,
  match,
  number,
  selected,
  onShowOnMap,
}: PlaceCardProps) {
  const showMatch = match !== "no_criteria";
  const observedText = place.observedAt
    ? `Diamati ${formatDate(place.observedAt)}${place.isDemo ? " (simulasi)" : ""}`
    : "Belum pernah diamati";

  return (
    <article
      // id dan tabIndex=-1 membuat baris bisa dituju dari peta ("Lihat di daftar").
      id={`place-${place.id}`}
      tabIndex={-1}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "relative px-5 py-5",
        selected ? "bg-brand-50" : "bg-surface",
      )}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1.5 bg-brand-700"
        />
      ) : null}

      <div className="flex gap-3">
        {!showMatch ? (
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white"
          >
            {number}
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          {place.isDemo ? (
            <p className="mb-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-900">
              Data demo (simulasi)
            </p>
          ) : null}
          <h4 className="text-lg font-bold leading-snug">{place.name}</h4>
          <p className="text-sm text-muted">
            {CATEGORY_LABELS[place.category]}, {place.area}
          </p>

          {showMatch ? (
            <div className="mt-2">
              <MatchBadge state={match} />
            </div>
          ) : null}

          <ul
            aria-label="Status atribut akses"
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {ATTRIBUTE_CODES.map((code) => (
              <li key={code}>
                <AttributeChip code={code} status={place.attributes[code]} />
              </li>
            ))}
          </ul>

          <p className="mt-3 text-sm text-muted">{observedText}</p>
          {selected ? (
            <p className="mt-1 text-sm font-semibold text-brand-800">
              Dipilih di peta
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onShowOnMap(place.id)}
              aria-label={`Tampilkan ${place.name} di peta`}
            >
              Lihat di peta
            </Button>
            <Link
              href={`/tempat/${place.id}`}
              className={buttonStyles({ size: "sm" })}
              aria-label={`Lihat detail ${place.name}`}
            >
              Lihat detail
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}