/** Menggabungkan nama class CSS dan mengabaikan nilai kosong. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
