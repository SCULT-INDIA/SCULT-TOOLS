import { meta as aiVisibilityChecker } from './ai-visibility-checker/meta'
import { meta as businessNameGenerator } from './business-name-generator/meta'
import { CATEGORIES } from './categories'
import { meta as colorPaletteGenerator } from './color-palette-generator/meta'
import { meta as emailSignatureGenerator } from './email-signature-generator/meta'
import { meta as faqSchemaGenerator } from './faq-schema-generator/meta'
import { meta as faviconGenerator } from './favicon-generator/meta'
import { meta as invoiceGenerator } from './invoice-generator/meta'
import { meta as jsonFormatter } from './json-formatter/meta'
import { meta as marketingRoiCalculator } from './marketing-roi-calculator/meta'
import { meta as qrCodeGenerator } from './qr-code-generator/meta'
import { meta as schemaMarkupGenerator } from './schema-markup-generator/meta'
import { meta as sloganGenerator } from './slogan-generator/meta'
import { type CategorySlug, RESERVED_SLUGS, type Tool } from './types'
import { meta as utmBuilder } from './utm-builder/meta'
import { meta as websiteSpeedTest } from './website-speed-test/meta'
import { meta as wordCounter } from './word-counter/meta'

/**
 * THE source of truth for the catalogue.
 *
 * This is the complete approved tool list — exactly fifteen tools across six
 * categories. It is a product decision, not a code convenience: adding an entry
 * here without product approval is out of scope by definition, and the registry
 * test suite treats an unexpected count as a failure.
 *
 * Each tool's content (title, description, FAQ, related links…) lives in its own
 * `lib/tools/<slug>/meta.ts`, so tools can be authored independently. This file
 * only assembles and orders them. Everything downstream — routes, /all, category
 * pages, the search index, metadata, JSON-LD, sitemap and the internal link
 * graph — derives from this array.
 */
export const TOOLS: readonly Tool[] = [
  // SEO
  schemaMarkupGenerator,
  faqSchemaGenerator,
  utmBuilder,
  marketingRoiCalculator,
  websiteSpeedTest,
  // Business
  invoiceGenerator,
  businessNameGenerator,
  sloganGenerator,
  emailSignatureGenerator,
  // Developer
  jsonFormatter,
  qrCodeGenerator,
  faviconGenerator,
  // Productivity
  wordCounter,
  // Design
  colorPaletteGenerator,
  // GEO / AEO
  aiVisibilityChecker,
]

/** The approved catalogue size. The registry test fails on any other number. */
export const APPROVED_TOOL_COUNT = 15

// ---------------------------------------------------------------------------
// Derived indexes. Everything downstream reads these rather than filtering the
// array repeatedly.
// ---------------------------------------------------------------------------

export const TOOL_BY_SLUG: ReadonlyMap<string, Tool> = new Map(
  TOOLS.map((t) => [t.slug, t]),
)

export function getTool(slug: string): Tool | undefined {
  return TOOL_BY_SLUG.get(slug)
}

export function getToolsByCategory(category: CategorySlug): readonly Tool[] {
  return TOOLS.filter((t) => t.category === category)
}

export function getToolCount(category: CategorySlug): number {
  return getToolsByCategory(category).length
}

/**
 * Reverse edges of the curated `related` graph. A tool's inbound links are what
 * make it discoverable; computing them means a one-way `related` entry still
 * produces a bidirectional relationship.
 */
export function buildInboundMap(): ReadonlyMap<string, readonly string[]> {
  const inbound = new Map<string, string[]>()
  for (const tool of TOOLS) inbound.set(tool.slug, [])
  for (const tool of TOOLS) {
    for (const target of tool.related) {
      inbound.get(target)?.push(tool.slug)
    }
  }
  return inbound
}

/** Tools that link *to* the given slug, used to render "also used with". */
export function getInboundTools(slug: string): readonly Tool[] {
  return TOOLS.filter((t) => t.related.includes(slug))
}

/** Every slug the router will serve, for collision testing. */
export function allRoutableSlugs(): readonly string[] {
  return [...CATEGORIES.map((c) => c.slug), ...TOOLS.map((t) => t.slug)]
}

export { CATEGORIES, RESERVED_SLUGS }
