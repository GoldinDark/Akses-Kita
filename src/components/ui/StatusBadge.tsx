import type { AccessibilityStatus } from "@/types/place";
import { STATUS_LABELS } from "@/lib/accessibility";
import { cn } from "@/lib/utils/cn";

// Status dibedakan oleh TEKS + SIMBOL + gaya garis, bukan warna saja.
const STATUS_STYLES: Record<
  AccessibilityStatus,
  { icon: string; className: string }
> = {
  available: {
    icon: "✓",
    className: "border-emerald-700 bg-emerald-50 text-emerald-900",
  },
  not_available: {
    icon: "✕",
    className: "border-red-700 bg-red-50 text-red-900",
  },
  unknown: {
    icon: "?",
    className: "border-slate-500 bg-slate-100 text-slate-800",
  },
  not_applicable: {
    icon: "–",
    className: "border-dashed border-slate-500 bg-white text-slate-700",
  },
  needs_review: {
    icon: "!",
    className: "border-amber-700 bg-amber-50 text-amber-900",
  },
};

interface StatusBadgeProps {
  status: AccessibilityStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-sm font-medium",
        style.className,
        className,
      )}
    >
      <span aria-hidden="true">{style.icon}</span>
      {STATUS_LABELS[status]}
    </span>
  );
}
