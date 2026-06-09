-- ============================================================
-- EVO Love — Teams
-- ============================================================
-- Adds a `teams` lookup table and links profiles to a team.
-- Teams are managed from the Supabase dashboard (insert a row to
-- add a new team — no code change or redeploy required).
--
-- NOTE: Markdown support for profile free-form text needs NO
-- migration — the markdown is stored as plain text in the existing
-- bio / purpose_statement / *_reflection columns.
-- ------------------------------------------------------------

-- --------------------------------------------------------
-- 1. Teams lookup table
-- --------------------------------------------------------
create table public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.teams enable row level security;

-- Anyone (including anonymous) can read the team list.
-- (Writes happen via the Supabase dashboard / service role only.)
create policy "Teams: public read"
  on public.teams
  for select
  to anon, authenticated
  using (true);

-- Seed the initial four teams.
insert into public.teams (name, sort_order) values
  ('Evolve Ubud & Regenerative Indonesia Network Ubud pilot chapter', 1),
  ('Evolve Jakarta', 2),
  ('Evo Platform', 3),
  ('Evo Villages', 4);

-- --------------------------------------------------------
-- 2. Link profiles to a team
-- --------------------------------------------------------
alter table public.profiles
  add column team_id uuid references public.teams(id) on delete set null;

-- Helpful index for filtering the team directory by team.
create index profiles_team_id_idx on public.profiles (team_id);
