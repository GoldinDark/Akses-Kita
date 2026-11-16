# Database AksesKita

Database memakai Supabase (PostgreSQL), region Singapura. Struktur dan data awal
disimpan sebagai skrip SQL di folder `supabase/sql/` dan dijalankan **berurutan**
lewat SQL Editor di dashboard Supabase.

## Cara membangun ulang dari nol

1. Buat proyek Supabase baru.
2. Jalankan `supabase/sql/001_schema.sql` (tabel, trigger, view, RLS aktif, akses dicabut).
3. Jalankan `supabase/sql/002_policies.sql` (izin baca publik).
4. Jalankan `supabase/sql/003_seed.sql` (atribut dan 6 tempat DEMO).
5. Isi `.env.local` dengan URL dan publishable key proyek baru (lihat `.env.example`).
6. Jalankan `node --env-file=.env.local scripts/check-rls.mjs`. Harus menampilkan `SEMUA UJI LOLOS.`

## Tabel

| Tabel | Fungsi |
|---|---|
| `accessibility_attributes` | Daftar atribut akses fisik (kode, label, deskripsi, urutan). |
| `places` | Tempat. Kolom penting: `category`, `area`, `latitude`, `longitude`, `is_demo`, `status` (`draft`/`published`/`archived`). |
| `observations` | Catatan status satu atribut di satu tempat pada satu tanggal, beserta jenis sumbernya. |
| view `place_attribute_current` | Status TERBARU tiap atribut tiap tempat (observasi terbaru menang). |

## Aturan data yang dijaga database

- Status akses hanya salah satu dari: `available`, `not_available`, `unknown`, `not_applicable`, `needs_review`.
- `unknown` (belum diketahui) TIDAK sama dengan `not_available` (dilaporkan tidak ada).
- Atribut tanpa observasi dianggap `unknown` oleh aplikasi.
- Observasi bersifat hanya-tambah: tidak boleh diubah atau dihapus (trigger). Koreksi dilakukan dengan menambah observasi baru.
- Tanggal observasi tidak boleh di masa depan.
- Koordinat harus dalam rentang valid, kategori hanya 6 nilai yang diizinkan.
- Tempat yang punya observasi tidak bisa terhapus tanpa sengaja (`on delete restrict`).

## Keamanan (RLS)

- RLS aktif di ketiga tabel. View memakai `security_invoker = true`, jadi mengikuti hak pembacanya.
- Pengunjung (`anon`) dan pengguna login (`authenticated`) hanya punya izin SELECT.
  - `places`: hanya baris `status = 'published'`.
  - `observations`: hanya milik tempat yang `published`.
  - `accessibility_attributes`: semua baris.
- Belum ada kebijakan tulis. Kebijakan untuk kontribusi dan moderasi dibuat di Fase 6-8.
- Publishable key (`sb_publishable_...`) boleh ada di sisi publik karena yang melindungi data adalah RLS.
  Secret key (`sb_secret_...`) TIDAK BOLEH dipakai di aplikasi atau disimpan di Git.
- Pengujian: `scripts/check-rls.mjs` (8 pemeriksaan: 1 baca, 7 tulis yang harus ditolak).

## Data

- Semua tempat saat ini adalah DEMO (fiktif, `is_demo = true`, observasi `source_type = 'simulated'`).
  Tidak boleh ditampilkan sebagai kondisi nyata.
- Data asli Kota Bandung akan ditambahkan setelah sumber dan lisensinya diperiksa.

## Batasan yang diketahui

- Supabase mengembalikan maksimum 1000 baris per permintaan. Aplikasi sengaja menampilkan galat
  jika mendekati batas ini (sekitar 166 tempat). Perlu paginasi atau kueri per area sebelum itu.
- Ekstensi PostGIS (pencarian jarak) belum dipakai. Dipertimbangkan jika dibutuhkan.
- Paket gratis: proyek bisa di-pause setelah sekitar 7 hari aktivitas sangat rendah (bisa di-resume),
  tidak ada backup harian otomatis. Lihat `docs/BACKUP.md`.