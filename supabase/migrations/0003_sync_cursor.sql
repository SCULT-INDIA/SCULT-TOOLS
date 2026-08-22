-- Tracks how far the Vercel sync-worker has paged through skills.sh's
-- official leaderboard (`/api/v1/skills`). One serverless invocation only
-- has a bounded execution window, so progress through the full ~600k
-- registry happens across many invocations — this is what lets each one
-- pick up exactly where the last left off instead of restarting from page 1.
alter table public.skills_sync_meta
  add column if not exists cursor_page integer not null default 0,
  add column if not exists cursor_done boolean not null default false,
  add column if not exists curated_done boolean not null default false;
