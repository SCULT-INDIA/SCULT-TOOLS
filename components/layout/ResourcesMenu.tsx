'use client'

import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'
import { RESOURCE_HREFS, RESOURCE_LINKS } from './resourceLinks'

const TILES = ['yellow', 'blue', 'lavender', 'green'] as const

const ITEMS: readonly DropdownTileItem[] = RESOURCE_LINKS.map((link, i) => ({
  slug: link.href,
  name: link.label,
  icon: link.icon,
  tile: TILES[i % TILES.length] ?? 'yellow',
  href: link.href,
}))

/** The "Resources" dropdown — the curated trust/reference pages, as a
 * tile grid. No top CTA: this is already the curated complete set (the
 * footer's own Resources column is the exhaustive index), so there is
 * nothing further to "browse all" of. */
export function ResourcesMenu() {
  return (
    <DropdownTileMenu
      label="Resources"
      activeMatch={(p) =>
        RESOURCE_HREFS.some((href) => p === href || p.startsWith(`${href}/`))
      }
      items={ITEMS}
    />
  )
}
