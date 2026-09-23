'use client'

import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'

/** First 8 of 24 categories, in the registry's own curated order — same
 * restraint as before: "Browse all skills" covers the rest, now as the
 * panel's prominent top CTA rather than a small footer row. */
const FEATURED = SKILL_CATEGORIES.slice(0, 8)

const ITEMS: readonly DropdownTileItem[] = FEATURED.map((category) => ({
  slug: category.slug,
  name: category.name,
  icon: category.icon,
  tile: category.tile,
  href: `/skills/${category.slug}`,
}))

/** The "Skills" dropdown — a curated slice of the Skills Library's 24
 * categories as a tile grid, with "Browse all skills" promoted to the
 * panel's top CTA. */
export function SkillsMenu() {
  return (
    <DropdownTileMenu
      label="Skills"
      activeMatch={(p) => p === '/skills' || p.startsWith('/skills/')}
      items={ITEMS}
      browseAllHref="/skills"
      browseAllLabel="Browse all skills"
    />
  )
}
