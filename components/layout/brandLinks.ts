/**
 * Shared data for the "Our Brands" nav dropdown — the desktop menu
 * (`OurBrandsMenu.tsx`) and the mobile drawer (`MobileDrawer.tsx`) render
 * the same set from here, same reasoning as `resourceLinks.ts`.
 *
 * Deliberately named "Our Brands" — the exact label scult.in's own nav
 * already uses for the reverse direction (scult.in → Scult Tools). Reusing
 * it here keeps the term consistent across both sites rather than
 * inventing a different name for the same concept.
 */
export interface BrandLink {
  readonly href: string
  readonly label: string
  readonly blurb: string
  readonly icon: string
}

export const BRAND_LINKS: readonly BrandLink[] = [
  {
    href: 'https://scult.in',
    label: 'Scult',
    blurb: 'The AI-first digital agency behind these tools',
    icon: 'Sparkles',
  },
  {
    href: 'https://marketing.scult.in',
    label: 'Scult Marketing',
    blurb: 'Influencer marketing execution partner',
    icon: 'TrendingUp',
  },
]
