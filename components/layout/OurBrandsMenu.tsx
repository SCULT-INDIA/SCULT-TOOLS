'use client'

import { BRAND_LINKS } from './brandLinks'
import { type DropdownTileItem, DropdownTileMenu } from './DropdownTileMenu'

const TILES = ['blue', 'green'] as const

const ITEMS: readonly DropdownTileItem[] = BRAND_LINKS.map((brand, i) => ({
  slug: brand.href,
  name: brand.label,
  icon: brand.icon,
  tile: TILES[i % TILES.length] ?? 'blue',
  href: brand.href,
  external: true,
}))

/** The "Our Brands" dropdown — the two sibling Scult properties, as a
 * tile grid. No top CTA: this list is already the complete set, so there
 * is nothing further to "browse all" of. */
export function OurBrandsMenu() {
  return <DropdownTileMenu label="Our Brands" activeMatch={() => false} items={ITEMS} />
}
