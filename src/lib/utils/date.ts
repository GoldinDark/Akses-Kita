// timeZone UTC agar hasil format sama di server dan browser.
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** Mengubah "2026-09-12" menjadi "12 September 2026". */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}