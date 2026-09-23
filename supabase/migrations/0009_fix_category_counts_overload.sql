-- Migration 0008 created `skills_category_counts(cutoff timestamptz default
-- 'infinity')` via `create or replace function`, which does NOT replace a
-- pre-existing zero-argument `skills_category_counts()` left over from an
-- earlier migration (0002/0004) — Postgres treats them as two distinct
-- overloads since `create or replace` only replaces a function with the
-- exact same argument signature. The result: PostgREST's `.rpc
-- ('skills_category_counts')` call (no arguments) became genuinely
-- ambiguous between the two, since the new function's default makes it
-- callable with zero args too — PGRST203 "Could not choose the best
-- candidate function", observed live via `getAllCategoryCounts()` failing
-- after 3 retries. Discovered during this session's admin-CMS end-to-end
-- verification (app/sitemap/page.tsx calls getAllCategoryCounts() at
-- request time, a live path 0008's own testing hadn't exercised).
--
-- Fix: drop both existing overloads explicitly (by full signature, not
-- `if exists` on the one that never worked), then create exactly one.
drop function if exists public.skills_category_counts();
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
