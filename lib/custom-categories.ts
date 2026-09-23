import { cacheLife, cacheTag } from 'next/cache'
import { supabaseAnon } from './supabase-anon'

/**
 * Public reads of admin-created categories (migration 0007's
 * `custom_categories`) — shared by Prompts and Skills, since an admin can
 * add a new category to either from the same UI. This is deliberately a
 * peer of `lib/prompts/` and `lib/skills/`, not a member of either: the
 * built-in category lists those two directories already export
 * (`PROMPT_CATEGORIES`, `SKILL_CATEGORIES`) stay the authoritative,
 * hand-tuned source for categories that ship in code; this module is only
 * ever consulted as a FALLBACK, for a slug neither list recognises — see
 * `getPromptCategory`/`getSkillCategory`'s own updated docblocks for
 * exactly where that fallback is wired in.
 *
 * Read-only, anon-key, RLS-gated like every other public read in this app
 * (`custom_categories`'s policy is `using (true)` — categories are
 * taxonomy, not draft content, so there is nothing to gate on `status`
 * the way `prompts`/admin-authored `skills` rows are). Writing a new
 * category is an admin action — see lib/admin/categories.ts, which goes
 * through the separate elevated connection, not this client.
 */

export type CustomCategoryContentType = 'prompt' | 'skill'

export interface CustomCategory {
  readonly contentType: CustomCategoryContentType
  readonly slug: string
  readonly name: string
  readonly blurb: string
  readonly intro: string
  readonly icon: string
  /** A data: URL for an admin-uploaded logo image, preferred over `icon`
   * (a lucide-react component name) wherever a category's icon renders —
   * see components/ui/Icon.tsx's docblock for why a typed name alone is
   * error-prone. Undefined for a category created before this existed, or
   * for the built-in hand-tuned category lists, which never set it. */
  readonly logoDataUrl?: string
  readonly tile: 'yellow' | 'blue' | 'lavender' | 'green'
  /** Prompt categories only — the PromptGroupSlug it displays under. */
  readonly group?: string
  /** Prompt categories only — the PromptTier it should render as. */
  readonly tier?: 1 | 2 | 3
  readonly serviceTarget?: string
  readonly contentBoundary?: string
}

// biome-ignore lint/suspicious/noExplicitAny: raw Supabase row, shape asserted by the SELECT list in each query below
function rowToCategory(row: any): CustomCategory {
  return {
    contentType: row.content_type,
    slug: row.slug,
    name: row.name,
    blurb: row.blurb,
    intro: row.intro,
    icon: row.icon,
    logoDataUrl: row.logo_data_url ?? undefined,
    tile: row.tile,
    group: row.group ?? undefined,
    tier: row.tier ?? undefined,
    serviceTarget: row.service_target ?? undefined,
    contentBoundary: row.content_boundary ?? undefined,
  }
}

const COLUMNS =
  'content_type, slug, name, blurb, intro, icon, logo_data_url, tile, "group", tier, service_target, content_boundary'

/** Every custom category of one content type, for a category-picker UI or
 * a listing page that needs to enumerate custom categories alongside the
 * built-in ones. */
export async function getCustomCategories(
  contentType: CustomCategoryContentType,
): Promise<readonly CustomCategory[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('custom-categories')
  const { data, error } = await supabaseAnon
    .from('custom_categories')
    .select(COLUMNS)
    .eq('content_type', contentType)
    .order('name', { ascending: true })
  if (error) {
    console.error('getCustomCategories failed', error)
    return []
  }
  return data.map(rowToCategory)
}

/** One custom category by (contentType, slug) — the fallback lookup a
 * route's category resolution falls through to when the built-in list
 * doesn't recognise the slug. `undefined` for anything not found, exactly
 * like `getPromptCategory`/`getSkillCategory` already return for the
 * built-in list, so a caller can `??` the two together. */
export async function getCustomCategory(
  contentType: CustomCategoryContentType,
  slug: string,
): Promise<CustomCategory | undefined> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('custom-categories')
  const { data, error } = await supabaseAnon
    .from('custom_categories')
    .select(COLUMNS)
    .eq('content_type', contentType)
    .eq('slug', slug)
    .maybeSingle()
  if (error) {
    console.error('getCustomCategory failed', error)
    return undefined
  }
  return data ? rowToCategory(data) : undefined
}
