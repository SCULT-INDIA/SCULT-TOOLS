import { getCustomCategory } from '../custom-categories'
import { getPromptCategory } from './categories'
import type {
  PromptCategory,
  PromptCategorySlug,
  PromptGroupSlug,
  PromptTier,
} from './types'

/**
 * `getPromptCategory`, falling back to an admin-created `custom_categories`
 * row (lib/custom-categories.ts) when the built-in list doesn't recognise
 * the slug — the category-resolution half of admin-published prompts, the
 * other half being lib/prompts/db.ts's `getDbPrompt`/`getDbPromptsByCategory`.
 *
 * Deliberately its own file, not a function added to lib/prompts/categories.ts:
 * that file is imported by client components (e.g. the admin PromptForm,
 * for PROMPT_CATEGORIES's plain array), and lib/custom-categories.ts's
 * `'use cache'` functions cannot be reached from a Client Component's
 * bundle graph even through a dynamic `import()` — Turbopack still traces
 * it statically and fails the whole build. This file is imported only by
 * Server Components (the prompt category/detail routes), so it is safe for
 * it, and only it, to import lib/custom-categories.ts directly.
 *
 * A custom category's `group`/`tier` are cast the same way
 * `getPromptCategory` already casts `slug` — both are plain strings at
 * runtime, narrowed only for the built-in list's own type safety, and this
 * route boundary only ever displays these fields rather than switching on
 * the closed union.
 */
export async function getPromptCategoryOrCustom(
  slug: string,
): Promise<PromptCategory | undefined> {
  const builtin = getPromptCategory(slug)
  if (builtin) return builtin
  const custom = await getCustomCategory('prompt', slug)
  if (!custom) return undefined
  return {
    slug: custom.slug as PromptCategorySlug,
    group: (custom.group ?? 'development') as PromptGroupSlug,
    name: custom.name,
    blurb: custom.blurb,
    intro: custom.intro,
    tier: (custom.tier ?? 3) as PromptTier,
    tile: custom.tile,
    icon: custom.icon,
    logoDataUrl: custom.logoDataUrl,
    serviceTarget: custom.serviceTarget,
    contentBoundary: custom.contentBoundary,
  }
}
