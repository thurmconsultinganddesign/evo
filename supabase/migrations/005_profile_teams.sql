-- ============================================================
-- EVO — Multiple teams per profile
-- ============================================================
-- Replaces the single `profiles.team_id` with a many-to-many
-- join table so a member can belong to more than one team
-- (e.g. "Evolve Ubud" AND "Evolve Jakarta").
--
-- NOTE: `profiles.team_id` is intentionally KEPT (deprecated) for
-- backward safety. After this migration the app reads/writes the
-- join table only; the old column can be dropped in a later
-- migration once we're confident nothing depends on it.
-- ------------------------------------------------------------

-- --------------------------------------------------------
-- 1. Join table
-- --------------------------------------------------------
create table public.profile_teams (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  team_id    uuid not null references public.teams(id)    on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, team_id)
);

-- Helpful index for filtering members by team.
create index profile_teams_team_id_idx on public.profile_teams (team_id);

alter table public.profile_teams enable row level security;

-- --------------------------------------------------------
-- 2. RLS — reads mirror profile visibility; writes are own-profile only.
-- --------------------------------------------------------
-- A member can read team links for any profile that is visible to
-- them (visible profiles) or that is their own.
create policy "Profile teams: read visible or own"
  on public.profile_teams
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id
        and (p.is_visible = true or p.id = auth.uid())
    )
  );

-- A member can only add team links to their own profile.
create policy "Profile teams: insert own"
  on public.profile_teams
  for insert
  to authenticated
  with check (profile_id = auth.uid());

-- A member can only remove team links from their own profile.
create policy "Profile teams: delete own"
  on public.profile_teams
  for delete
  to authenticated
  using (profile_id = auth.uid());

-- --------------------------------------------------------
-- 3. Backfill existing single-team assignments
-- --------------------------------------------------------
insert into public.profile_teams (profile_id, team_id)
  select id, team_id
  from public.profiles
  where team_id is not null
on conflict do nothing;
