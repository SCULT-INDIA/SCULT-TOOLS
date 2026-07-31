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
 * FAQPage is emitted ONLY when the FAQ is actually visible on the page. Marking
 * up content the user cannot see is a structured-data violation, and every tool
 * page renders its FAQ, so the guard is a real invariant rather than decoration.
 */
export function faqJsonLd(tool: Tool): object | null {
  if (tool.faq.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
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

/** Renders a JSON-LD script tag. Input is always our own static config. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
