# Backup dan pemulihan

## Kondisi sekarang

- Paket Supabase yang dipakai: Free.
- Paket Free tidak menyediakan backup harian otomatis.
- Proyek Free bisa di-pause jika aktivitas database sangat rendah selama sekitar 7 hari.
  Proyek yang di-pause bisa dipulihkan dengan tombol "Resume project"
  (dokumentasi Supabase menyebut hingga 1 tahun setelah dipause).
- Saat proyek di-pause, situs menampilkan "Data tempat belum bisa dimuat".

## Yang sudah aman

- Struktur database dan data demo bisa dibangun ulang dari `supabase/sql/` (lihat `docs/DATABASE.md`).
- Kode aplikasi tersimpan di Git lokal.

## Yang BELUM aman (dikerjakan sebelum data asli dimasukkan)

- [ ] Data asli yang nanti dimasukkan lewat dashboard atau kontribusi pengguna TIDAK ada di skrip SQL.
      Tanpa backup, data itu hilang jika proyek dihapus atau rusak.
- [ ] Pilih dan uji cara ekspor data berkala (kandidat: ekspor tabel dari dashboard atau pg_dump
      memakai connection string). Cara yang dipilih harus DIUJI dengan memulihkannya ke proyek percobaan.
- [ ] Tentukan jadwal backup (misalnya mingguan) dan tempat penyimpanannya yang bukan di repositori Git.
- [ ] Jangan pernah menyimpan connection string atau password database di Git atau di chat.

## Aturan

- Backup yang belum pernah diuji pemulihannya tidak dianggap backup.
- Sebelum ada data asli, tidak ada klaim bahwa data pengguna aman dari kehilangan.