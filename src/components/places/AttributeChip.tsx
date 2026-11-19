import type { AccessibilityStatus, AttributeCode } from "@/types/place";
import { ATTRIBUTE_LABELS, STATUS_LABELS } from "@/lib/accessibility";
import { cn } from "@/lib/utils/cn";

// Nama pendek agar enam atribut muat ringkas di daftar. Nama lengkap ada di halaman detail.
const SHORT_LABELS: Record<AttributeCode, string> = {
  step_free_entrance: "Pintu rata",
  ramp: "Ramp",
  elevator: "Lift",
  accessible_toilet: "Toilet",
  accessible_parking: "Parkir",
  path_to_entrance: "Jalur masuk",
};

// Status dibedakan oleh SIMBOL + gaya garis + teks (untuk pembaca layar), bukan warna saja.
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

interface AttributeChipProps {
  code: AttributeCode;
  status: AccessibilityStatus;
}

/** Label ringkas satu atribut akses: simbol status + nama pendek. */
export function AttributeChip({ code, status }: AttributeChipProps) {
  const style = STATUS_STYLES[status];

  return (
    <span
      // title: tooltip untuk pengguna mouse; pembaca layar memakai teks tersembunyi di bawah.
      title={`${ATTRIBUTE_LABELS[code]}: ${STATUS_LABELS[status]}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-medium",
        style.className,
      )}
    >
      <span aria-hidden="true">{style.icon}</span>
      {SHORT_LABELS[code]}
      <span className="sr-only">: {STATUS_LABELS[status]}</span>
    </span>
  );
}