import { cacheLife } from 'next/cache'
import { resolveSkillDescription } from './description'
import { supabaseSkills } from './supabase'
import type { Skill, SkillCategorySlug } from './types'

/**
 * The Skills Library's data-access layer. Unlike `lib/tools/registry.ts` or
 * `lib/prompts/registry.ts` (compile-time arrays), this reads a live
 * Supabase table that a separate Vercel sync-worker keeps growing toward
 * the full skills.sh registry (~600k) — far too large to hold in a
 * git-committed array or to statically pre-render in full. Every function
 * here is async for that reason, and callers use it accordingly: a few
 * hundred of the most-installed skills per category are still statically
 * generated at build time (see `generateStaticParams` in the route files),
 * everything else renders on first request and is cached with `cacheLife`
 * below, so the site stays fast without requiring a full pre-build of
 * something that size.
 */

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
    body: row.body,
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

const SKILL_COLUMNS =
  'id, slug, category, name, description, body, tags, license, license_gated, source_owner, source_repo, source_skill_id, source_url, installs, first_seen_at, last_synced_at, related_tools, related_prompts'

export const SKILLS_PAGE_SIZE = 60

/** The N most-installed skills in a category — the set that gets
 * statically pre-rendered at build time (see route files' `generateStaticParams`). */
export async function getTopSkillsByCategory(
  category: SkillCategorySlug,
  limit: number,
): Promise<readonly Skill[]> {
  'use cache'
  cacheLife('hours')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
    .eq('category', category)
    .order('installs', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getTopSkillsByCategory failed', error)
    return []
  }
  return data.map(rowToSkill)
}

/** One page of a category's skills, sorted by installs — backs
 * `/skills/[category]?page=N`. Page 1 (no query param) is the one
 * included in `generateStaticParams`; every other page renders on request. */
export async function getSkillsPage(
  category: SkillCategorySlug,
  page: number,
): Promise<readonly Skill[]> {
  'use cache'
  cacheLife('hours')
  const from = (page - 1) * SKILLS_PAGE_SIZE
  const to = from + SKILLS_PAGE_SIZE - 1
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
    .eq('category', category)
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
  cacheLife('hours')
  const { count, error } = await supabaseSkills
    .from('skills')
    .select('id', { count: 'exact', head: true })
    .eq('category', category)
  if (error) {
    console.error('getSkillCountByCategory failed', error)
    return 0
  }
  return count ?? 0
}

/** category -> count, for the hub page's tiles — one query, not one per category. */
export async function getAllCategoryCounts(): Promise<Readonly<Record<string, number>>> {
  'use cache'
  cacheLife('hours')
  const { data, error } = await supabaseSkills.rpc('skills_category_counts')
  if (error) {
    console.error('getAllCategoryCounts failed', error)
    return {}
  }
  const counts: Record<string, number> = {}
  for (const row of data as { category: string; count: number }[]) {
    counts[row.category] = row.count
  }
  return counts
}

export async function getSkill(
  category: SkillCategorySlug,
  slug: string,
): Promise<Skill | undefined> {
  'use cache'
  cacheLife('hours')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
    .eq('category', category)
    .eq('slug', slug)
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
    .select(SKILL_COLUMNS)
    .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
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
  cacheLife('hours')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
    .eq('category', category)
    .neq('slug', excludeSlug)
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
  cacheLife('hours')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select(SKILL_COLUMNS)
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
  cacheLife('hours')
  const { count, error } = await supabaseSkills
    .from('skills')
    .select('id', { count: 'exact', head: true })
  if (error) {
    console.error('getTotalSkillCount failed', error)
    return 0
  }
  return count ?? 0
}

/** Backs the hub page's real "last synced" timestamp and the sitemap's
 * `lastModified` for /skills — read from `skills_sync_meta`, written by the
 * sync-worker after each run, not guessed from the most recent row. */
export async function getSyncMeta(): Promise<{
  lastSyncedAt: string | null
  totalSkills: number
}> {
  'use cache'
  cacheLife('hours')
  const { data, error } = await supabaseSkills
    .from('skills_sync_meta')
    .select('last_synced_at, total_skills')
    .maybeSingle()
  if (error || !data) {
    if (error) console.error('getSyncMeta failed', error)
    return { lastSyncedAt: null, totalSkills: 0 }
  }
  return { lastSyncedAt: data.last_synced_at, totalSkills: data.total_skills }
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
  cacheLife('hours')
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
