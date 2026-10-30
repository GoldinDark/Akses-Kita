import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type StateVariant = "loading" | "empty" | "error";

const VARIANT_STYLES: Record<
  StateVariant,
  { box: string; description: string; icon: string }
> = {
  loading: {
    box: "border-line bg-surface text-ink",
    description: "text-muted",
    icon: "",
  },
  empty: {
    box: "border-line bg-surface text-ink",
    description: "text-muted",
    icon: "○",
  },
  error: {
    box: "border-red-300 bg-red-50 text-red-900",
    description: "text-red-900",
    icon: "!",
  },
};

interface StateMessageProps {
  variant: StateVariant;
  title: string;
  description?: string;
  /** Tombol atau tautan tindakan, misalnya "Coba lagi". */
  children?: ReactNode;
}

export function StateMessage({
  variant,
  title,
  description,
  children,
}: StateMessageProps) {
  const style = VARIANT_STYLES[variant];

  return (
    // role="alert" dibacakan segera oleh screen reader; role="status" dibacakan dengan sopan.
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border p-8 text-center",
        style.box,
      )}
    >
      {variant === "loading" ? (
        <span
          aria-hidden="true"
          className="h-8 w-8 rounded-full border-4 border-brand-100 border-t-brand-700 motion-safe:animate-spin"
        />
      ) : (
        <span aria-hidden="true" className="text-3xl">
          {style.icon}
        </span>
      )}
      <p className="text-lg font-semibold">{title}</p>
      {description ? (
        <p className={cn("max-w-prose", style.description)}>{description}</p>
      ) : null}
      {children}
    </div>
  );
}
