/**
 * The Prompt Library's type contract — a deliberate sibling to
 * `lib/tools/types.ts`, not an extension of it. Prompts live in their own
 * parallel registry (`lib/prompts/`) precisely so `registry.test.ts`'s
 * "exactly 15 tools, 6 categories" gate (docs/PLAN.md, AGENT_CONVENTIONS.md)
 * never has to know this exists — see docs/research/prompt-library.md §6.
 */

/**
 * The nine top-level groups of the tool-first taxonomy (2026-08 restructure,
 * per the user's demand research — see docs/research/prompt-library.md §10).
 * Groups are a display/organization layer only: they never appear in URLs,
 * which stay flat (`/prompts/<category>/<slug>`) because "cursor prompts"
 * is what people search, not "ai models cursor prompts".
 */
export type PromptGroupSlug =
  | 'ai-models'
  | 'development'
  | 'marketing'
  | 'design'
  | 'business'
  | 'content'
  | 'education'
  | 'image-ai'
  | 'video-ai'

export interface PromptGroup {
  readonly slug: PromptGroupSlug
  readonly name: string
  readonly blurb: string
}

/**
 * The tool-first category union, grouped by PromptGroupSlug. Closed union:
 * adding a category is a product decision informed by the demand research in
 * docs/research/prompt-library.md, not a casual code change.
 */
export type PromptCategorySlug =
  // ai-models
  | 'chatgpt'
  | 'claude'
  | 'claude-code'
  | 'cursor'
  | 'github-copilot'
  | 'gemini'
  | 'perplexity'
  | 'grok'
  | 'ai-companions'
  // development
  | 'ai-engineering'
  | 'react'
  | 'nextjs'
  | 'python'
  | 'devops'
  | 'no-code-apps'
  // marketing
  | 'seo-geo'
  | 'ads'
  | 'email-marketing'
  | 'sales'
  | 'linkedin'
  // design
  | 'figma'
  | 'framer'
  | 'ui-design'
  | 'branding'
  | 'presentations'
  // business
  | 'startup'
  | 'finance'
  | 'consulting'
  | 'business-ops'
  // content
  | 'youtube'
  | 'instagram'
  | 'x-twitter'
  | 'blog-writing'
  | 'writing'
  // education
  | 'students'
  | 'research'
  | 'exam-prep'
  // image-ai
  | 'midjourney'
  | 'nano-banana'
  | 'flux'
  | 'ideogram'
  | 'dalle'
  // video-ai
  | 'veo'
  | 'kling'
  | 'runway'
  | 'ai-audio'

/** Which CTA intensity a category's prompts should carry — see §4/§8. */
export type PromptTier = 1 | 2 | 3

export interface PromptCategory {
  readonly slug: PromptCategorySlug
  readonly group: PromptGroupSlug
  readonly name: string
  readonly blurb: string
  readonly intro: string
  readonly tier: PromptTier
  readonly tile: 'yellow' | 'blue' | 'lavender' | 'green'
  readonly icon: string
  /** Reuses lib/tools/service-links.ts's resolveServiceLink() — undefined for
   * Tier 3 categories with no natural paid-service match, same convention
   * Tool.serviceTarget already uses. */
  readonly serviceTarget?: string
  /** Populated only for `ai-companions` — the explicit content boundary
   * decided in docs/research/prompt-library.md §10.3, surfaced on the
   * category page itself so it's a visible commitment, not just an internal
   * authoring rule. */
  readonly contentBoundary?: string
}

export interface PromptVariable {
  readonly name: string
  readonly description: string
  readonly example: string
  readonly required: boolean
}

export interface PromptVerification {
  readonly tool: string
  readonly version: string
  readonly date: string
}

export interface PromptChangelogEntry {
  readonly date: string
  readonly note: string
}

export interface Prompt {
  readonly slug: string
  readonly category: PromptCategorySlug
  /** Outcome-first, per the Gemini-gallery finding (§11.2) — what the
   * visitor gets, not the tool name. */
  readonly title: string
  readonly description: string
  /** The template body. {{double-brace}} placeholders match `variables`
   * entries by name — see §5's schema rationale for why not [BRACKETS]. */
  readonly promptText: string
  readonly variables: readonly PromptVariable[]
  /** Open array, not a closed union — a prompt library's value is tag
   * density, unlike the tool registry's hand-approved category union. */
  readonly targetTools: readonly string[]
  readonly tags: readonly string[]
  /** Required, not optional — the Claude Code prompt library precedent and
   * the Ahrefs premium-prompt blind test (§11.4, §9) both show an
   * unexplained prompt is selling an illusion. */
  readonly whyItWorks: string
  readonly exampleOutput?: string
  /** At least one entry required — this is the single best-evidenced
   * differentiator in the whole brief (§9, differentiator #1). */
  readonly verifiedAgainst: readonly PromptVerification[]
  readonly changelog: readonly PromptChangelogEntry[]
  /** Overrides the category's serviceTarget for this one prompt when it
   * points somewhere more specific — same optionality pattern as
   * Tool.serviceTarget. */
  readonly serviceTarget?: string
  /** Cross-links to an existing free tool, e.g. 'slogan-generator' — the
   * anti-silo mechanism from §8/§4's tie-in tables. */
  readonly relatedToolSlug?: string
}

/** Slugs the prompt registry may never use, mirroring lib/tools/types.ts's
 * RESERVED_SLUGS pattern one level down — these are prompt-category slugs
 * that would collide with route segments this feature itself defines. */
export const RESERVED_PROMPT_SLUGS: readonly string[] = ['category', 'search']
