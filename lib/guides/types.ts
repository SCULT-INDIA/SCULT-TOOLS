/**
 * The guide registry's type contract.
 *
 * Purpose
 *   Guides are the editorial layer: longer explanatory content that a tool page's
 *   own `howItWorks`/`faq` fields are too short to carry, but that still has to
 *   stay honest and tool-accurate. One typed entry per guide drives its route,
 *   metadata, JSON-LD and the `/guides` index — the same registry shape as
 *   `lib/tools/types.ts`, deliberately, so a guide is one `meta.ts` file, not a
 *   hand-maintained page.
 *
 * Failure modes
 *   A guide whose `relatedTools` references a slug that no longer exists in
 *   `lib/tools/registry.ts` — guarded by `lib/guides/registry.test.ts`.
 */

export interface GuideSection {
  readonly heading: string
  /** One or more paragraphs, rendered as separate `<p>` tags. Plain text — no markup. */
  readonly body: readonly string[]
}

export interface Guide {
  readonly slug: string
  /** `<title>` text, before the site suffix. */
  readonly title: string
  /** The on-page H1 — phrased how a person would actually search for this. */
  readonly h1: string
  /** Meta description. Hand-written, 71–200 chars, unique across the site. */
  readonly description: string
  /** The lead paragraph shown directly under the H1. */
  readonly dek: string
  /** At least 3 sections. The real explanatory body of the guide. */
  readonly sections: readonly GuideSection[]
  /** Tool slugs this guide should link to. Must exist in `lib/tools/registry.ts`. */
  readonly relatedTools: readonly string[]
  /** Real last-reviewed date, `'YYYY-MM-DD'`. Feeds sitemap `lastModified` — never `new Date()`. */
  readonly updatedAt: string
  /** Honest estimate: roughly total words / 200, rounded up. */
  readonly readingMinutes: number
}
