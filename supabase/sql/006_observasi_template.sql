-- =====================================================================
-- AksesKita - Template 006: observasi nyata di lokasi
-- JANGAN dijalankan sebelum diedit. Nilai GANTI_... sengaja membuat perintah
-- GAGAL kalau lupa diganti, supaya tidak ada data palsu yang masuk.
--
-- Aturan:
--  * Isi HANYA atribut yang benar-benar Anda lihat sendiri di lokasi.
--  * Atribut yang tidak diperiksa: hapus barisnya (otomatis tampil "belum diketahui").
--  * Tanggal = tanggal kunjungan sebenarnya (tidak boleh di masa depan).
--  * Status yang valid: available, not_available, unknown, not_applicable, needs_review.
--  * "not_available" hanya jika Anda memeriksa dan memang tidak ada.
-- =====================================================================

insert into public.observations
  (place_id, attribute_code, status, observed_on, source_type, source_note, note)
select p.id, v.code, v.status, date 'GANTI_TANGGAL_KUNJUNGAN', 'on_site_observation',
       'Observasi langsung oleh GANTI_INISIAL', v.note
from public.places p
cross join (values
  ('step_free_entrance', 'GANTI_STATUS', 'GANTI_CATATAN_ATAU_NULL'::text),
  ('ramp',               'GANTI_STATUS', null),
  ('elevator',           'GANTI_STATUS', null),
  ('accessible_toilet',  'GANTI_STATUS', null),
  ('accessible_parking', 'GANTI_STATUS', null),
  ('path_to_entrance',   'GANTI_STATUS', null)
) as v(code, status, note)
where p.slug = 'GANTI_SLUG_TEMPAT'
  and not exists (
    select 1 from public.observations o
    where o.place_id = p.id and o.attribute_code = v.code
      and o.observed_on = date 'GANTI_TANGGAL_KUNJUNGAN'
      and o.source_type = 'on_site_observation'
  );