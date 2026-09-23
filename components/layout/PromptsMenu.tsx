'use client'

import { PROMPT_GROUPS } from '@/lib/prompts/categories'
import type { PromptGroupSlug } from '@/lib/prompts/types'
import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'

/** `PromptGroup` (unlike `PromptCategory`) carries no icon or tile color of
 * its own — groups only exist for the hub page and this menu, so both
 * mappings live here rather than growing the registry's own type for one
 * caller. Tile colors just cycle through the same four pastels the
 * category pages use — decorative variety, not a meaningful classification. */
const GROUP_ICON: Record<PromptGroupSlug, string> = {
  'ai-models': 'Bot',
  development: 'Code',
  marketing: 'TrendingUp',
  design: 'Palette',
  business: 'Briefcase',
  content: 'PenTool',
  education: 'GraduationCap',
  'image-ai': 'ImageIcon',
  'video-ai': 'Video',
}

const TILES = ['yellow', 'blue', 'lavender', 'green'] as const

const ITEMS: readonly DropdownTileItem[] = PROMPT_GROUPS.map((group, i) => ({
  slug: group.slug,
  name: group.name,
  icon: GROUP_ICON[group.slug],
  tile: TILES[i % TILES.length] ?? 'yellow',
  href: `/prompts#${group.slug}`,
}))

/** The "Prompts" dropdown — the library's 9 top-level groups as a tile
 * grid, each linking to its real `#slug` section on `/prompts`, with
 * "Browse all prompts" promoted to the panel's top CTA. */
export function PromptsMenu() {
  return (
    <DropdownTileMenu
      label="Prompts"
      activeMatch={(p) => p === '/prompts' || p.startsWith('/prompts/')}
      items={ITEMS}
      browseAllHref="/prompts"
      browseAllLabel="Browse all prompts"
    />
  )
}
