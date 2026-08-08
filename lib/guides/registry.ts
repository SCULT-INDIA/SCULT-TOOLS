import { meta as aiSearchVisibilityChecklist } from './ai-search-visibility-checklist/meta'
import { meta as invoiceEssentialsForIndianFreelancers } from './invoice-essentials-for-indian-freelancers/meta'
import { meta as jsonLdStructuredDataBasics } from './json-ld-structured-data-basics/meta'
import type { Guide } from './types'

/**
 * THE source of truth for the guide catalogue — the same aggregator pattern as
 * `lib/tools/registry.ts`. Each guide's content lives in its own
 * `lib/guides/<slug>/meta.ts`, authored independently; this file only
 * assembles and orders them. `/guides`, `/guides/[slug]` and the sitemap all
 * derive from this array.
 */
export const GUIDES: readonly Guide[] = [
  aiSearchVisibilityChecklist,
  jsonLdStructuredDataBasics,
  invoiceEssentialsForIndianFreelancers,
]

export const GUIDE_BY_SLUG: ReadonlyMap<string, Guide> = new Map(
  GUIDES.map((g) => [g.slug, g]),
)

export function getGuide(slug: string): Guide | undefined {
  return GUIDE_BY_SLUG.get(slug)
}
