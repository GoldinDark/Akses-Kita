-- =====================================================================
-- AksesKita - Migrasi 002: izin baca publik (hanya baca, tanpa tulis)
-- =====================================================================

-- ---------- 1. Izin tingkat tabel: HANYA SELECT ----------
grant select on public.accessibility_attributes to anon, authenticated;
grant select on public.places                   to anon, authenticated;
grant select on public.observations             to anon, authenticated;
grant select on public.place_attribute_current  to anon, authenticated;

-- ---------- 2. Kebijakan RLS: baris mana yang boleh dibaca ----------
create policy "attributes_public_read"
on public.accessibility_attributes
for select to anon, authenticated
using (true);

create policy "places_public_read_published"
on public.places
for select to anon, authenticated
using (status = 'published');

create policy "observations_public_read_published_places"
on public.observations
for select to anon, authenticated
using (
  exists (
    select 1 from public.places p
    where p.id = observations.place_id
      and p.status = 'published'
  )
);