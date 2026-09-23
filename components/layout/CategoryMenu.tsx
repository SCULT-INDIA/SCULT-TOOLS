'use client'

import { CATEGORIES } from '@/lib/tools/categories'
import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'

const ITEMS: readonly DropdownTileItem[] = CATEGORIES.map((c) => ({
  slug: c.slug,
  name: c.name,
  icon: c.icon,
  tile: c.tile,
  href: `/${c.slug}`,
}))

/** The "Tools" dropdown — the six tool categories as a tile grid, each
 * using its real category-page tile color, with "Browse all tools"
 * promoted to the panel's top CTA. */
export function CategoryMenu() {
  return (
    <DropdownTileMenu
      label="Tools"
      activeMatch={(p) => {
        const [firstSegment] = p.split('/').filter(Boolean)
        return CATEGORIES.some((c) => c.slug === firstSegment) || p === '/all'
      }}
      items={ITEMS}
      browseAllHref="/all"
      browseAllLabel="Browse all tools"
    />
  )
}
