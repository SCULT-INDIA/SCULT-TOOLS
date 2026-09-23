'use client'

import { BLOG_NAV_LINKS } from './blogNavLinks'
import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'

const TILES = ['green', 'blue', 'lavender', 'yellow'] as const

const ITEMS: readonly DropdownTileItem[] = BLOG_NAV_LINKS.map((link, i) => ({
  slug: link.href,
  name: link.label,
  icon: link.icon,
  tile: TILES[i % TILES.length] ?? 'green',
  href: link.href,
  external: link.external,
}))

/** The "Blogs" dropdown — this site's editorial content plus a link out to
 * scult.in's own case-study portfolio, as a tile grid, with "Browse the
 * blog" promoted to the panel's top CTA. */
export function BlogsMenu() {
  return (
    <DropdownTileMenu
      label="Blogs"
      activeMatch={(p) => p === '/blog'}
      items={ITEMS}
      browseAllHref="/blog"
      browseAllLabel="Browse the blog"
    />
  )
}
