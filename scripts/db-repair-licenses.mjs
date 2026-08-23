#!/usr/bin/env node
// One-off repair: re-checks license_gated skills against their repo-root
// LICENSE file. The original sync only checked for a license co-located
// with SKILL.md's own directory, which most single-skill repos don't use —
// they put LICENSE at the repo root instead, so ~79% of skills were gated
// only because that root file was never looked at. Same fix as
// vercel-skills-sync/api/sync.js's fetchRootLicense, applied retroactively.
import pg from 'pg'

const PERMISSIVE_LICENSES = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'MPL-2.0', 'Unlicense', 'CC0-1.0']
const LICENSE_TEXT_MARKERS = [
  ['MIT License', 'MIT'],
  ['Apache License', 'Apache-2.0'],
  ['BSD 3-Clause', 'BSD-3-Clause'],
  ['BSD 2-Clause', 'BSD-2-Clause'],
  ['ISC License', 'ISC'],
  ['Mozilla Public License', 'MPL-2.0'],
]
const CONCURRENCY = 25

async function fetchRootLicense(owner, repo) {
  for (const branch of ['main', 'master']) {
    for (const name of ['LICENSE', 'LICENSE.txt', 'LICENSE.md']) {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`, {
          signal: AbortSignal.timeout(10_000),
        })
        if (res.ok) return await res.text()
      } catch {
        // try the next branch/filename
      }
    }
  }
  return null
}

function classify(contents) {
  for (const [marker, spdx] of LICENSE_TEXT_MARKERS) {
    if (contents.includes(marker)) return spdx
  }
  return null
}

async function mapConcurrent(items, worker) {
  let next = 0
  async function run() {
    while (next < items.length) {
      const item = items[next++]
      await worker(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, run))
}

async function main() {
  const client = new pg.Client({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()

  // Only rows where NOTHING was found at all (`license is null`) — a gated
  // row that already recorded some stated license (even an unparsed one
  // like "AGPL-3.0-only" or "Proprietary...") keeps whatever the skill's
  // own frontmatter said, rather than letting an unrelated repo-root
  // LICENSE silently override an explicit, possibly-restrictive statement.
  const { rows } = await client.query(
    `select id, source_owner, source_repo from public.skills where license_gated = true and license is null`,
  )
  console.log(`Re-checking ${rows.length} gated, unlicensed skills against their repo-root LICENSE...`)

  // Fetches run concurrently; DB writes happen afterward, sequentially, on
  // this single pg.Client connection — a Client can only run one query at
  // a time, so interleaving concurrent UPDATEs on it here caused the first
  // run of this script to stall.
  let checked = 0
  const toFix = []
  await mapConcurrent(rows, async (row) => {
    const contents = await fetchRootLicense(row.source_owner, row.source_repo)
    checked++
    if (checked % 500 === 0) console.log(`  ${checked}/${rows.length} checked, ${toFix.length} fixable so far`)
    if (!contents) return

    // A stated but non-permissive/ambiguous frontmatter license string always
    // wins over a guessed root license — only reclassify when nothing more
    // specific was already recorded (the query above already filters to
    // `license is null`, so this is just documenting that invariant).
    const spdx = classify(contents)
    if (!spdx) return
    toFix.push({ id: row.id, spdx })
  })

  console.log(`Fetches done. Writing ${toFix.length} updates...`)
  for (const { id, spdx } of toFix) {
    await client.query(
      `update public.skills set license = $1, license_gated = false where id = $2`,
      [spdx, id],
    )
  }

  console.log(`\nDone. ${toFix.length} of ${rows.length} previously-gated skills now have a confirmed permissive license.`)
  await client.end()
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
