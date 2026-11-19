# Keterbatasan dan masalah yang diketahui

Dokumen ini mencatat apa yang BELUM dibuktikan atau BELUM ada di AksesKita (versi pilot).
Diperbarui terakhir: 2026-11-17.

## 1. Data

- **Hanya 6 tempat nyata + 6 tempat demo.** Impor otomatis dari OpenStreetMap (Overpass API)
  gagal berulang kali (status 502 dan timeout dari tiga server publik, serta koneksi ditolak
  dari jaringan pengembang). Penyebab pasti tidak dapat dipastikan. Skrip `scripts/import-bandung.mjs`
  sudah dibuat dan diuji hanya dengan server tiruan, TIDAK pernah berhasil mengunduh data OSM asli.
- **Pengganti manual:** 6 tempat diambil dari infobox Wikipedia (CC BY-SA 4.0). Koordinatnya
  PERKIRAAN (titik pusat artikel), bukan survei lapangan, dan bisa meleset dari pintu masuk.
- **Kategori Pasar kosong** (belum ada sumber koordinat yang dapat dipertanggungjawabkan).
- **Kebun Binatang** dikategorikan "Taman" sebagai pendekatan, karena hanya ada 6 kategori tetap.
- **Belum ada observasi aksesibilitas nyata** pada tempat nyata. Semua atribut akses
  berstatus "belum diketahui" (bukan "tidak ada"). Hanya 5 tempat demo yang punya data, dan itu SIMULASI.
- Cakupan tempat sangat kecil dan tidak mewakili Kota Bandung.

## 2. Pengujian

- Alur login, pembacaan data, dan aturan RLS diuji di Supabase asli oleh pengembang
  (10/10 dan 8/8 pemeriksaan lolos). Uji end-to-end browser (Playwright) hanya dijalankan
  pada server Supabase tiruan di lingkungan pengembangan, bukan terhadap Supabase asli.
- Belum diuji dengan pembaca layar (NVDA, VoiceOver, TalkBack), Safari/iOS, dan perangkat seluler asli.
- Belum ada audit WCAG 2.2 AA penuh. Targetnya AA, tetapi kepatuhan penuh TIDAK diklaim.
- Belum ada uji beban atau uji keamanan oleh pihak independen.

## 3. Fitur belum ada

- Belum ada fitur kontribusi (tambah tempat, kirim observasi, unggah foto) dan moderasi.
  Peran moderator/admin hanya ada di database.
- Belum ada pagination (batas 1000 baris per permintaan Supabase; daftar akan gagal dengan
  pesan jelas di atas batas itu).
- Belum ada pencarian tingkat lanjut selain yang ada di beranda.

## 4. Infrastruktur dan operasional

- **Konfirmasi email dimatikan** untuk pengembangan (SMTP bawaan Supabase hanya 2 email/jam
  dan hanya ke anggota tim). Sebelum dipakai publik: SMTP khusus, konfirmasi email aktif, dan
  alur lupa kata sandi.
- **Paket gratis Supabase:** proyek dijeda otomatis setelah sekitar 7 hari sangat tidak aktif
  dan tidak ada cadangan harian otomatis. Prosedur cadangan dan pemulihan belum diuji.
- **Tile peta** memakai server publik OpenStreetMap (tanpa jaminan ketersediaan, tidak untuk
  lalu lintas besar). Sebelum peluncuran publik perlu penyedia lain. Pengguna peta mengirim
  alamat IP ke penyedia tile; kebijakan privasi harus menyebutnya.
- Belum ada kebijakan privasi, syarat layanan, dan mekanisme hapus data pengguna.
- Belum di-deploy dan belum ada remote GitHub (hanya commit lokal).

## 5. Lisensi dan atribusi

- Peta: OpenStreetMap contributors (ODbL). Nama dan koordinat tempat: Wikipedia (CC BY-SA 4.0).
  Kewajiban atribusi dipenuhi di footer dan di pojok peta; belum ditinjau oleh ahli hukum.

  - Next.js sempat berada di 16.4.3 yang memiliki kerentanan yang sudah ditambal (perbaikan di 16.4.5, kemudian dinaikkan ke 16.4.6 pada 2026-11-17). Dari daftar celah yang dibaca, sebagian besar menyangkut fitur yang tidak dipakai proyek ini, tetapi tidak dilakukan audit keamanan menyeluruh.
- `npm audit` melaporkan 7 kerentanan tingkat sedang pada paket alat lint (`@typescript-eslint`), bukan pada kode produksi. Belum ditangani; jangan memakai `npm audit fix --force`.

- Observasi lapangan pada tempat nyata: [belum ada / ada N tempat, diamati sendiri oleh pengembang pada tanggal ...]. Hanya satu pengamat, tanpa verifikasi pihak kedua.


## Keterbatasan tambahan (rilis pilot)

- Next.js sempat berada di versi dengan celah keamanan yang sudah ditambal
  (16.4.3, diperbaiki di 16.4.5). Sekarang memakai 16.4.6. Pembaruan
  keamanan harus dipantau rutin.
- `npm audit` melaporkan 7 isu tingkat moderate pada perangkat lint, bukan
  kode yang berjalan di produksi. `npm audit fix --force` sengaja tidak
  dipakai karena bisa merusak proyek.
- Lighthouse 100% hanya uji otomatis dan dijalankan pada desain lama.
  Belum diulang untuk desain baru, dan Lighthouse tidak menggantikan audit
  WCAG manual.
- Uji manual terbatas pada keyboard, zoom, dan layar HP. Belum diuji dengan
  pembaca layar (NVDA/VoiceOver) dan belum di Safari/iOS.
- Font Atkinson Hyperlegible Next belum diverifikasi di lingkungan uji
  otomatis; hanya dilihat langsung oleh pengembang.
- Belum ada Content-Security-Policy. Header keamanan yang ada hanya dasar.
- Konfirmasi email dimatikan untuk pilot. SMTP bawaan Supabase sangat
  terbatas dan tidak layak untuk publik.
- Peta memakai server tile publik OpenStreetMap tanpa jaminan ketersediaan.
  Alamat IP pengunjung terlihat oleh OpenStreetMap.
- Proyek Supabase gratis dapat dijeda bila lama tidak aktif.
- Belum ada prosedur backup dan pemulihan database.
- Skrip impor Overpass tidak pernah berhasil diuji di jaringan pengembang.
  Data saat ini manual dari Wikipedia.
- Belum ada fitur kirim observasi, moderasi, atau laporan data usang.