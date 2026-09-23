import { getCustomCategory } from '../custom-categories'
import { getSkillCategory } from './categories'
import type { SkillCategory, SkillCategorySlug } from './types'

/**
 * `getSkillCategory`, falling back to an admin-created `custom_categories`
 * row when the built-in list doesn't recognise the slug — the
 * category-resolution half of admin-published skills, the other half being
 * `getSkill`'s own admin-aware OR-filter (lib/skills/db.ts). No
 * `seedQueries` on a custom category (nothing syncs skills.sh content for
 * an admin-defined taxonomy), so it's set empty.
 *
 * Deliberately its own file, not a function added to lib/skills/categories.ts
 * — see lib/prompts/category-resolver.ts's docblock for why: that file is
 * reachable from client components (SkillsMenu.tsx's dropdown reads
 * SKILL_CATEGORIES from it directly), and lib/custom-categories.ts's
 * `'use cache'` functions cannot be reached from a Client Component's
 * bundle graph even through a dynamic `import()` — Turbopack still traces
 * it statically and fails the whole build.
 */
export async function getSkillCategoryOrCustom(
  slug: string,
): Promise<SkillCategory | undefined> {
  const builtin = getSkillCategory(slug)
  if (builtin) return builtin
  const custom = await getCustomCategory('skill', slug)
  if (!custom) return undefined
  return {
    slug: custom.slug as SkillCategorySlug,
    name: custom.name,
    blurb: custom.blurb,
    intro: custom.intro,
    icon: custom.icon,
    logoDataUrl: custom.logoDataUrl,
    tile: custom.tile,
    seedQueries: [],
  }
}
