# AksesKita

Website peta dan direktori informasi aksesibilitas fisik tempat umum. Tujuannya membantu orang memahami kondisi akses suatu tempat sebelum berkunjung, melalui data yang spesifik, transparan, dan dapat diperbarui.

> **Status:** dalam pengembangan awal (Fase 2). Belum ada fitur yang dapat dipakai publik.
>
> **Catatan penting:** AksesKita bukan lembaga sertifikasi aksesibilitas dan tidak menjamin sebuah tempat cocok untuk setiap orang. Data demo selalu diberi label simulasi.

## Teknologi

- Next.js (App Router) dan TypeScript
- Tailwind CSS
- Direncanakan: Supabase (database, autentikasi, penyimpanan file) dan Leaflet (peta)

## Prasyarat

- Node.js 20.9 atau lebih baru
- npm
- Git

## Menjalankan secara lokal

```powershell
npm install
npm run dev
```

Buka `http://localhost:3000` di browser. Hentikan server dengan `Ctrl + C`.

## Script yang tersedia

Lihat bagian `scripts` pada `package.json`. Script umum: `dev`, `build`, `start`, dan `lint`.

## Environment variables

Belum ada. Akan ditambahkan di tahap integrasi database, dengan file `.env.example` berisi placeholder. Jangan pernah menyimpan kredensial asli di repository.

## Dokumentasi

Akan ditambahkan bertahap (panduan pengguna, panduan admin, kebijakan data, dan panduan deployment).