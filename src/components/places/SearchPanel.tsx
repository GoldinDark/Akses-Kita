"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ATTRIBUTE_CODES,
  ATTRIBUTE_LABELS,
  CATEGORY_LABELS,
} from "@/lib/accessibility";
import { hasActiveFilters, type PlaceFilters } from "@/lib/places/filter";
import type { AttributeCode, PlaceCategory } from "@/types/place";

const CATEGORY_CODES = Object.keys(CATEGORY_LABELS) as PlaceCategory[];

interface SearchPanelProps {
  filters: PlaceFilters;
  onChange: (filters: PlaceFilters) => void;
  onReset: () => void;
}

export function SearchPanel({ filters, onChange, onReset }: SearchPanelProps) {
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
      className="space-y-5 rounded-xl border border-line bg-surface p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="search-place"
          type="search"
          label="Cari nama tempat atau area"
          placeholder="Contoh: perpustakaan"
          autoComplete="off"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-category" className="font-semibold">
            Kategori
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value as PlaceCategory | "all",
              })
            }
            className="min-h-12 rounded-lg border border-slate-500 bg-surface px-4 text-ink"
          >
            <option value="all">Semua kategori</option>
            {CATEGORY_CODES.map((code) => (
              <option key={code} value={code}>
                {CATEGORY_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-1 font-semibold">Kriteria akses fisik</legend>
        <p className="mb-2 text-sm text-muted">
          Pilih kebutuhan Anda. Label dan penanda peta akan menyesuaikan.
        </p>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {ATTRIBUTE_CODES.map((code) => (
            <label key={code} className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                name="criteria"
                value={code}
                checked={filters.criteria.includes(code)}
                onChange={() => toggleCriterion(code)}
                className="h-5 w-5 shrink-0 accent-brand-700"
              />
              <span>{ATTRIBUTE_LABELS[code]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {filters.criteria.length > 0 ? (
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-1 font-semibold">Hasil yang ditampilkan</legend>
          <p className="mb-2 text-sm text-muted">
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

      <Button
        variant="secondary"
        size="sm"
        onClick={onReset}
        disabled={!hasActiveFilters(filters)}
      >
        Atur ulang filter
      </Button>
    </form>
  );
}