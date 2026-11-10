/**
 * Konfigurasi peta, dipisahkan dari komponen UI agar penyedia tile
 * dapat diganti tanpa menyentuh komponen peta.
 */

/** Pusat dan zoom awal: Kota Bandung (wilayah pilot). */
export const DEFAULT_MAP_CENTER: [number, number] = [-6.9175, 107.6191];
export const DEFAULT_MAP_ZOOM = 13;

/**
 * Tile server publik OpenStreetMap, dipakai untuk pengembangan dan pilot kecil.
 * Syaratnya (https://operations.osmfoundation.org/policies/tiles/):
 * - atribusi OpenStreetMap harus terlihat jelas di peta,
 * - browser harus mengirim header Referer,
 * - dilarang mengunduh tile massal atau memakainya untuk mode offline,
 * - tanpa jaminan ketersediaan (best-effort, tanpa SLA).
 * Sebelum peluncuran publik, evaluasi penyedia lain (lihat docs/DECISIONS.md nanti).
 */
export const TILE_PROVIDER = {
  name: "OpenStreetMap",
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  referrerPolicy: "strict-origin-when-cross-origin",
} as const;