import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

/**
 * slug -> interactive component.
 *
 * Every tool is lazily imported, so a visitor on the JSON formatter never
 * downloads the invoice generator's code. The shared shell stays constant and
 * each route pays only for its own tool.
 *
 * `ssr: true` is deliberate — tool markup is server-rendered so the page is
 * complete and crawlable before hydration; only the interactivity waits.
 *
 * This map must cover exactly the approved 15 tools — the registry test fails
 * the build on any mismatch in either direction.
 */
const TOOL_COMPONENTS: Record<string, ComponentType> = {
  // SEO
  'schema-markup-generator': dynamic(() =>
    import('./SchemaMarkupGenerator').then((m) => m.SchemaMarkupGenerator),
  ),
  'faq-schema-generator': dynamic(() =>
    import('./FaqSchemaGenerator').then((m) => m.FaqSchemaGenerator),
  ),
  'utm-builder': dynamic(() => import('./UtmBuilder').then((m) => m.UtmBuilder)),
  'marketing-roi-calculator': dynamic(() =>
    import('./MarketingRoiCalculator').then((m) => m.MarketingRoiCalculator),
  ),
  'website-speed-test': dynamic(() =>
    import('./WebsiteSpeedTest').then((m) => m.WebsiteSpeedTest),
  ),
  // Business
  'invoice-generator': dynamic(() =>
    import('./InvoiceGenerator').then((m) => m.InvoiceGenerator),
  ),
  'business-name-generator': dynamic(() =>
    import('./BusinessNameGenerator').then((m) => m.BusinessNameGenerator),
  ),
  'slogan-generator': dynamic(() =>
    import('./SloganGenerator').then((m) => m.SloganGenerator),
  ),
  'email-signature-generator': dynamic(() =>
    import('./EmailSignatureGenerator').then((m) => m.EmailSignatureGenerator),
  ),
  // Developer
  'json-formatter': dynamic(() => import('./JsonFormatter').then((m) => m.JsonFormatter)),
  'qr-code-generator': dynamic(() =>
    import('./QrCodeGenerator').then((m) => m.QrCodeGenerator),
  ),
  'favicon-generator': dynamic(() =>
    import('./FaviconGenerator').then((m) => m.FaviconGenerator),
  ),
  // Productivity
  'word-counter': dynamic(() => import('./WordCounter').then((m) => m.WordCounter)),
  // Design
  'color-palette-generator': dynamic(() =>
    import('./ColorPaletteGenerator').then((m) => m.ColorPaletteGenerator),
  ),
  // GEO / AEO
  'ai-visibility-checker': dynamic(() =>
    import('./AiVisibilityChecker').then((m) => m.AiVisibilityChecker),
  ),
}

export function getToolComponent(slug: string): ComponentType | undefined {
  return TOOL_COMPONENTS[slug]
}

export function hasToolComponent(slug: string): boolean {
  return slug in TOOL_COMPONENTS
}

export const IMPLEMENTED_TOOL_SLUGS = Object.keys(TOOL_COMPONENTS)
