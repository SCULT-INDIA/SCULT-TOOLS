-- Admin publishing foundation: lets an authenticated admin publish new
-- Prompts and Skills without a code deployment, while leaving every
-- existing read path (the 1,211 compiled prompts, the 10,000-row frozen
-- `skills` table and its static-generation system) completely untouched.
--
-- Applied via the session-pooler connection (SUPABASE_DB_URL) as the
-- `postgres` role, the same connection scripts/db-repair-descriptions.mjs
-- and scripts/snapshot-skills.mjs already use — that role bypasses RLS by
-- default, so it plays the same part here that the (deleted) sync
-- worker's service_role key used to play for `skills`: writes happen
-- through this privileged, server-only connection; the site's own public
-- reads keep using the anon key, gated by RLS below exactly like `skills`
-- already is.
--
-- Design notes:
--   - `prompts` is a NEW table, not a migration of the 1,211 existing
--     TypeScript-authored prompts. It exists so admin-published prompts
--     have somewhere to live from day one; migrating the existing
--     registry into it is deliberately a separate, later piece of work
--     (see lib/prompts/db.ts's own docblock).
--   - `skills` is ALTERED, not replaced: an admin-published skill is a row
--     in the same table the sync worker used to populate, distinguished by
--     `origin`/`status` rather than a parallel table, so every existing
--     read function (getSkill, searchSkills, the whole snapshot-based
--     static-generation system) keeps working on admin content for free.
--   - `custom_categories` lets an admin add a genuinely new category for
--     either content type without a code change, while the existing
--     hand-tuned TypeScript category lists (lib/prompts/categories.ts,
--     lib/skills/categories.ts) stay authoritative for the built-in set —
--     see lib/admin/categories.ts for how the two are merged at read time.
--   - `admin_audit_log` is append-only, the source of truth for "who
--     published what, when" even though auth for v1 is one shared
--     passcode rather than per-person accounts (see lib/admin/auth.ts).

-- ==================================================== shared trigger fn
-- Referenced by both triggers below (`prompts_set_updated_at`,
-- `skills_set_updated_at`). Defined first, once, as a single source of
-- truth for both.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================ prompts
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  category text not null,
  title text not null,
  description text not null,
  prompt_text text not null,
  -- PromptVariable[] — {name, description, example, required}
  variables jsonb not null default '[]',
  target_tools text[] not null default '{}',
  tags text[] not null default '{}',
  why_it_works text not null,
  example_output text,
  -- PromptExampleImage | null — {src, alt, aspectRatio?, modelCredit?}
  example_image jsonb,
  -- PromptVideoCompanion | null — {promptText, targetTools}
  video_prompt jsonb,
  -- PromptVerification[] — {tool, version, date}; required at publish time,
  -- enforced by lib/admin/prompts.ts's validation, not a DB constraint,
  -- so a draft can be saved before it's filled in.
  verified_against jsonb not null default '[]',
  -- PromptChangelogEntry[] — {date, note}
  changelog jsonb not null default '[]',
  service_target text,
  related_tool_slug text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'unpublished', 'archived')),
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create unique index if not exists prompts_category_slug_key
  on public.prompts (category, slug);
create index if not exists prompts_status_idx on public.prompts (status);
create index if not exists prompts_category_idx on public.prompts (category);

alter table public.prompts enable row level security;

-- Mirrors `skills`'s "Public read access" policy exactly, narrowed to
-- published rows only — a draft or archived prompt is never reachable
-- through the anon key, so a leaked link to an unpublished slug 404s.
create policy "Public read access to published prompts" on public.prompts
  for select
  to anon, authenticated
  using (status = 'published');

create trigger prompts_set_updated_at
  before update on public.prompts
  for each row
  execute function public.set_updated_at();

-- ============================================================ skills
-- Every ALTER below is additive and nullable/defaulted, so every one of
-- the 10,000 existing rows (and every function that already reads this
-- table) is unaffected until it explicitly opts in.

alter table public.skills
  add column if not exists origin text not null default 'synced'
    check (origin in ('synced', 'admin')),
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published', 'unpublished', 'archived')),
  add column if not exists author_name text,
  -- `skills` had no updated_at column before this migration — added here,
  -- before the trigger below that maintains it, for `set_updated_at()`.
  add column if not exists updated_at timestamptz not null default now();

-- A synced skill's real source repo is a required fact (see 0001's
-- comment); an admin-authored skill has no such repo. Nullable only for
-- `origin = 'admin'` rows — enforced by lib/admin/skills.ts's validation
-- (a CHECK referencing another column would be the stricter DB-level
-- version of the same rule, but Postgres CHECK constraints can't express
-- "these columns are required only when this other column has value X"
-- without a more complex trigger; the application-level check plus this
-- migration's own backfill below is the pragmatic middle ground already
-- used elsewhere in this schema).
alter table public.skills alter column source_owner drop not null;
alter table public.skills alter column source_repo drop not null;
alter table public.skills alter column source_skill_id drop not null;
alter table public.skills alter column source_url drop not null;

create index if not exists skills_status_idx on public.skills (status);
create index if not exists skills_origin_idx on public.skills (origin);

-- The original policy (0001) is `using (true)` — RLS was wide open, and
-- `served = true` was enforced only at the application query level (every
-- lib/skills/db.ts function filters `.eq('served', true)` itself). This
-- tightens RLS to match what the app already does in practice, as a real
-- DB-level backstop, and adds the one new case: an admin-published skill,
-- gated by `status` instead of `served`. Safe for every existing row: the
-- 40,456 unserved rows were deleted outright during the 2026-09-16
-- curation (see lib/skills/db.ts's header), so every row left in the table
-- today already has `served = true` — this changes zero observable
-- behaviour for existing data. `ALTER POLICY` rather than DROP + CREATE
-- deliberately: this table serves live, real traffic, and dropping the
-- policy first would leave a real (if brief) window where RLS denies
-- every anon/authenticated row on `skills` because no policy exists yet.
alter policy "Public read access" on public.skills
  using (served = true or (origin = 'admin' and status = 'published'));

create trigger skills_set_updated_at
  before update on public.skills
  for each row
  execute function public.set_updated_at();

-- ==================================================== custom_categories
create table if not exists public.custom_categories (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('prompt', 'skill')),
  slug text not null,
  name text not null,
  blurb text not null,
  intro text not null,
  icon text not null,
  tile text not null check (tile in ('yellow', 'blue', 'lavender', 'green')),
  -- Prompts only (PromptGroupSlug) — null for a skill category.
  "group" text,
  -- Prompts only (PromptTier) — null for a skill category.
  tier smallint check (tier in (1, 2, 3)),
  service_target text,
  content_boundary text,
  created_at timestamptz not null default now()
);

create unique index if not exists custom_categories_type_slug_key
  on public.custom_categories (content_type, slug);

alter table public.custom_categories enable row level security;

-- Categories are taxonomy, not draft content — always public once created,
-- same as the built-in TypeScript category lists they sit alongside.
create policy "Public read access" on public.custom_categories
  for select
  to anon, authenticated
  using (true);

-- =================================================== admin_audit_log
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null default 'admin',
  action text not null
    check (action in ('create', 'update', 'publish', 'unpublish', 'archive', 'delete')),
  content_type text not null check (content_type in ('prompt', 'skill', 'category')),
  content_id text not null,
  content_slug text,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx
  on public.admin_audit_log (created_at desc);

alter table public.admin_audit_log enable row level security;

-- No anon/authenticated policy at all, on purpose — the audit log is
-- read exclusively through the same privileged connection that writes it
-- (lib/admin/pg.ts), never through the public anon-key client. This
-- mirrors `skills`'s own "no policy = no access via the public key" note.

