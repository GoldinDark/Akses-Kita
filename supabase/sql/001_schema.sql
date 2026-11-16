-- =====================================================================
-- AksesKita - Migrasi 001: struktur tabel
-- Tujuan: membuat tabel atribut, tempat, dan observasi + pengaman dasar.
-- =====================================================================

-- ---------- 1. Daftar atribut akses ----------
create table public.accessibility_attributes (
  code        text primary key,
  label       text not null,
  description text,
  sort_order  integer not null default 0
);

-- ---------- 2. Tempat ----------
create table public.places (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null check (char_length(name) between 2 and 200),
  category     text not null check (category in
                 ('public_service','education','health','market','park','transport')),
  area         text not null,
  address      text,
  latitude     double precision not null check (latitude  between -90  and 90),
  longitude    double precision not null check (longitude between -180 and 180),
  is_demo      boolean not null default false,
  status       text not null default 'draft'
                 check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index places_status_idx   on public.places (status);
create index places_category_idx on public.places (category);

-- ---------- 3. Observasi (catatan status akses per tempat per atribut) ----------
create table public.observations (
  id             uuid primary key default gen_random_uuid(),
  place_id       uuid not null references public.places (id) on delete restrict,
  attribute_code text not null references public.accessibility_attributes (code),
  status         text not null check (status in
                   ('available','not_available','unknown','not_applicable','needs_review')),
  observed_on    date not null,
  source_type    text not null check (source_type in
                   ('on_site_observation','official_document','community_report',
                    'simulated','review_flag')),
  source_note    text,
  note           text,
  published_at   timestamptz not null default now()
);

create index observations_place_attr_idx
  on public.observations (place_id, attribute_code, observed_on desc, published_at desc);

-- ---------- 4. Otomatis memperbarui updated_at ----------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger places_set_updated_at
before update on public.places
for each row execute function public.set_updated_at();

-- ---------- 5. Observasi bersifat "hanya tambah" ----------
create function public.observations_forbid_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Observasi tidak boleh diubah atau dihapus. Tambahkan observasi baru.';
end;
$$;

create trigger observations_no_update_delete
before update or delete on public.observations
for each row execute function public.observations_forbid_change();

create function public.observations_check_date()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.observed_on > current_date then
    raise exception 'Tanggal observasi tidak boleh di masa depan.';
  end if;
  return new;
end;
$$;

create trigger observations_check_date_insert
before insert on public.observations
for each row execute function public.observations_check_date();

-- ---------- 6. View: status TERBARU tiap atribut tiap tempat ----------
create view public.place_attribute_current
with (security_invoker = true) as
select distinct on (o.place_id, o.attribute_code)
  o.place_id,
  o.attribute_code,
  o.status,
  o.observed_on,
  o.source_type
from public.observations o
order by o.place_id, o.attribute_code, o.observed_on desc, o.published_at desc, o.id;

-- ---------- 7. Keamanan dasar: aktifkan RLS dan cabut akses ----------
alter table public.accessibility_attributes enable row level security;
alter table public.places                   enable row level security;
alter table public.observations             enable row level security;

revoke all on public.accessibility_attributes from anon, authenticated;
revoke all on public.places                   from anon, authenticated;
revoke all on public.observations             from anon, authenticated;
revoke all on public.place_attribute_current  from anon, authenticated;