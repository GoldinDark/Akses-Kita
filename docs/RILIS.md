# Catatan rilis AksesKita (pilot Bandung)

## Status

Versi pilot. Dibuka untuk publik. Belum ada fitur kirim observasi.
Data tempat: 6 tempat Wikipedia (koordinat perkiraan, akses belum diketahui)
dan data demo berlabel simulasi.

## Variabel lingkungan (nama saja, nilai TIDAK ditulis di sini)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (hanya kunci publishable, bukan secret)

Harus diisi di pengaturan proyek hosting SEBELUM build pertama.

## Sebelum deploy

- [ ] `npx tsc --noEmit` dan `npx eslint src` bersih
- [ ] `npm run build` berhasil di komputer sendiri
- [ ] `.env.local` TIDAK ikut di-commit (cek `git status`)
- [ ] Akun uji (`tes-rls-...`) sudah dihapus dari Authentication > Users
- [ ] Email kontak untuk privasi sudah diganti di halaman Privasi

## Sesudah deploy

- [ ] Beranda memuat peta dan 12 tempat (atau jumlah yang benar)
- [ ] `/relawan`, `/pedoman`, `/tentang`, `/privasi` terbuka
- [ ] Daftar dan masuk bekerja di alamat produksi
- [ ] Di Supabase, Site URL dan Redirect URLs diisi alamat produksi
- [ ] Header keamanan terlihat di tab Network

## Wajib sebelum fitur tulis (Fase 8-lite) dirilis

- [ ] SMTP sendiri dipasang di Supabase
- [ ] Konfirmasi email dinyalakan
- [ ] Moderasi dan batas kiriman (anti-spam) tersedia
- [ ] Prosedur backup dan pemulihan database ditulis dan dicoba

## Kembali ke versi lama

Di dashboard hosting, buka daftar deployment, pilih deployment terakhir yang
sehat, lalu jadikan versi produksi. Perubahan database TIDAK ikut kembali,
karena itu file SQL hanya menambah dan tidak mengubah yang lama.