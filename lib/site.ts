/**
 * Site-wide configuration. Everything reads from here rather than hard-coding
 * URLs, so a domain change is one edit.
 */

export const SITE = {
  name: 'Scult Tools',
  host: 'tools.scult.in',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tools.scult.in',
  parentUrl: process.env.NEXT_PUBLIC_PARENT_URL ?? 'https://scult.in',
  parentName: 'Scult',
  tagline: 'Free tools, prompts and skills for real work',
  description:
    'Free online tools plus a verified AI prompt library — SEO, business, developer and design utilities, and copy-paste prompts for ChatGPT, Claude, Cursor, Midjourney and more. Built by Scult, an AI-first digital agency.',
  locale: 'en-IN',
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
  /**
   * Microsoft Clarity project ID — heatmaps and session replay, answering the
   * question GA4 structurally cannot: not "how many people clicked" but "where
   * did they get stuck". Left empty in any environment that doesn't set it, so
   * local dev and previews never pollute the production recordings.
   */
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',
  /**
   * SCULT Studio (studio.scult.in) site identifier for its tracking snippet
   * (`components/layout/DeferredAnalyticsScripts.tsx`) — same "leave empty
   * outside production" reasoning as `clarityId` above: every environment
   * that sets this sends real traffic data into Studio, and dev/preview
   * sessions would pollute it.
   */
  studioSiteId: process.env.NEXT_PUBLIC_STUDIO_SITE ?? '',
  /** Injected at build time by next.config.ts — see the note there. */
  buildYear: process.env.NEXT_PUBLIC_BUILD_YEAR ?? '2026',
} as const

/**
 * Every outbound link to the parent site is tagged from here, so attribution can
 * never be forgotten. This is what lets the CRM answer "which tool produced this
 * client" — the only question that decides whether the subdomain earns a second
 * year of investment.
 */
export function parentLink(path = '/', toolSlug?: string): string {
  const url = new URL(path, SITE.parentUrl)
  url.searchParams.set('utm_source', SITE.host)
  url.searchParams.set('utm_medium', 'tool')
  url.searchParams.set('utm_campaign', toolSlug ?? 'hub')
  return url.toString()
}

/** Absolute URL for canonicals, JSON-LD and sitemap entries. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE.url).toString()
}

/**
 * Human-readable "last updated" date for visible freshness lines (tool
 * pages, how-it-works pages) — e.g. "Jul 28" this year, "Jul 28, 2025" once
 * the year has rolled over. `/faq` promises visitors can "judge how current"
 * a tool is from its own page; this is what makes that claim true rather
 * than something only JSON-LD's invisible `dateModified` could back up.
 */
export function formatUpdatedDate(iso: string): string {
  const then = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  // Compared against the build-time year (see SITE.buildYear above), not
  // `new Date()` — these pages are statically prerendered, and Next's Cache
  // Components forbids reading the current time in a Server Component
  // before any uncached/request data access. `buildYear` is this codebase's
  // existing pattern for exactly that constraint.
  if (String(then.getFullYear()) !== SITE.buildYear) opts.year = 'numeric'
  return new Intl.DateTimeFormat('en-US', opts).format(then)
}
