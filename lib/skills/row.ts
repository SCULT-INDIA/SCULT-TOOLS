import { resolveSkillDescription } from './description'
import type { Skill } from './types'

/**
 * The one place the `skills` table's row shape is known: which columns a
 * query selects, and how a raw snake_case row becomes the camelCase `Skill`
 * the rest of the app consumes.
 *
 * Split out of ./db.ts (2026-09-18) because a second reader of raw rows now
 * exists — ./snapshot.ts, which turns the build-time registry snapshot
 * written by scripts/snapshot-skills.mjs into the same `Skill` objects.
 * Both must agree byte-for-byte on the column list and the conversion, or
 * a page built from the snapshot would differ from the same page rendered
 * live; importing from here is what makes that agreement structural
 * rather than a matter of keeping two copies in step. (The .mjs script
 * cannot import a `.ts` module without a Node flag this deploy target
 * isn't pinned to, so it carries its own copy of `SKILL_COLUMNS`, and
 * ./snapshot.test.ts asserts the two are identical.)
 */

/**
 * Every column except `body` (the full SKILL.md text) — the single largest
 * column, and one a list/card view never renders (see SkillCard.tsx: name,
 * description, tags, installs only). `resolveSkillDescription` in
 * rowToSkill() falls back to `body` only for a stored description that is
 * meaningless (~19.9% of the pre-curation registry), and
 * scripts/db-repair-descriptions.mjs has since backfilled a real
 * `description` for every served row, so that fallback is never actually
 * needed for a served skill — dropping `body` from list queries costs
 * nothing. `getSkill`/`getSkillBySlug` (the detail page and the CLI's
 * single-skill lookup, the only places that render or export the body)
 * still select the full `SKILL_COLUMNS` below.
 */
export const SKILL_LIST_COLUMNS =
  'id, slug, category, name, description, tags, license, license_gated, source_owner, source_repo, source_skill_id, source_url, installs, first_seen_at, last_synced_at, related_tools, related_prompts'

export const SKILL_COLUMNS = `${SKILL_LIST_COLUMNS}, body`

// snake_case DB columns -> the camelCase `Skill` shape the rest of the app expects.
// biome-ignore lint/suspicious/noExplicitAny: raw Supabase row, shape asserted by the SELECT list above
export function rowToSkill(row: any): Skill {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    name: row.name,
    // Repaired here, at the single boundary every consumer reads through,
    // because 19.9% of rows store only a YAML block-scalar indicator (`>`,
    // `|`, `>-`) where the description should be — see ./description.ts.
    // Doing it here is what fixes the detail page, every listing card, the
    // meta tags, the CLI and MCP payloads and all four Markdown exports at
    // once; the rows themselves are only writable by the sync worker, which
    // is a separate project holding the sole service-role key.
    description: resolveSkillDescription(
      row.description ?? '',
      row.body ?? '',
      row.name,
      row.source_owner,
      row.source_repo,
    ),
    // List queries no longer select `body` (see SKILL_LIST_COLUMNS above), so
    // this is `undefined` on those rows — `''` keeps the `Skill` type honest
    // (`body: string`, never undefined) rather than crashing a future
    // `skill.body.trim()` call on a list result that was never meant to have one.
    body: row.body ?? '',
    tags: row.tags ?? [],
    license: row.license ?? undefined,
    licenseGated: row.license_gated,
    sourceOwner: row.source_owner,
    sourceRepo: row.source_repo,
    sourceSkillId: row.source_skill_id,
    sourceUrl: row.source_url,
    installs: row.installs,
    firstSeenAt: row.first_seen_at,
    lastSyncedAt: row.last_synced_at,
    relatedTools: row.related_tools ?? [],
    relatedPrompts: row.related_prompts ?? [],
  }
}
