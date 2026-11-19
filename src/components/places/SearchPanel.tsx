"use client";

import { useId, useState } from "react";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/accessibility";
import { hasActiveFilters, type PlaceFilters } from "@/lib/places/filter";
import type { AttributeCode, PlaceCategory } from "@/types/place";
import { cn } from "@/lib/utils/cn";

const CATEGORY_CODES = Object.keys(CATEGORY_LABELS) as PlaceCategory[];

const chipBase =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors";
const chipOff = "border-slate-500 bg-surface text-ink hover:bg-brand-50";
const chipOn = "border-brand-800 bg-brand-800 text-white";

interface SearchPanelProps {
  filters: PlaceFilters;
  onChange: (filters: PlaceFilters) => void;
  onReset: () => void;
}

export function SearchPanel({ filters, onChange, onReset }: SearchPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const criteriaCount = filters.criteria.length;

  function toggleCriterion(code: AttributeCode) {
    const criteria = filters.criteria.includes(code)
      ? filters.criteria.filter((item) => item !== code)
      : [...filters.criteria, code];
    onChange({ ...filters, criteria });
  }

  return (
    <form
      role="search"
      aria-label="Cari tempat"
      // Hasil diperbarui langsung saat mengetik, jadi tidak ada pengiriman form.
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
    >
      <div className="relative">
        <label htmlFor="search-place" className="sr-only">
          Cari nama tempat atau area
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          id="search-place"
          type="search"
          placeholder="Cari nama tempat atau area, mis. perpustakaan"
          autoComplete="off"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          className="min-h-14 w-full rounded-xl border border-slate-500 bg-surface pl-12 pr-4 text-lg placeholder:text-muted"
        />
      </div>

      <div role="group" aria-label="Kategori" className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={filters.category === "all"}
          onClick={() => onChange({ ...filters, category: "all" })}
          className={cn(chipBase, filters.category === "all" ? chipOn : chipOff)}
        >
          {filters.category === "all" ? "✓ " : ""}Semua
        </button>
        {CATEGORY_CODES.map((code) => {
          const pressed = filters.category === code;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={pressed}
              onClick={() =>
                onChange({ ...filters, category: pressed ? "all" : code })
              }
              className={cn(chipBase, pressed ? chipOn : chipOff)}
            >
              {pressed ? "✓ " : ""}
              {CATEGORY_LABELS[code]}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn(chipBase, "border-brand-800 text-brand-800 hover:bg-brand-50")}
        >
          Filter akses fisik{criteriaCount > 0 ? ` (${criteriaCount})` : ""}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {hasActiveFilters(filters) ? (
          <button
            type="button"
            onClick={onReset}
            className="min-h-11 rounded-lg px-2 font-semibold text-brand-800 underline underline-offset-4 hover:bg-brand-50"
          >
            Atur ulang
          </button>
        ) : null}
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="flex flex-col gap-6 rounded-xl bg-canvas p-5"
      >
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="font-semibold">Kriteria akses fisik</legend>
          <p className="mb-3 mt-1 text-sm text-muted">
            Pilih kebutuhan Anda. Label di daftar dan penanda di peta akan
            menyesuaikan.
          </p>
          <div className="flex flex-wrap gap-2">
            {ATTRIBUTE_CODES.map((code) => {
              const checked = filters.criteria.includes(code);
              return (
                <label key={code} className="relative">
                  <input
                    type="checkbox"
                    name="criteria"
                    value={code}
                    checked={checked}
                    onChange={() => toggleCriterion(code)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      chipBase,
                      "cursor-pointer peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-800",
                      checked ? chipOn : chipOff,
                    )}
                  >
                    {checked ? "✓ " : ""}
                    {ATTRIBUTE_LABELS[code]}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {criteriaCount > 0 ? (
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="font-semibold">Hasil yang ditampilkan</legend>
            <p className="mb-2 mt-1 text-sm text-muted">
              Tempat berstatus &quot;Belum diketahui&quot; tidak pernah dihitung
              sebagai sesuai.
            </p>
            <div className="grid gap-x-6 sm:grid-cols-2">
              <label className="flex min-h-11 items-center gap-3">
                <input
                  type="radio"
                  name="result-mode"
                  value="all"
                  checked={filters.resultMode === "all"}
                  onChange={() => onChange({ ...filters, resultMode: "all" })}
                  className="h-5 w-5 shrink-0 accent-brand-700"
                />
                <span>Semua tempat, beri label sesuai kriteria</span>
              </label>
              <label className="flex min-h-11 items-center gap-3">
                <input
                  type="radio"
                  name="result-mode"
                  value="matching_only"
                  checked={filters.resultMode === "matching_only"}
                  onChange={() =>
                    onChange({ ...filters, resultMode: "matching_only" })
                  }
                  className="h-5 w-5 shrink-0 accent-brand-700"
                />
                <span>Hanya yang indikasinya sesuai kriteria</span>
              </label>
            </div>
          </fieldset>
        ) : null}
      </div>
    </form>
  );
}