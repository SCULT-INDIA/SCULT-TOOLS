/**
 * The blog's type contract — a third sibling to `lib/tools/types.ts` and
 * `lib/guides/types.ts`, not an extension of either. Blog posts need one
 * thing neither of those support: an inline hyperlink in the middle of a
 * sentence (a keyword phrase linking straight to a tool, a prompt, or a
 * scult.in service). Guide.body is plain `string[]` on purpose — this file
 * exists so the blog can do more without changing that contract for guides.
 *
 * No markdown dependency is introduced here, matching the rest of this
 * codebase (see `lib/tools/types.ts`'s `SupportBlock`) — `Inline` is a small
 * closed shape instead: either a plain string, or a `{ text, href }` link
 * segment. A paragraph is an array of these, rendered in order.
 */

/** One segment of a paragraph: literal text, or a link over some text. */
export type Inline =
  | string
  | {
      readonly text: string
      readonly href: string
      /** true = an outbound scult.in/service/book-meeting link, rendered as a
       * plain `<a>` (the href is expected to already be built via
       * `parentLink()` so UTM attribution survives). Omitted/false = an
       * internal site route, rendered via next/link. */
      readonly external?: boolean
    }

export interface BlogSection {
  readonly heading: string
  /** Each paragraph is an array of segments — plain strings and inline
   * links, concatenated in order into one rendered `<p>`. */
  readonly body: readonly (readonly Inline[])[]
}

/**
 * What this post is fundamentally about — drives the index page's filter
 * chips and how related-post lookups are scoped. Not part of the URL.
 */
export type BlogPillar = 'tool' | 'prompt' | 'service' | 'roundup' | 'playbook'

export interface BlogPost {
  readonly slug: string
  readonly pillar: BlogPillar
  /** `<title>` text, before the site suffix — keyword-front-loaded. */
  readonly title: string
  /** The on-page H1 — phrased how a person would actually search for this. */
  readonly h1: string
  /** The primary search phrase this post is written for. Unique across the
   * catalogue — checked by registry.test.ts so no two posts cannibalize the
   * same term. */
  readonly targetKeyword: string
  /** Meta description. Hand-written, 71-200 chars, unique across the site. */
  readonly description: string
  /** The lead paragraph shown directly under the H1. */
  readonly dek: string
  /** The long-form body. At least 6 sections for a 3,000-word post. */
  readonly sections: readonly BlogSection[]
  /** Tool slugs this post links to / is related to. Must exist in
   * `lib/tools/registry.ts`. */
  readonly relatedTools: readonly string[]
  /** Prompt slugs this post links to / is related to. Prompt slugs are
   * globally unique, so no category is needed to resolve one. Must exist in
   * `lib/prompts/registry.ts`. */
  readonly relatedPrompts: readonly string[]
  /** Key into `lib/tools/service-links.ts`'s `SERVICE_PAGES` — drives the
   * closing CTA's service link. Optional: roundup/prompt posts sometimes
   * have no single best-fit service. */
  readonly serviceTarget?: string
  /** Real last-reviewed date, `'YYYY-MM-DD'`. Feeds sitemap `lastModified`
   * — never `new Date()`. */
  readonly updatedAt: string
  /** Honest estimate: roughly total words / 220, rounded up. */
  readonly readingMinutes: number
}
