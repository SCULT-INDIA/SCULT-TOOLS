import { cacheLife, cacheTag } from 'next/cache'
import { supabaseAnon } from '../supabase-anon'
import type { Prompt } from './types'

/**
 * The Prompts Library's FIRST-EVER database read path (2026-09-22).
 *
 * Every one of the 1,211 prompts that existed before this file was written
 * still lives entirely in the compile-time TypeScript registry
 * (lib/prompts/registry.ts) and is completely untouched by anything here —
 * this module exists ONLY to serve prompts published through the new
 * admin system (migration 0007's `prompts` table), as a fallback for a
 * slug the compiled registry doesn't recognise. See
 * app/prompts/[category]/[slug]/page.tsx for exactly where that fallback
 * is wired in.
 *
 * Migrating the existing 1,211 into this same table is deliberate,
 * separate, later work (per the approved plan) — not something this file
 * does implicitly. `getPrompt()` in lib/prompts/registry.ts stays the
 * compiled-registry-only lookup it always was; a route composes the two
 * (registry first, then this module) rather than either lookup silently
 * absorbing the other's job.
 *
 * Read-only, anon-key, RLS-gated to `status = 'published'` rows only
 * (migration 0007) — the same shape lib/skills/db.ts already uses for
 * `skills`. Writes go through lib/admin/prompts.ts's separate, elevated
 * connection, never through this client.
 */

const COLUMNS = `
  id, slug, category, title, description, prompt_text, variables,
  target_tools, tags, why_it_works, example_output, example_image,
  video_prompt, verified_against, changelog, service_target,
  related_tool_slug, author_name, published_at
`

// biome-ignore lint/suspicious/noExplicitAny: raw Supabase row, shape asserted by COLUMNS above
function rowToPrompt(row: any): Prompt {
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    description: row.description,
    promptText: row.prompt_text,
    variables: row.variables ?? [],
    targetTools: row.target_tools ?? [],
    tags: row.tags ?? [],
    whyItWorks: row.why_it_works,
    exampleOutput: row.example_output ?? undefined,
    exampleImage: row.example_image ?? undefined,
    videoPrompt: row.video_prompt ?? undefined,
    verifiedAgainst: row.verified_against ?? [],
    changelog: row.changelog ?? [],
    serviceTarget: row.service_target ?? undefined,
    relatedToolSlug: row.related_tool_slug ?? undefined,
  }
}

/** One admin-published prompt by (category, slug), or `undefined` if none
 * exists or it isn't published — never distinguishable from "doesn't
 * exist" to a caller, same as every not-found case elsewhere in this app. */
export async function getDbPrompt(
  category: string,
  slug: string,
): Promise<Prompt | undefined> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('prompts')
  const { data, error } = await supabaseAnon
    .from('prompts')
    .select(COLUMNS)
    .eq('category', category)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) {
    console.error('getDbPrompt failed', error)
    return undefined
  }
  return data ? rowToPrompt(data) : undefined
}

/** Every published admin prompt in a category — merged with the compiled
 * registry's own results by the category listing route, the same way a
 * skill category page merges static and on-demand rows. */
export async function getDbPromptsByCategory(
  category: string,
): Promise<readonly Prompt[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('prompts')
  const { data, error } = await supabaseAnon
    .from('prompts')
    .select(COLUMNS)
    .eq('category', category)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) {
    console.error('getDbPromptsByCategory failed', error)
    return []
  }
  return data.map(rowToPrompt)
}

/** Every published admin prompt, across all categories — used by the
 * sitemap and the hub page's total count. */
export async function getAllDbPrompts(): Promise<readonly Prompt[]> {
  'use cache'
  cacheLife('skillsRegistry')
  cacheTag('prompts')
  const { data, error } = await supabaseAnon
    .from('prompts')
    .select(COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) {
    console.error('getAllDbPrompts failed', error)
    return []
  }
  return data.map(rowToPrompt)
}
