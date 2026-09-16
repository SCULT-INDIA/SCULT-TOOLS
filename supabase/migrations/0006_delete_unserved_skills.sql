-- 2026-09-16: delete the 40,456 skills outside the curated served set, at
-- the user's explicit request ("delete the rest, they're not in use").
--
-- Runs only after 0005 computed `served`, and only after a local backup of
-- every row this removes was written and verified (40,456 rows, 0
-- malformed, all `served = false`): supabase/backups/
-- skills-unserved-2026-09-16.jsonl.gz (117 MB, gitignored — local to the
-- machine that ran this). Restoring is a straight re-insert of that file;
-- nothing else about the schema changes.
--
-- The `served` column and its partial indexes stay even though every
-- remaining row is `served = true`: `default false` is what guarantees a
-- row a re-enabled sync ever inserted stays invisible until someone
-- deliberately flags it, and lib/skills/db.ts keeps filtering on it for
-- exactly that reason.
delete from public.skills where not served;

-- The sync-worker's own counter, so nothing reading it raw is left saying
-- 50,456. Derived from the rows, not typed in.
update public.skills_sync_meta
set total_skills = (select count(*) from public.skills where served);

notify pgrst, 'reload schema';
