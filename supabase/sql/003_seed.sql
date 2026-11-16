-- =====================================================================
-- AksesKita - Seed: atribut + 6 tempat DEMO (fiktif, simulasi)
-- Aman dijalankan ulang (tidak membuat duplikat).
-- =====================================================================

-- ---------- 1. Daftar atribut ----------
insert into public.accessibility_attributes (code, label, description, sort_order) values
  ('step_free_entrance', 'Pintu masuk tanpa tangga', 'Pintu masuk utama dapat dicapai tanpa menaiki tangga atau undakan.', 1),
  ('ramp',               'Ramp',                     'Tersedia jalur landai untuk menggantikan tangga.', 2),
  ('elevator',           'Lift',                     'Tersedia lift jika bangunan lebih dari satu lantai.', 3),
  ('accessible_toilet',  'Toilet aksesibel',         'Tersedia toilet yang dapat digunakan pengguna kursi roda.', 4),
  ('accessible_parking', 'Parkir aksesibel',         'Tersedia area parkir khusus yang dekat dengan pintu masuk.', 5),
  ('path_to_entrance',   'Jalur menuju pintu masuk', 'Jalur dari jalan atau parkir ke pintu masuk rata dan cukup lebar.', 6)
on conflict (code) do nothing;

-- ---------- 2. Tempat demo (fiktif) ----------
insert into public.places
  (id, slug, name, category, area, latitude, longitude, is_demo, status, published_at)
values
  ('a0000000-0000-4000-8000-000000000001','demo-kantor-layanan-warga','Kantor Layanan Warga Contoh','public_service','Area Contoh A',-6.914,107.609,true,'published',now()),
  ('a0000000-0000-4000-8000-000000000002','demo-perpustakaan-daerah','Perpustakaan Daerah Contoh','education','Area Contoh B',-6.895,107.613,true,'published',now()),
  ('a0000000-0000-4000-8000-000000000003','demo-puskesmas','Puskesmas Contoh','health','Area Contoh A',-6.93,107.62,true,'published',now()),
  ('a0000000-0000-4000-8000-000000000004','demo-pasar-rakyat','Pasar Rakyat Contoh','market','Area Contoh C',-6.935,107.605,true,'published',now()),
  ('a0000000-0000-4000-8000-000000000005','demo-taman-kota','Taman Kota Contoh','park','Area Contoh B',-6.899,107.635,true,'published',now()),
  ('a0000000-0000-4000-8000-000000000006','demo-terminal-angkutan','Terminal Angkutan Contoh','transport','Area Contoh C',-6.912,107.599,true,'published',now())
on conflict (slug) do nothing;

-- ---------- 3. Observasi demo (simulasi) ----------
-- Taman Kota Contoh sengaja TANPA observasi (belum pernah diobservasi => semua "unknown").
insert into public.observations
  (place_id, attribute_code, status, observed_on, source_type, note)
select d.place_id, a.code, a.status, d.observed_on, 'simulated', 'Data demo: simulasi'
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, date '2026-09-12', 'available',     'available',      'not_applicable', 'available',     'unknown',       'available'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, date '2026-08-30', 'not_available', 'available',      'available',      'needs_review',  'available',     'unknown'),
  ('a0000000-0000-4000-8000-000000000003'::uuid, date '2026-07-21', 'available',     'not_applicable', 'not_applicable', 'available',     'available',     'needs_review'),
  ('a0000000-0000-4000-8000-000000000004'::uuid, date '2026-06-03', 'unknown',       'unknown',        'not_applicable', 'not_available', 'unknown',       'unknown'),
  ('a0000000-0000-4000-8000-000000000006'::uuid, date '2026-09-27', 'available',     'available',      'available',      'available',     'not_available', 'available')
) as d(place_id, observed_on, step_free_entrance, ramp, elevator, accessible_toilet, accessible_parking, path_to_entrance)
cross join lateral (values
  ('step_free_entrance', d.step_free_entrance),
  ('ramp',               d.ramp),
  ('elevator',           d.elevator),
  ('accessible_toilet',  d.accessible_toilet),
  ('accessible_parking', d.accessible_parking),
  ('path_to_entrance',   d.path_to_entrance)
) as a(code, status)
where not exists (
  select 1 from public.observations o
  where o.place_id = d.place_id and o.source_type = 'simulated'
);