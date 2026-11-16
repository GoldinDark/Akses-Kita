# Akun, peran, dan keamanan

## Cara kerja

- Login memakai email dan password lewat Supabase Auth.
- Sesi disimpan di cookie. `src/proxy.ts` menyegarkan sesi di setiap permintaan dan
  mengalihkan pengunjung tanpa login dari halaman terlindungi (saat ini hanya `/akun`).
- Server memeriksa pengguna dengan `getClaims()` (token diperiksa keasliannya), bukan `getSession()`.
- Halaman terlindungi memeriksa login lagi di dalam halamannya (dua lapis penjagaan).
- Pengalihan setelah login hanya diizinkan ke alamat di dalam situs (`safeNextPath`).

## Peran

| Peran | Cara memperoleh | Kemampuan saat ini |
|---|---|---|
| `user` | Otomatis saat mendaftar | Melihat dan mengubah nama tampilan profil sendiri |
| `moderator`, `admin` | Hanya lewat SQL Editor oleh pemilik proyek | Belum ada kemampuan khusus (Fase 8) |

Memberi peran, dijalankan manual oleh pemilik proyek:

    update public.profiles set role = 'moderator' where id = '<id pengguna>';

Peran disimpan di tabel `profiles`, bukan di metadata akun, karena metadata bisa diubah pengguna sendiri.
Kolom `role` tidak punya izin UPDATE untuk pengguna.

## Pengujian

- `node --env-file=.env.local scripts/check-rls.mjs` (data publik: baca boleh, tulis ditolak).
- `node --env-file=.env.local scripts/check-auth-rls.mjs` (dua akun: tidak saling melihat atau mengubah,
  tidak bisa menaikkan peran). Membuat akun `tes-rls-...`; hapus manual di Authentication > Users.

## Keputusan dan risiko yang diketahui

- **Konfirmasi email dimatikan** selama pengembangan. Alasan: layanan email bawaan Supabase hanya mengirim
  ke anggota tim organisasi dan dibatasi 2 email per jam. Akibatnya: email bisa dipakai tanpa dibuktikan
  pemiliknya, dan fitur lupa password belum tersedia.
  **Sebelum dibuka untuk publik:** pasang SMTP sendiri, nyalakan konfirmasi email, buat alur lupa password.
- Pesan galat login dan daftar sengaja umum agar tidak membocorkan apakah sebuah email sudah terdaftar.
- Batas percobaan login dan pendaftaran mengandalkan pembatas bawaan Supabase; belum diuji beban.
- Publishable key boleh publik. Secret key tidak dipakai dan tidak boleh disimpan di Git.
- Belum ada CAPTCHA dan verifikasi dua langkah.