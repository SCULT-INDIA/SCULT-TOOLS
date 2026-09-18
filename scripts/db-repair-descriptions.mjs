#!/usr/bin/env node
// One-off repair: backfills `description` for the curated skills whose
// stored value is a meaningless YAML block-scalar indicator (see
// lib/skills/description.ts's own docblock — ~19.9% of the pre-curation
// registry). rowToSkill() in lib/skills/db.ts already repairs this at read
// time using resolveSkillDescription(description, body, ...), but that
// means every list/search/sibling/recently-added query has to fetch the
// full `body` column (the entire SKILL.md text) just to cover the ~1 in 5
// rows that need it — the single largest column, multiplied by every row in
// every listing, and a direct driver of Supabase egress.
//
// The registry is FROZEN (lib/skills/db.ts's header) — every served row's
// description/body pair is now fixed forever, so the repaired value can be
// computed once, in Postgres, using the exact same function the app runs at
// read time (imported directly, not reimplemented, so there is no chance of
// drift). After this runs, `description` is already correct for every
// served row and list queries can safely drop `body` from their SELECT.
//
// Two-phase, paginated on purpose: a single `select ... from skills` pulling
// all 10,000 bodies at once timed out over the session pooler (confirmed via
// a throwaway plain-pg probe before writing this). Phase 1 fetches only the
// small columns for every served row to find which ones actually need
// repair (~1 in 5); phase 2 fetches `body` only for that smaller candidate
// set, in pages, mirroring the paging already used by
// supabase/backups/skills-unserved-2026-09-16.jsonl.gz's export.
//
// Usage: node --experimental-strip-types --env-file=.env.local scripts/db-repair-descriptions.mjs [--dry-run]
import pg from 'pg'
import { isMeaninglessDescription, resolveSkillDescription } from '../lib/skills/description.ts'

const DRY_RUN = process.argv.includes('--dry-run')
const PAGE_SIZE = 500

function chunk(items, size) {
  const pages = []
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size))
  return pages
}

async function main() {
  const client = new pg.Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()

  const { rows: candidates } = await client.query(
    `select id, description, name, source_owner, source_repo from public.skills where served = true`,
  )
  const needsRepair = candidates.filter((row) => isMeaninglessDescription(row.description ?? ''))
  console.log(
    `${needsRepair.length} of ${candidates.length} served skills have a meaningless stored description.`,
  )
  if (needsRepair.length === 0) {
    await client.end()
    return
  }

  const byId = new Map(needsRepair.map((row) => [row.id, row]))
  const toFix = []
  const idPages = chunk([...byId.keys()], PAGE_SIZE)
  let fetched = 0
  for (const ids of idPages) {
    const { rows } = await client.query(`select id, body from public.skills where id = any($1)`, [ids])
    for (const { id, body } of rows) {
      const meta = byId.get(id)
      const resolved = resolveSkillDescription(
        meta.description ?? '',
        body ?? '',
        meta.name,
        meta.source_owner,
        meta.source_repo,
      )
      toFix.push({ id, description: resolved })
    }
    fetched += rows.length
    console.log(`  fetched bodies for ${fetched}/${needsRepair.length} candidates`)
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: showing the first 5 repairs, writing nothing.')
    for (const { id, description } of toFix.slice(0, 5)) {
      console.log(`  ${id}: ${description}`)
    }
    await client.end()
    return
  }

  console.log(`Writing ${toFix.length} repaired descriptions...`)
  for (const { id, description } of toFix) {
    await client.query(`update public.skills set description = $1 where id = $2`, [description, id])
  }

  console.log(`\nDone. ${toFix.length} of ${candidates.length} served skills now store a real description.`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
