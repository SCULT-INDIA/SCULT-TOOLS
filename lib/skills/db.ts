import { cacheLife, cacheTag } from 'next/cache'
import { resolveSkillDescription } from './description'
import { supabaseSkills } from './supabase'
import type { Skill, SkillCategorySlug } from './types'

/**
 * The Skills Library's data-access layer. Unlike `lib/tools/registry.ts` or
 * `lib/prompts/registry.ts` (compile-time arrays read at build time with no
 * runtime dependency at all), this reads a Supabase table, so every
 * function here is async — but every served skill is statically
 * pre-rendered too (see `generateStaticParams` in the route files), since
 * the registry is frozen (below) and small enough to pre-render in full.
 *
 * Every function also carries `cacheTag('skills')`, kept as a cheap,
 * currently-unused hook: nothing calls `revalidateTag('skills', ...)`
 * today (the on-demand invalidation endpoint that used to — POST
 * /api/revalidate — was removed 2026-09-17 along with the rest of the sync
 * worker's plumbing, since nothing was ever wired to call it and an
 * unauthenticated-but-guessed request against it was the single largest
 * avoidable cost risk: one call could force-refresh every skill page's
 * cache at once). If the registry is ever deliberately unfrozen, tagging is
 * already in place to invalidate precisely.
 *
 * FROZEN AND CURATED as of 2026-09-16, at the user's explicit request, and
 * as of 2026-09-17 there is no sync worker left at all: the
 * `vercel-skills-sync` Vercel project's source, `.github/workflows/
 * sync-skills-worker.yml`, and the `/api/revalidate` on-demand invalidation
 * endpoint were all deleted from this repo — not just disabled — since
 * nothing was reading from them and each was a live risk of accidentally
 * regrowing or re-triggering a full cache refresh of a dataset that is
 * never supposed to change again. The 50,456 skills that worker had
 * indexed were curated down to a served set of exactly 10,000: every
 * category's top 250 by installs, then the globally most-installed to fill
 * the rest (supabase/migrations/0005_curate_served_skills.sql has the
 * selection and the reasoning — a flat installs cutoff would have handed
 * `general` 60% of the slots and left `architecture` with 11). Rows outside
 * that set were then deleted (0006), after a local backup.
 *
 * `served` is the single gate: every query below filters `.eq('served',
 * true)`. It is `default false`, so even a row some future write somehow
 * inserted could never appear on the site, the CLI, or the MCP tools — all
 * three read exclusively through this file. To lift this later requires
 * building a sync mechanism again from scratch (nothing to "re-enable" —
 * see above), having it set `served` on what it writes, and adjusting
 * `SKILLS_INDEXED_REGISTRY_TOTAL` below.
 */

/**
 * How many skills the registry held when the served set was curated from
 * it — the "curated from 50,000+" figure the site shows. A constant rather
 * than a live count on purpose: the unselected rows no longer exist in the
 * database, so this number is a fact about the curation, not the table.
 */
export const SKILLS_INDEXED_REGISTRY_TOTAL = 50_456

/** When the registry was frozen and curated; `getSyncMeta` clamps the
 * "last synced" date to this so a stale meta row can't claim otherwise. */
export const SKILLS_CURATED_AT = '2026-09-16T00:00:00.000Z'

// snake_case DB columns -> the camelCase `Skill` shape the rest of the app expects.
// biome-ignore lint/suspicious/noExplicitAny: raw Supabase row, shape asserted by the SELECT list below
function rowToSkill(row: any): Skill {
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
const SKILL_LIST_COLUMNS =
  'id, slug, category, name, description, tags, license, license_gated, source_owner, source_repo, source_skill_id, source_url, installs, first_seen_at, last_synced_at, related_tools, related_prompts'

const SKILL_COLUMNS = `${SKILL_LIST_COLUMNS}, body`

export const SKILLS_PAGE_SIZE = 60

/**
 * Every served skill's slug in a category — id/slug only, no other columns.
 * The registry is frozen (see this file's header), so `generateStaticParams`
 * in `app/skills/[category]/[slug]/page.tsx` uses this to pre-render every
 * served skill at build time instead of only the hottest few: a page that
 * exists as a plain static file is never checked against the ISR/Cache
 * Components read path at all, versus a `'use cache'` page, which is
 * re-checked against that cache on every single visit regardless of how
 * long `revalidate` is set to. For a dataset that will never change again,
 * that per-visit check is pure, avoidable cost.
 *
 * Paginated on purpose — this file's own `getAllSkillRefs` docblock records
 * the exact bug a single unpaginated `.select()` runs into: PostgREST caps
 * every response at `POSTGREST_MAX_ROWS` and reports the truncation only in
 * a header supabase-js discards, so a >1,000-row category (only `general`,
 * at 4,118, crosses that today) would silently return 1,000 slugs with
 * `error === null` — confirmed live: an earlier, unpaginated version of
 * this function shipped exactly that, and `general` built only 1,001 of
 * its 4,119 pages with no error anywhere in the build log. Throws rather
 * than returning a partial list for the same reason that function throws:
 * a partial `generateStaticParams` result is frozen into the build as if
 * it were complete.
 */
export async function getAllSkillSlugsByCategory(
  category: SkillCategorySlug,
): Promise<readonly string[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const slugs: string[] = []
  for (let offset = 0; ; offset += POSTGREST_MAX_ROWS) {
    const page = await fetchPage(`skill slugs for ${category} at offset ${offset}`, () =>
      supabaseSkills
        .from('skills')
        .select('slug')
        .eq('category', category)
        .eq('served', true)
        .order('id', { ascending: true })
        .range(offset, offset + POSTGREST_MAX_ROWS - 1),
    )
    slugs.push(...page.map((row) => row.slug))
    if (page.length < POSTGREST_MAX_ROWS) break
  }
  return slugs
}

/** The N most-installed skills in a category — used for the skills hub's
 * preview cards and the category page's "other categories" rail, not for
 * static generation (see `getAllSkillSlugsByCategory` for that). */
export async function getTopSkillsByCategory(
  category: SkillCategorySlug,
  limit: number,
): Promise<readonly Skill[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_LIST_COLUMNS)
    .eq('category', category)
    .eq('served', true)
    .order('installs', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getTopSkillsByCategory failed', error)
    return []
  }
  return data.map(rowToSkill)
}

/** One page of a category's skills, sorted by installs — backs page 1 at
 * `/skills/[category]` and every later page at
 * `/skills/[category]/page/[page]`. Both routes are fully static
 * (`dynamicParams = false`), enumerated in full by their own
 * `generateStaticParams` — see either route's docblock for why pagination
 * moved off a `?page=` query param. */
export async function getSkillsPage(
  category: SkillCategorySlug,
  page: number,
): Promise<readonly Skill[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const from = (page - 1) * SKILLS_PAGE_SIZE
  const to = from + SKILLS_PAGE_SIZE - 1
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_LIST_COLUMNS)
    .eq('category', category)
    .eq('served', true)
    .order('installs', { ascending: false })
    .range(from, to)
  if (error) {
    console.error('getSkillsPage failed', error)
    return []
  }
  return data.map(rowToSkill)
}

export async function getSkillCountByCategory(
  category: SkillCategorySlug,
): Promise<number> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { count, error } = await supabaseSkills
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('category', category)
    .eq('served', true)
  if (error) {
    console.error('getSkillCountByCategory failed', error)
    return 0
  }
  return count ?? 0
}

/**
 * category -> count, for the hub page's tiles — one query, not one per
 * category.
 *
 * Retried like `getAllSkillRefs`'s pages, for the identical reason: this ran
 * during `next build`'s page-data collection, which fans out across many
 * concurrent workers all hitting Supabase at once, and a single unretried
 * `57014 canceling statement due to statement timeout` here was enough to
 * fail an entire production build — not just this page, every one of it,
 * because `app/skills/[category]/page.tsx`'s `generateStaticParams` reads
 * this result and (before that function's own fix, see its docblock) turned
 * "the query failed" into "every category has zero skills", which Next's
 * Cache Components then rejected outright: "all `generateStaticParams`
 * functions must return at least one result." A transient DB hiccup should
 * cost a retry, not the deploy.
 *
 * Still resolves to `{}` after exhausting retries rather than throwing —
 * unlike `getAllSkillRefs`, this function is read by live page renders
 * (the skills hub, `/sitemap`) as well as build-time static params, and a
 * cache-friendly, gracefully-degrading `{}` is the right contract for those.
 * `generateStaticParams` callers are the ones that must not trust an empty
 * result as "confirmed zero" — see that function's own fallback.
 */
export async function getAllCategoryCounts(): Promise<Readonly<Record<string, number>>> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  let rows: { category: string; count: number }[]
  try {
    rows = await fetchPage('getAllCategoryCounts', () =>
      supabaseSkills.rpc('skills_category_counts'),
    )
  } catch (error) {
    // `fetchPage` already logged each retry attempt with the real Postgres
    // error; this is just the final "gave up" line, in the same
    // `console.error('label', error)` shape every other function here uses.
    console.error('getAllCategoryCounts failed after retries', error)
    return {}
  }
  const counts: Record<string, number> = {}
  for (const row of rows) {
    counts[row.category] = row.count
  }
  return counts
}

export async function getSkill(
  category: SkillCategorySlug,
  slug: string,
): Promise<Skill | undefined> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
    .eq('category', category)
    .eq('slug', slug)
    .eq('served', true)
    .maybeSingle()
  if (error) {
    console.error('getSkill failed', error)
    return undefined
  }
  return data ? rowToSkill(data) : undefined
}

/**
 * Slug-only lookup for the CLI API, where a user types just the slug from a
 * search result. Safe because slugs are de-duplicated site-wide at sync
 * time (see the Skill type's `slug` doc) — a slug never maps to two rows.
 * Uncached on purpose: the CLI route is rate-limited and this avoids a
 * second cache surface for one extra lookup path.
 */
export async function getSkillBySlug(slug: string): Promise<Skill | undefined> {
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
    .eq('slug', slug)
    .eq('served', true)
    .maybeSingle()
  if (error) {
    console.error('getSkillBySlug failed', error)
    return undefined
  }
  return data ? rowToSkill(data) : undefined
}

/** A few other skills in the same category, for the detail page's "more
 * like this" section — excludes the current skill. */
/**
 * Keyword search — the one lookup path that didn't exist before the MCP
 * server needed it. A real (if unindexed) `ilike` scan over name/description,
 * category-scoped first when given. Acceptable at the registry's current
 * scale; add a pg_trgm/GIN index as a fast-follow migration if usage data
 * later shows it's needed. Never returns `body` — callers that need it call
 * `getSkill` per result, which also carries the license-gate decision.
 */
export async function searchSkills(
  query: string,
  category: SkillCategorySlug | undefined,
  limit: number,
): Promise<readonly Skill[]> {
  // Sanitised, not interpolated raw: `.or()` takes a PostgREST filter
  // STRING whose grammar is comma/paren/dot-delimited, so a query
  // containing `,` `(` `)` restructures the filter itself — filter
  // injection, the PostgREST equivalent of SQL injection. Stripping the
  // grammar characters (plus the LIKE wildcards `%` and `_`, which would
  // let a caller turn one scan into a pathological pattern) keeps every
  // remaining character a literal. Length-capped as a second line even
  // though the MCP schema already caps it — this function is exported and
  // callable from anywhere.
  const trimmed = query
    .trim()
    .replace(/[,()%_\\"]/g, ' ')
    .slice(0, 100)
    .trim()
  if (trimmed === '') return []
  let builder = supabaseSkills
    .from('skills')
    .select(SKILL_LIST_COLUMNS)
    .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
    .eq('served', true)
    .order('installs', { ascending: false })
    .limit(limit)
  if (category !== undefined) builder = builder.eq('category', category)
  const { data, error } = await builder
  if (error) {
    console.error('searchSkills failed', error)
    return []
  }
  return data.map(rowToSkill)
}

export async function getSiblingSkills(
  category: SkillCategorySlug,
  excludeSlug: string,
  limit: number,
): Promise<readonly Skill[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_LIST_COLUMNS)
    .eq('category', category)
    .neq('slug', excludeSlug)
    .eq('served', true)
    .order('installs', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getSiblingSkills failed', error)
    return []
  }
  return data.map(rowToSkill)
}

export async function getRecentlyAddedSkills(limit: number): Promise<readonly Skill[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_LIST_COLUMNS)
    .eq('served', true)
    .order('first_seen_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getRecentlyAddedSkills failed', error)
    return []
  }
  return data.map(rowToSkill)
}

export async function getTotalSkillCount(): Promise<number> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { count, error } = await supabaseSkills
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('served', true)
  if (error) {
    console.error('getTotalSkillCount failed', error)
    return 0
  }
  return count ?? 0
}

/**
 * Backs the hub page's "last synced" date and the sitemap's `lastModified`
 * for /skills — read from `skills_sync_meta`, the row the sync-worker wrote
 * after each run.
 *
 * Both fields are clamped to the curation. `skills_sync_meta` is the sync
 * worker's own bookkeeping, not derived from `skills`, so it isn't covered
 * by the `served` gate every other function here uses — if a sync somehow
 * ran again it would report a later date and a larger total that the rest
 * of the site (frozen at 10,000) would flatly contradict. `totalSkills` is
 * therefore the real served count, and `lastSyncedAt` can never read later
 * than `SKILLS_CURATED_AT`.
 */
export async function getSyncMeta(): Promise<{
  lastSyncedAt: string | null
  totalSkills: number
}> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  const { data, error } = await supabaseSkills
    .from('skills_sync_meta')
    .select('last_synced_at')
    .maybeSingle()
  const totalSkills = await getTotalSkillCount()
  if (error || !data) {
    if (error) console.error('getSyncMeta failed', error)
    return { lastSyncedAt: null, totalSkills }
  }
  const lastSyncedAt =
    data.last_synced_at && data.last_synced_at > SKILLS_CURATED_AT
      ? SKILLS_CURATED_AT
      : data.last_synced_at
  return { lastSyncedAt, totalSkills }
}

/**
 * PostgREST's server-side row cap, which Supabase applies to *every*
 * response regardless of the range asked for. It is enforced silently:
 * a `.range(0, 49_999)` returns HTTP 200, `error === null`, and exactly
 * 1,000 rows — the truncation is disclosed only in a `Content-Range`
 * response header (`0-999/*`) that supabase-js does not surface. Verified
 * against the live table at 50,456 rows.
 *
 * So any query here that wants more than this must page for it. Every
 * other function in this file stays under the cap by construction
 * (`SKILLS_PAGE_SIZE` is 60, the rest take small top-N limits); only
 * `getAllSkillRefs` asks for more, and it pages below.
 */
const POSTGREST_MAX_ROWS = 1_000

/** Per-page attempts before giving up and failing the build. Covers a
 * genuinely transient refusal; it deliberately cannot paper over a slow
 * query, since re-running one of those just times out again. */
const PAGE_ATTEMPTS = 3

/**
 * A Supabase error rendered readable. `String(error)` on a PostgrestError
 * gives "[object Object]" — which is exactly what the first version of the
 * throw below logged, hiding a `57014 canceling statement due to statement
 * timeout` behind a useless message for a whole debugging cycle.
 */
function describeError(error: unknown): string {
  if (error !== null && typeof error === 'object') {
    const e = error as { code?: string; message?: string; details?: string }
    const parts = [e.code && `[${e.code}]`, e.message, e.details].filter(Boolean)
    if (parts.length > 0) return parts.join(' ')
  }
  return String(error)
}

/** One page, retried, or a throw naming what actually went wrong. */
async function fetchPage<T>(
  label: string,
  run: () => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  let lastError: unknown = null
  for (let attempt = 1; attempt <= PAGE_ATTEMPTS; attempt++) {
    const { data, error } = await run()
    if (!error && data) return data
    lastError = error
    console.error(
      `${label} failed (attempt ${attempt}/${PAGE_ATTEMPTS}): ${describeError(error)}`,
    )
    if (attempt < PAGE_ATTEMPTS) {
      // Linear backoff, no jitter: Math.random() is banned in this
      // codebase's render path and a fixed delay is enough here.
      await new Promise((resolve) => setTimeout(resolve, attempt * 500))
    }
  }
  throw new Error(
    `${label} failed after ${PAGE_ATTEMPTS} attempts: ${describeError(lastError)}`,
  )
}

/**
 * The `id` of the row immediately before `offset`, so a shard can start
 * reading with `.gt('id', …)` instead of an OFFSET.
 *
 * Selects only `id`, which Postgres can satisfy from the primary-key index
 * without touching the heap — measured at ~490ms against the live table at
 * offset 50,000, versus ~1,230ms for the equivalent full-column OFFSET read.
 * Returns null when the offset is past the end of the table.
 */
async function idBeforeOffset(offset: number): Promise<string | null> {
  const rows = await fetchPage(`skills id probe at offset ${offset}`, () =>
    supabaseSkills
      .from('skills')
      .select('id')
      .eq('served', true)
      .order('id', { ascending: true })
      .range(offset - 1, offset - 1),
  )
  return rows[0]?.id ?? null
}

/**
 * All (slug, category, lastSyncedAt) triples for one sitemap shard — used
 * only by the sitemap builder, which wants a URL list rather than full skill
 * bodies. `offset`/`limit` keep an offset-shaped contract, but nothing here
 * issues a deep OFFSET any more; see below.
 *
 * Three bugs have lived in this function, and the comments are the record of
 * them because each one shipped silently:
 *
 *  1. It issued a single `.range(offset, offset + limit - 1)` for 50,000
 *     rows. PostgREST caps every response at `POSTGREST_MAX_ROWS` and
 *     reports the truncation only in a header supabase-js discards, so it
 *     returned 1,000 rows with `error === null`. Fixed by paging.
 *
 *  2. On error it logged and returned the rows gathered so far, reasoning
 *     that a sitemap missing its tail beats an empty one. Wrong for a
 *     PRERENDERED route: the partial read is frozen into a static file and
 *     served for the life of the deploy. Production shipped an empty
 *     `/sitemap/2.xml`, dropping 456 skills, while every other shard looked
 *     perfect. Fixed by throwing — a failed build is loud and recoverable.
 *
 *  3. The throw then revealed the actual cause, which retries could never
 *     fix: `57014 canceling statement due to statement timeout`. An
 *     `ORDER BY id OFFSET 50000` has to walk 50,000 rows before returning
 *     any, and under build load that exceeded Supabase's statement timeout.
 *     Deep OFFSET is inherently fragile — the deepest offset always tracks
 *     the table size, so it gets worse as the registry grows toward the full
 *     ~600k. Fixed by keyset pagination: one cheap index-only probe finds
 *     the shard's starting `id`, then every page is
 *     `WHERE id > <last> ORDER BY id LIMIT n`, an index range scan whose
 *     cost does not depend on how deep into the table the shard sits
 *     (~244ms measured, versus ~1,230ms for the OFFSET form it replaced).
 *
 * `id` is the table's text primary key, so the ordering is total and stable
 * and keyset paging cannot skip or duplicate a row.
 */
export async function getAllSkillRefs(
  offset: number,
  limit: number,
): Promise<readonly { slug: string; category: string; lastSyncedAt: string }[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('skills')
  if (limit <= 0) return []

  // Shard 1 starts at the beginning and needs no probe at all.
  let after: string | null = null
  if (offset > 0) {
    after = await idBeforeOffset(offset)
    // Offset past the end of the table: no rows to serve. The sitemap's own
    // guard decides whether that is legitimate or a failure worth shouting
    // about, since only it knows how many skills there are supposed to be.
    if (after === null) return []
  }

  const refs: { slug: string; category: string; lastSyncedAt: string }[] = []
  while (refs.length < limit) {
    const pageSize = Math.min(POSTGREST_MAX_ROWS, limit - refs.length)
    const cursor = after
    const page = await fetchPage(
      `skills refs page after id ${cursor ?? '(start)'} (${refs.length} of ${limit} gathered)`,
      () => {
        const query = supabaseSkills
          .from('skills')
          .select('id, slug, category, last_synced_at')
          .eq('served', true)
          .order('id', { ascending: true })
          .limit(pageSize)
        return cursor === null ? query : query.gt('id', cursor)
      },
    )

    for (const r of page) {
      refs.push({ slug: r.slug, category: r.category, lastSyncedAt: r.last_synced_at })
    }
    // Advance the cursor to the last id read; a short page means the table
    // is exhausted. The row count is deliberately never read from
    // `skills_sync_meta` to decide when to stop, since that would trust a
    // cached counter over the rows themselves.
    if (page.length < pageSize) break
    after = page[page.length - 1]?.id ?? null
    if (after === null) break
  }
  return refs
}
