import type { NextConfig } from "next";

// Header keamanan dasar untuk semua halaman. Ini bukan jaminan keamanan penuh.
const securityHeaders = [
  // Browser tidak boleh "menebak" jenis file.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Halaman ini tidak boleh ditanam di situs lain (mencegah clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Alamat penuh halaman tidak dikirim ke situs lain.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Situs ini tidak memakai kamera, mikrofon, atau lokasi.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // Lencana pengembangan Next.js di pojok layar. Hanya tampil saat `npm run dev`.
  // Galat kompilasi tetap ditampilkan walau lencana disembunyikan.
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;