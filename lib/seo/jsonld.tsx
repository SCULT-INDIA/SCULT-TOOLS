import type { Guide } from '@/lib/guides/types'
import type { Prompt, PromptCategory } from '@/lib/prompts/types'
import { absoluteUrl, SITE } from '@/lib/site'
import type { Category, Tool } from '@/lib/tools/types'

/**
 * JSON-LD builders.
 *
 * Every graph node that represents the company points at the PARENT's @id
 * (`https://scult.in/#organization`) rather than declaring a second organisation.
 * Subdomains are treated as related-but-distinct hosts, so without this the
 * authority this site earns would accrue to an orphan entity instead of Scult's
 * Knowledge Graph entry.
 */

const PUBLISHER = {
  '@type': 'Organization',
  '@id': `${SITE.parentUrl}/#organization`,
  name: SITE.parentName,
  url: SITE.parentUrl,
} as const

export function breadcrumbJsonLd(
  trail: readonly { name: string; path: string }[],
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function toolJsonLd(tool: Tool, category: Category): object {
  const url = absoluteUrl(`/${tool.category}/${tool.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: tool.title,
    url,
    description: tool.description,
    applicationCategory:
      tool.category === 'business' ? 'BusinessApplication' : 'UtilitiesApplication',
    applicationSubCategory: category.name,
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'INR',
    },
    publisher: PUBLISHER,
    inLanguage: SITE.locale,
    dateModified: tool.updatedAt,
  }
}

/**
 * The shared FAQPage builder both `faqJsonLd` (tool pages) and the site-wide
 * `/faq` page use. Marking up content the visitor cannot see is a structured-data
 * violation, so both callers only ever pass Q&A pairs that are actually rendered
 * on the same page.
 */
export function genericFaqJsonLd(
  items: readonly { readonly q: string; readonly a: string }[],
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

/**
 * FAQPage is emitted ONLY when the FAQ is actually visible on the page. Marking
 * up content the user cannot see is a structured-data violation, and every tool
 * page renders its FAQ, so the guard is a real invariant rather than decoration.
 */
export function faqJsonLd(tool: Tool): object | null {
  if (tool.faq.length === 0) return null
  return genericFaqJsonLd(tool.faq)
}

export function categoryJsonLd(category: Category, tools: readonly Tool[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(`/${category.slug}`)}#collection`,
    name: `${category.name} Tools`,
    description: category.intro,
    url: absoluteUrl(`/${category.slug}`),
    inLanguage: SITE.locale,
    publisher: PUBLISHER,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: tool.title,
        url: absoluteUrl(`/${tool.category}/${tool.slug}`),
      })),
    },
  }
}

/**
 * A prompt isn't an application — `SoftwareApplication` (toolJsonLd's type)
 * would be the wrong fit. `CreativeWork` is schema.org's generic content
 * type, which is exactly what a prompt is: authored content with a subject,
 * not a program. See docs/research/prompt-library.md §6.
 */
export function promptJsonLd(prompt: Prompt, category: PromptCategory): object {
  const url = absoluteUrl(`/prompts/${prompt.category}/${prompt.slug}`)
  const latestVerification = prompt.verifiedAgainst[0]
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#prompt`,
    name: prompt.title,
    url,
    description: prompt.description,
    about: category.name,
    keywords: prompt.tags.join(', '),
    isAccessibleForFree: true,
    publisher: PUBLISHER,
    inLanguage: SITE.locale,
    dateModified: prompt.changelog.at(-1)?.date ?? latestVerification?.date,
  }
}

export function promptCollectionJsonLd(
  category: PromptCategory,
  prompts: readonly Prompt[],
): object {
  const url = absoluteUrl(`/prompts/${category.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: `${category.name} Prompts`,
    description: category.intro,
    url,
    inLanguage: SITE.locale,
    publisher: PUBLISHER,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: prompts.length,
      itemListElement: prompts.map((prompt, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: prompt.title,
        url: absoluteUrl(`/prompts/${prompt.category}/${prompt.slug}`),
      })),
    },
  }
}

/**
 * A guide is authored editorial content, not a program or a prompt — `Article`
 * is the right schema.org type. No `author` field: there is no real named
 * author to attribute this to, and inventing one would be a fabricated
 * credential (see docs/PLAN.md §6.8 on the same principle for testimonials).
 * `publisher` follows the same rule as every other node here: it references
 * the PARENT's @id, never a second orphaned entity.
 */
export function guideJsonLd(guide: Guide): object {
  const url = absoluteUrl(`/guides/${guide.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: guide.title,
    url,
    description: guide.description,
    isAccessibleForFree: true,
    publisher: PUBLISHER,
    inLanguage: SITE.locale,
    dateModified: guide.updatedAt,
  }
}

/** Renders a JSON-LD script tag. Input is always our own static config. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
