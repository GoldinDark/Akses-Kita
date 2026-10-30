import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  /** Wajib: dipakai untuk menghubungkan label, petunjuk, dan pesan error. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function Input({
  id,
  label,
  hint,
  error,
  className,
  ...props
}: InputProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-12 rounded-lg border bg-surface px-4 text-ink placeholder:text-muted",
          error ? "border-red-700" : "border-slate-500",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
