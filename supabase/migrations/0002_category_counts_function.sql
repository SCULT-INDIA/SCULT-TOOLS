-- PostgREST's query builder has no GROUP BY, so the hub page's per-category
-- counts (lib/skills/db.ts's getAllCategoryCounts) go through this RPC
-- instead of 23 separate count queries.
create or replace function public.skills_category_counts()
returns table (category text, count bigint)
language sql
stable
as $$
  select category, count(*)::bigint as count
  from public.skills
  group by category;
$$;

grant execute on function public.skills_category_counts() to anon, authenticated;
