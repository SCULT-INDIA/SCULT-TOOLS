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
  tagline: 'Free tools that do the boring work for you',
  description:
    'Free online tools for SEO, business, developers, writing, design and AI visibility — built by Scult, an AI-first digital agency. Most run entirely in your browser.',
  locale: 'en-IN',
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
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
