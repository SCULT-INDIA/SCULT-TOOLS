-- 2026-09-16: curate the frozen 50,456-skill registry down to a served set
-- of exactly 10,000, at the user's explicit request — see lib/skills/db.ts's
-- header for the full context. Nothing is deleted: every row stays, and the
-- full registry count remains readable (getRegistryTotalCount) for the
-- "50,000+ indexed" figure. Only which rows the website serves changes.
--
-- Why a stored flag rather than an installs threshold: a single global
-- cutoff (installs >= 825 gave exactly 10,001) hands `general` 6,012 of the
-- slots and leaves `architecture` with 11, `git-workflows` with 16 — the
-- library would stop covering its own categories. So the selection is
-- floor + fill: every category keeps its top 250 by installs (the smallest
-- category, `architecture`, has 236 rows, so it keeps all of them), then
-- the remaining slots go to the globally most-installed skills not already
-- picked, until the total is exactly 10,000. That is a ranking, not a
-- filter — PostgREST's query builder can't express it, so it is computed
-- once here (the data is frozen, so once is enough) and every query in
-- lib/skills/db.ts becomes a plain `.eq('served', true)`.
--
-- `default false` means any row a re-enabled sync ever inserted is excluded
-- automatically — this flag subsumes the first_seen_at freeze cutoff as the
-- website's guarantee, and is strictly stronger than it.
alter table public.skills
  add column if not exists served boolean not null default false;

update public.skills set served = false;

with ranked as (
  select id,
         row_number() over (partition by category order by installs desc, id) as cat_rank,
         row_number() over (order by installs desc, id) as global_rank
  from public.skills
),
floor_pick as (
  select id from ranked where cat_rank <= 250
),
fill_ranked as (
  select r.id, row_number() over (order by r.global_rank) as fill_rank
  from ranked r
  where not exists (select 1 from floor_pick f where f.id = r.id)
),
fill_pick as (
  select id from fill_ranked
  where fill_rank <= 10000 - (select count(*) from floor_pick)
)
update public.skills s
set served = true
from (select id from floor_pick union all select id from fill_pick) picked
where s.id = picked.id;

-- Partial indexes over the served set only: every hot query filters on
-- `served`, and a 10,000-row index is a fifth the size of the full one.
create index if not exists skills_served_category_installs_idx
  on public.skills (category, installs desc) where served;
create index if not exists skills_served_installs_idx
  on public.skills (installs desc) where served;
create index if not exists skills_served_first_seen_idx
  on public.skills (first_seen_at desc) where served;
create index if not exists skills_served_id_idx
  on public.skills (id) where served;

-- The hub page's per-category counts RPC now counts the served set. Both
-- prior signatures are dropped first: Postgres treats a different parameter
-- list as an overload, not a replacement, and a no-argument
-- `.rpc('skills_category_counts')` would resolve ambiguously between them.
drop function if exists public.skills_category_counts(timestamptz);
drop function if exists public.skills_category_counts();

create function public.skills_category_counts()
returns table (category text, count bigint)
language sql
stable
as $$
  select category, count(*)::bigint as count
  from public.skills
  where served
  group by category;
$$;

grant execute on function public.skills_category_counts() to anon, authenticated;

-- PostgREST caches the schema; a new column is invisible to the anon-key
-- client until it reloads.
notify pgrst, 'reload schema';
