import type { Category } from './types'

/**
 * The six approved categories. Order here is the order shown on the hub, in the
 * nav and in the footer, so it is editorial: SEO leads because it carries the
 * highest-intent search traffic, and GEO/AEO closes because it is the
 * differentiator no competitor hub has yet.
 */
export const CATEGORIES: readonly Category[] = [
  {
    slug: 'seo',
    name: 'SEO',
    shortName: 'SEO',
    blurb: 'Schema, UTMs, ROI and a real speed test.',
    intro:
      'The tools you reach for when a page is written but not yet ready to ship — structured data that validates, campaign links that stay consistent, and a speed test that returns a verdict instead of a bare score.',
    tile: 'green',
    icon: 'Search',
  },
  {
    slug: 'business',
    name: 'Business',
    shortName: 'Business',
    blurb: 'Invoices, names, slogans and signatures.',
    intro:
      'The paperwork and identity work every small business repeats: a clean invoice in minutes, a name that is actually available to brand, a slogan that does not sound generated, and an email signature that survives Outlook.',
    tile: 'yellow',
    icon: 'Briefcase',
  },
  {
    slug: 'dev',
    name: 'Developer',
    shortName: 'Developer',
    blurb: 'Format, encode, generate. Nothing leaves the tab.',
    intro:
      'The small utilities you open twenty times a day. All of them run locally, which matters more than usual here — pasting a payload or shipping an icon should never involve someone else’s server.',
    tile: 'blue',
    icon: 'Code',
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    shortName: 'Productivity',
    blurb: 'Count it, read it, tighten it.',
    intro:
      'Writing utilities that give you the numbers editors actually use — words, characters, sentences, reading time and keyword density — live, as you type, without sending your draft anywhere.',
    tile: 'lavender',
    icon: 'Timer',
  },
  {
    slug: 'design',
    name: 'Design',
    shortName: 'Design',
    blurb: 'Palettes with contrast built in.',
    intro:
      'Colour tooling with accessibility built in rather than bolted on. Every palette this section produces is checked against WCAG before it reaches a designer, let alone a user.',
    tile: 'lavender',
    icon: 'Palette',
  },
  {
    slug: 'geo',
    name: 'GEO / AEO',
    shortName: 'AI Visibility',
    blurb: 'Find out if AI search can see you at all.',
    intro:
      'Generative engines are becoming a real acquisition channel, and most sites have never checked whether AI crawlers can even read them. These tools audit your visibility to ChatGPT, Claude, Perplexity and Google’s AI surfaces.',
    tile: 'green',
    icon: 'Radar',
  },
]

export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]))

export function getCategory(slug: string): Category | undefined {
  return CATEGORY_BY_SLUG.get(slug as Category['slug'])
}
