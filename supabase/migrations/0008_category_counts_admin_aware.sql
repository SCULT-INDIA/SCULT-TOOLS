-- skills_category_counts() (0002, reshaped by 0004) counts every row in
-- `skills` with no `served`/`status` filter at all — safe only because,
-- until migration 0007, every row in the table WAS `served = true` (the
-- 40,456 unserved rows were deleted outright during the 2026-09-16
-- curation). Migration 0007 makes that assumption false: an admin-authored
-- draft or archived skill is a real row in this same table with
-- `served = false`, and this RPC would start counting it into the hub
-- page's per-category tallies the moment one exists. Narrowed to the same
-- visibility rule every other live read in lib/skills/db.ts now uses.
drop function if exists public.skills_category_counts(timestamptz);

create or replace function public.skills_category_counts(cutoff timestamptz default 'infinity')
returns table (category text, count bigint)
language sql
stable
as $$
  select category, count(*)::bigint as count
  from public.skills
  where first_seen_at <= cutoff
    and (served = true or (origin = 'admin' and status = 'published'))
  group by category;
$$;

grant execute on function public.skills_category_counts(timestamptz) to anon, authenticated;
