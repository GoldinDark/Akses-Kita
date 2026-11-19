-- =====================================================================
-- AksesKita - Seed 005: tempat nyata di Bandung (daftar manual)
-- Sumber koordinat: infobox artikel Wikipedia (CC BY-SA 4.0), diambil 2026-11-17.
-- Koordinat bersifat PERKIRAAN (titik pusat artikel), bukan survei lapangan.
-- Hanya nama, kategori, koordinat. TIDAK ada observasi aksesibilitas:
-- semua atribut akses tetap "belum diketahui".
-- Aman dijalankan ulang (tidak membuat duplikat).
-- =====================================================================

insert into public.places
  (slug, name, category, area, latitude, longitude, is_demo, status, published_at)
values
  ('wiki-stasiun-bandung',      'Stasiun Bandung',                    'transport',      'Bandung', -6.914170, 107.602500, false, 'published', now()),
  ('wiki-stasiun-kiaracondong', 'Stasiun Kiaracondong',               'transport',      'Bandung', -6.924656, 107.646561, false, 'published', now()),
  ('wiki-rshs',                 'RSUP Dr. Hasan Sadikin',             'health',         'Bandung', -6.898060, 107.598330, false, 'published', now()),
  ('wiki-itb',                  'Institut Teknologi Bandung',         'education',      'Bandung', -6.890903, 107.610378, false, 'published', now()),
  ('wiki-gedung-sate',          'Gedung Sate',                        'public_service', 'Bandung', -6.902459, 107.618730, false, 'published', now()),
  ('wiki-kebun-binatang',       'Kebun Binatang Bandung',             'park',           'Bandung', -6.890300, 107.606900, false, 'published', now())
on conflict (slug) do nothing;