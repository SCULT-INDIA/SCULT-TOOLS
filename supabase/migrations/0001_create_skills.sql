-- Skills Library schema. One row per real, third-party-sourced skill
-- (see lib/skills/types.ts's Skill interface — this table mirrors it
-- exactly). Populated by the Vercel sync-worker (calling skills.sh's
-- official, OIDC-authenticated v1 API) and read by the main app via the
-- anon key, gated to SELECT-only by RLS below.
create table if not exists public.skills (
  id text primary key,
  category text not null,
  slug text not null,
  name text not null,
  description text not null,
  body text not null,
  tags text[] not null default '{}',
  license text,
  license_gated boolean not null default true,
  source_owner text not null,
  source_repo text not null,
  source_skill_id text not null,
  source_url text not null,
  installs bigint not null default 0,
  first_seen_at timestamptz not null default now(),
  last_synced_at timestamptz not null default now(),
  related_tools text[] not null default '{}',
  related_prompts text[] not null default '{}'
);

-- Route shape is /skills/[category]/[slug] — unique per category, not
-- globally, so two different repos both naming a skill "testing" in
-- different categories never collide.
create unique index if not exists skills_category_slug_key
  on public.skills (category, slug);

create index if not exists skills_category_idx on public.skills (category);
create index if not exists skills_category_installs_idx
  on public.skills (category, installs desc);
create index if not exists skills_first_seen_idx on public.skills (first_seen_at desc);

alter table public.skills enable row level security;

-- The main app only ever reads (via the anon key). Writes come exclusively
-- from the sync-worker's service_role key, which bypasses RLS entirely —
-- no insert/update/delete policy is defined for anon/authenticated on
-- purpose, so a leaked anon key can never write to this table.
create policy "Public read access" on public.skills
  for select
  to anon, authenticated
  using (true);

-- One row, updated by the sync-worker after each run — the "updated daily"
-- claim and the hub page's timestamp both read this rather than trusting
-- an unrecorded footer line.
create table if not exists public.skills_sync_meta (
  id boolean primary key default true,
  last_synced_at timestamptz,
  total_skills bigint not null default 0,
  constraint skills_sync_meta_singleton check (id)
);

alter table public.skills_sync_meta enable row level security;

create policy "Public read access" on public.skills_sync_meta
  for select
  to anon, authenticated
  using (true);
