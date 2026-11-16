import Link from "next/link";
import type { Place } from "@/types/place";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/accessibility";
import type { MatchState } from "@/lib/places/match";
import { MatchBadge } from "@/components/places/MatchBadge";
import { Button, buttonStyles } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils/cn";

// timeZone UTC agar hasil format sama di server dan browser (mencegah hydration mismatch).
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatObservedAt(observedAt: string | null): string {
  if (!observedAt) return "Belum pernah diobservasi";
  return dateFormatter.format(new Date(observedAt));
}

interface PlaceCardProps {
  place: Place;
  match: MatchState;
  selected: boolean;
  onShowOnMap: (id: string) => void;
}

export function PlaceCard({
  place,
  match,
  selected,
  onShowOnMap,
}: PlaceCardProps) {
  return (
    <article
      // id dan tabIndex=-1 membuat kartu bisa dituju dari peta ("Lihat di daftar").
      id={`place-${place.id}`}
      tabIndex={-1}
      className={cn(
        "rounded-xl border bg-surface p-5 shadow-sm",
        selected ? "border-brand-700 ring-2 ring-brand-700" : "border-line",
      )}
    >
      <header>
        {place.isDemo ? (
          <p className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-900">
            Data demo (simulasi)
          </p>
        ) : null}
        <h4 className="mt-2 text-lg font-bold">{place.name}</h4>
        <p className="text-muted">
          {CATEGORY_LABELS[place.category]} · {place.area}
        </p>
        <div className="mt-2">
          <MatchBadge state={match} />
        </div>
      </header>

      <dl className="mt-4 grid gap-2">
        {ATTRIBUTE_CODES.map((code) => (
          <div
            key={code}
            className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2"
          >
            <dt className="text-sm">{ATTRIBUTE_LABELS[code]}</dt>
            <dd>
              <StatusBadge status={place.attributes[code]} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-sm text-muted">
        Tanggal observasi{place.isDemo ? " (simulasi)" : ""}:{" "}
        {formatObservedAt(place.observedAt)}
      </p>

            <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onShowOnMap(place.id)}
          aria-label={`Tampilkan ${place.name} di peta`}
        >
          Tampilkan di peta
        </Button>
        <Link
          href={`/tempat/${place.id}`}
          className={buttonStyles({ size: "sm" })}
          aria-label={`Lihat detail ${place.name}`}
        >
          Lihat detail
        </Link>
      </div>
    </article>
  );
}