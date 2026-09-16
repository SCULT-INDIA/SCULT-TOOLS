-- 2026-09-16: the Skills Library is frozen at its current size at the
-- user's explicit request (see lib/skills/db.ts's SKILLS_FREEZE_CUTOFF
-- docblock for the full context — this migration is the one piece of that
-- freeze that lives in the database rather than in application code,
-- because this RPC does a GROUP BY PostgREST's own query builder can't
-- express, so it can't take the same `.lte('first_seen_at', ...)` filter
-- every other query in lib/skills/db.ts does).
--
-- Postgres treats a different parameter list as a different, overloaded
-- function rather than a replacement — `create or replace` alone would
-- have left the old zero-argument version callable (and unfiltered)
-- alongside this one, which PostgREST's `.rpc('skills_category_counts')`
-- with no arguments could then resolve ambiguously between. Dropping the
-- old signature first guarantees exactly one version exists.
--
-- `cutoff` defaults to 'infinity' (no filtering) so any other caller of
-- this function — none exist today, but the signature is now public API —
-- keeps its current behavior unless it deliberately passes a cutoff.
drop function if exists public.skills_category_counts();

create or replace function public.skills_category_counts(cutoff timestamptz default 'infinity')
returns table (category text, count bigint)
language sql
stable
as $$
  select category, count(*)::bigint as count
  from public.skills
  where first_seen_at <= cutoff
  group by category;
$$;

grant execute on function public.skills_category_counts(timestamptz) to anon, authenticated;
