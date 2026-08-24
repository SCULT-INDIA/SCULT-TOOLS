import { cacheLife } from 'next/cache'
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
    description: row.description,
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

export async function getSkillCountByCategory(category: SkillCategorySlug): Promise<number> {
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
  const trimmed = query.trim()
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
export async function getSyncMeta(): Promise<{ lastSyncedAt: string | null; totalSkills: number }> {
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

/** All (id, slug, category, lastSyncedAt) pairs — used only by the sitemap
 * builder, which pages through this itself rather than loading full skill
 * bodies for a URL list. */
export async function getAllSkillRefs(
  offset: number,
  limit: number,
): Promise<readonly { slug: string; category: string; lastSyncedAt: string }[]> {
  'use cache'
  cacheLife('hours')
  const { data, error } = await supabaseSkills
    .from('skills')
    .select('slug, category, last_synced_at')
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1)
  if (error) {
    console.error('getAllSkillRefs failed', error)
    return []
  }
  return data.map((r) => ({ slug: r.slug, category: r.category, lastSyncedAt: r.last_synced_at }))
}
