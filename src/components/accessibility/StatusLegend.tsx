import { STATUS_DESCRIPTIONS, STATUS_ORDER } from "@/lib/accessibility";
import { StatusBadge } from "@/components/ui/StatusBadge";

/** Penjelasan arti setiap status atribut akses. */
export function StatusLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {STATUS_ORDER.map((status) => (
        <div
          key={status}
          className="rounded-xl border border-line bg-surface p-4"
        >
          <dt>
            <StatusBadge status={status} />
          </dt>
          <dd className="mt-2 text-muted">{STATUS_DESCRIPTIONS[status]}</dd>
        </div>
      ))}
    </dl>
  );
}
