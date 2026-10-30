import { Input } from "@/components/ui/Input";
import { ATTRIBUTE_CODES, ATTRIBUTE_LABELS } from "@/lib/accessibility";

/**
 * Tampilan pencarian dan filter. Sengaja dinonaktifkan (disabled)
 * karena logikanya baru dibuat di Fase 4.
 */
export function SearchPanel() {
  return (
    <form
      role="search"
      aria-label="Cari tempat"
      className="rounded-xl border border-line bg-surface p-5"
    >
      <fieldset disabled className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
        <legend className="sr-only">Pencarian dan filter tempat</legend>

        <Input
          id="search-place"
          type="search"
          label="Cari nama tempat"
          placeholder="Contoh: perpustakaan"
        />

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 font-semibold">Filter akses fisik</legend>
          <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {ATTRIBUTE_CODES.map((code) => (
              <label key={code} className="flex min-h-11 items-center gap-3">
                <input
                  type="checkbox"
                  name="attribute"
                  value={code}
                  className="h-5 w-5 accent-brand-700"
                />
                <span>{ATTRIBUTE_LABELS[code]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      <p className="mt-3 text-sm text-muted">
        Pencarian dan filter akan segera aktif.
      </p>
    </form>
  );
}
