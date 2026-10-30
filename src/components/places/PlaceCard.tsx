import type { Place } from "@/types/place";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/accessibility";
import { StatusBadge } from "@/components/ui/StatusBadge";

// timeZone UTC agar hasil format sama di server dan browser (mencegah hydration mismatch).
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatObservedAt(observedAt: string | null): string {
  if (!observedAt) return "Belum pernah diobservasi";
  return dateFormatter.format(new Date(observedAt));
}

export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
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
    </article>
  );
}
