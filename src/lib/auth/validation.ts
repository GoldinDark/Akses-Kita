/** Aturan validasi form masuk/daftar. Fungsi murni: mudah diuji. */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;
// Batas bcrypt (algoritma penyimpan password): lebih dari 72 byte dipotong diam-diam.
const PASSWORD_MAX_BYTES = 72;

export function validateEmail(email: string): string | null {
  if (!email) return "Email wajib diisi.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return "Format email belum benar, contoh: nama@contoh.com.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password wajib diisi.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`;
  }
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) {
    return "Password terlalu panjang (maksimal 72 karakter).";
  }
  return null;
}

/** Nama tampilan boleh kosong; jika diisi harus 2-60 karakter. */
export function validateDisplayName(name: string): string | null {
  if (name === "") return null;
  if (name.length < 2 || name.length > 60) {
    return "Nama harus 2-60 karakter, atau biarkan kosong.";
  }
  return null;
}

function hasControlOrBackslash(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 32 || code === 127 || value[i] === "\\") return true;
  }
  return false;
}

/**
 * Mencegah "open redirect": setelah login, pengguna hanya boleh dikirim ke
 * alamat DI DALAM situs ini. Alamat luar (https://..., //situs-lain.com) ditolak.
 */
export function safeNextPath(
  raw: string | null | undefined,
  fallback = "/akun",
): string {
  if (!raw || raw.length > 200) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (hasControlOrBackslash(raw)) return fallback;
  try {
    const parsed = new URL(raw, "http://localhost");
    if (parsed.origin !== "http://localhost") return fallback;
    return parsed.pathname + parsed.search;
  } catch {
    return fallback;
  }
}