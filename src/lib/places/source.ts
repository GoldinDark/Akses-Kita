/** Jenis sumber sebuah observasi. Harus sama dengan nilai yang diizinkan di tabel observations. */
export type SourceType =
  | "on_site_observation"
  | "official_document"
  | "community_report"
  | "simulated"
  | "review_flag";

export const SOURCE_LABELS: Record<SourceType, string> = {
  on_site_observation: "Observasi di lokasi",
  official_document: "Dokumen resmi",
  community_report: "Laporan komunitas",
  simulated: "Simulasi (data demo)",
  review_flag: "Penanda tinjauan",
};

export function isSourceType(value: string): value is SourceType {
  return Object.prototype.hasOwnProperty.call(SOURCE_LABELS, value);
}