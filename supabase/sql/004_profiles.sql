-- =====================================================================
-- AksesKita - Migrasi 004: profil pengguna dan peran
-- Peran disimpan di tabel profiles (BUKAN di metadata pengguna, yang bisa
-- diubah oleh pengguna sendiri). Pengguna tidak bisa mengubah perannya.
-- =====================================================================

-- ---------- 1. Tabel profil ----------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 2 and 60),
  role         text not null default 'user' check (role in ('user','moderator','admin')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ---------- 2. Keamanan: RLS + izin seminimal mungkin ----------
alter table public.profiles enable row level security;

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
-- Izin UPDATE hanya pada kolom display_name. Kolom role tidak bisa diubah pengguna.
grant update (display_name) on public.profiles to authenticated;

create policy "profiles_select_own"
on public.profiles
for select to authenticated
using (id = (select auth.uid()));

create policy "profiles_update_own"
on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- ---------- 3. Profil dibuat otomatis saat pengguna mendaftar ----------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate text;
begin
  candidate := btrim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  insert into public.profiles (id, display_name)
  values (
    new.id,
    case when char_length(candidate) between 2 and 60 then candidate else null end
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- 4. Profil untuk pengguna yang sudah ada sebelum migrasi ini ----------
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;