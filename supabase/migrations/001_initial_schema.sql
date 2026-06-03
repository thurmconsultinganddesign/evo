-- ============================================================
-- EVO Love — Initial Schema
-- ============================================================

-- --------------------------------------------------------
-- 1. Profiles
-- --------------------------------------------------------
create table public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  full_name       text,
  avatar_url      text,
  bio             text,
  linkedin_url    text,
  social_links    jsonb default '{}'::jsonb,
  purpose_statement text,
  health_score    integer check (health_score between 1 and 10),
  health_reflection text,
  relationships_score integer check (relationships_score between 1 and 10),
  relationships_reflection text,
  career_score    integer check (career_score between 1 and 10),
  career_reflection text,
  is_visible      boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Authenticated users can read visible profiles, plus their own
create policy "Profiles: authenticated read visible or own"
  on public.profiles
  for select
  to authenticated
  using (is_visible = true or id = auth.uid());

-- Users can only update their own profile
create policy "Profiles: update own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Users can insert their own profile (used by the trigger, but also allows manual insert)
create policy "Profiles: insert own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

-- --------------------------------------------------------
-- 2. Regen Partners
-- --------------------------------------------------------
create table public.regen_partners (
  id                      uuid primary key default gen_random_uuid(),
  created_by              uuid not null references public.profiles(id) on delete cascade,
  business_name           text not null,
  short_description       text,
  category                text,
  sustainability_statement text,
  website_url             text,
  offerings_url           text,
  photos                  text[] not null default '{}',
  google_maps_url         text,
  contact_details         text,
  latitude                double precision,
  longitude               double precision,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.regen_partners enable row level security;

-- Anyone (including anonymous) can read partner listings
create policy "Regen partners: public read"
  on public.regen_partners
  for select
  to anon, authenticated
  using (true);

-- Authenticated users can create new partner listings
create policy "Regen partners: authenticated insert"
  on public.regen_partners
  for insert
  to authenticated
  with check (created_by = auth.uid());

-- Authenticated users can update any partner listing (community-curated)
create policy "Regen partners: authenticated update"
  on public.regen_partners
  for update
  to authenticated
  using (true)
  with check (true);

-- --------------------------------------------------------
-- 3. Auto-create profile on user signup
-- --------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- --------------------------------------------------------
-- 4. Auto-update updated_at on row changes
-- --------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger regen_partners_set_updated_at
  before update on public.regen_partners
  for each row
  execute function public.set_updated_at();
