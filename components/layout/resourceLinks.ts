/**
 * Shared data for the "Resources" nav dropdown — the desktop mega-menu
 * (`ResourcesMenu.tsx`) and the mobile drawer (`MobileDrawer.tsx`) render
 * the same set from here rather than each hand-maintaining its own copy,
 * so the two surfaces cannot drift apart.
 *
 * Real, existing pages only — the footer's own "Resources" column is the
 * exhaustive index; this is the curated subset worth a click from the nav,
 * same restraint as CategoryMenu limiting itself to top-level categories
 * rather than every tool.
 *
 * Flat, not grouped: scult.in's own nav dropdowns (Company, Services) are
 * each one flat list, not sub-headed columns — this mirrors that structure.
 *
 * Blog lives in the "Explore" mega-menu's Content column instead of here —
 * see `exploreLinks.ts` — so it isn't duplicated across two dropdowns.
 */
export interface ResourceLink {
  readonly href: string
  readonly label: string
  readonly blurb: string
  readonly icon: string
}

export const RESOURCE_LINKS: readonly ResourceLink[] = [
  {
    href: '/guides',
    label: 'Guides',
    blurb: 'AI visibility, structured data, invoicing',
    icon: 'BookOpen',
  },
  {
    href: '/glossary',
    label: 'Glossary',
    blurb: 'Plain-English SEO, GEO & AEO terms',
    icon: 'Type',
  },
  {
    href: '/collections',
    label: 'Collections',
    blurb: 'Curated tool bundles by task',
    icon: 'Layers',
  },
  {
    href: '/roadmap',
    label: 'Roadmap',
    blurb: "What's live, what's next",
    icon: 'MapIcon',
  },
  {
    href: '/changelog',
    label: 'Changelog',
    blurb: 'What changed, and when',
    icon: 'History',
  },
  {
    href: '/about',
    label: 'About',
    blurb: 'Who builds these tools, and why',
    icon: 'Users',
  },
  {
    href: '/contact',
    label: 'Contact',
    blurb: 'Report a bug, or ask about client work',
    icon: 'Mail',
  },
]

export const RESOURCE_HREFS: readonly string[] = RESOURCE_LINKS.map((l) => l.href)
