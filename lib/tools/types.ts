/**
 * The tool registry's type contract.
 *
 * Purpose
 *   One typed entry per tool drives routing, `/all`, category pages, the search
 *   index, metadata, JSON-LD, sitemaps and the internal-link graph. Adding a tool
 *   is one registry entry plus one logic file plus one component — never seven
 *   scattered edits.
 *
 * Failure modes
 *   Slug collisions and orphaned tools are the two that bite. Both are caught by
 *   `lib/tools/registry.test.ts` at build time rather than in production.
 */

/**
 * The six top-level categories. Slugs live at the site root, e.g. `/seo`.
 *
 * This union is the approved category structure — SEO, Business, Developer,
 * Productivity, Design, GEO/AEO — and nothing else. Adding a member here without
 * an approved tool list to fill it is a product decision, not a code change.
 */
export type CategorySlug = 'seo' | 'business' | 'dev' | 'productivity' | 'design' | 'geo'

/**
 * Where a tool's work happens. This is deliberately part of the type system so
 * the catalogue's cost profile is inspectable in code rather than tribal
 * knowledge: `client` costs nothing forever, everything else is a line item.
 */
export type Runtime = 'client' | 'server' | 'external-api' | 'llm'

/**
 * How a completed use of this tool should be treated commercially.
 *   A — sales-qualified, route within 24h
 *   B — marketing-qualified, nurture
 *   C — traffic and authority only; converts at ~zero, and that is the expected
 *       outcome. Never reported on the same dashboard row as leads.
 */
export type LeadTier = 'A' | 'B' | 'C'

/** Which launch wave a tool belongs to. Wave 1 is the MVP. */
export type Wave = 1 | 2 | 3

export interface Category {
  readonly slug: CategorySlug
  /** Display name, e.g. "SEO & Content". */
  readonly name: string
  /** Short label for chips and breadcrumbs. */
  readonly shortName: string
  /** One sentence explaining when you'd reach for these tools. */
  readonly blurb: string
  /** Longer intro used as the category page's opening copy. */
  readonly intro: string
  /** Pastel tile fill token, used on the category grid. */
  readonly tile: 'yellow' | 'blue' | 'lavender' | 'green'
  /** Lucide icon name, resolved in `components/ui/Icon.tsx`. */
  readonly icon: string
}

export interface Tool {
  readonly slug: string
  readonly category: CategorySlug
  /** `<title>` text, before the site suffix. */
  readonly title: string
  /** The on-page H1 — phrased how a person would actually type it. */
  readonly h1: string
  /** Meta description. Hand-written per tool; never templated. */
  readonly description: string
  /** One-line "what this does", shown directly under the H1. */
  readonly tagline: string
  readonly keywords: readonly string[]
  /** Curated related tools. The build computes reverse edges from these. */
  readonly related: readonly string[]
  /** Set when this tool is a preset variant of another. */
  readonly variantOf?: string
  readonly wave: Wave
  readonly runtime: Runtime
  /**
   * Rupees per month this tool is allowed to cost. `0` for client-side tools,
   * which is most of them. A non-zero value is a commitment someone signs up for.
   */
  readonly monthlyCostCeiling: number
  readonly leadTier: LeadTier
  /** Which paid service a converted visitor should land on. */
  readonly serviceTarget?: string
  /** Real last-reviewed date. Feeds sitemap `lastModified` — never `new Date()`. */
  readonly updatedAt: string
  /** Who owns this tool. Makes the quarterly pruning policy executable. */
  readonly owner: string
  readonly icon: string
  /** True when the tool never sends user data anywhere. Drives the privacy badge. */
  readonly runsInBrowser: boolean
  /** 3-5 steps, rendered as "How to use". */
  readonly howToUse: readonly string[]
  /** The real explanation — formula, algorithm, standard. Where E-E-A-T is earned. */
  readonly howItWorks: string
  /** Stated plainly. Honesty here is a ranking asset, not a liability. */
  readonly limitations: readonly string[]
  readonly faq: readonly { readonly q: string; readonly a: string }[]
  /** India-only tools say so, which improves relevance for the right audience. */
  readonly indiaOnly?: boolean
  /**
   * Optional deeper support content for the how-it-works page — examples,
   * formulas, cheat sheets, checklists — rendered between "What it doesn't
   * do" and "Frequently asked". A small closed set of block types rather
   * than markdown: every shape this content actually needs (code, tables,
   * lists, prose) is covered here without adding a markdown-rendering
   * dependency for four block shapes.
   */
  readonly supportContent?: readonly SupportSection[]
}

/** One block of a support section. A closed set, not markdown, so the
 * renderer stays a simple typed switch — see `Tool.supportContent`. */
export type SupportBlock =
  | { readonly type: 'prose'; readonly paragraphs: readonly string[] }
  | {
      readonly type: 'code'
      readonly intro?: string
      readonly snippets: readonly {
        readonly label: string
        readonly lang: string
        readonly code: string
        readonly note?: string
      }[]
    }
  | { readonly type: 'list'; readonly intro?: string; readonly items: readonly string[] }
  | {
      readonly type: 'table'
      readonly columns: readonly string[]
      readonly rows: readonly (readonly string[])[]
    }

export interface SupportSection {
  readonly heading: string
  readonly blocks: readonly SupportBlock[]
}

/** Slugs that may never be used by a category or tool, because routes own them. */
export const RESERVED_SLUGS: readonly string[] = [
  'about',
  'privacy',
  'terms',
  'guides',
  'collections',
  'search',
  'all',
  'api',
  'sitemap',
  'robots',
  'opengraph-image',
  '_next',
  // The Prompt Library (lib/prompts/) — a deliberately separate registry,
  // see docs/research/prompt-library.md §6. Reserved here so a future tool
  // or category can never collide with /prompts.
  'prompts',
  // The 2026-08 trust/GEO-AEO page build-out. Same reasoning as the block
  // above: these are top-level routes, not tools, and must never collide
  // with a future category or tool slug.
  'faq',
  'contact',
  'security',
  'accessibility',
  'changelog',
  'roadmap',
  'brand',
  'glossary',
]
