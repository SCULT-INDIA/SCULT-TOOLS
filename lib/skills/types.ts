/**
 * The Skills Library's type contract — a third sibling to `lib/tools/` and
 * `lib/prompts/`, but a different kind of content: a `Skill` is a
 * **normalized third-party record**, not original site copy. Every field
 * traces back to a real, public `SKILL.md` file synced from the skills.sh
 * registry (see `scripts/sync-skills.mjs`) — nothing here is authored or
 * invented at the site layer.
 */

/**
 * Dev-tool-centric taxonomy, matching the audience `/tools` and `/prompts`
 * already serve — not skills-library.com's generic consumer categories.
 * Each category also drives which skills.sh search terms populate it; see
 * `lib/skills/categories.ts`'s `seedQueries`.
 */
export type SkillCategorySlug =
  | 'testing'
  | 'debugging'
  | 'git-workflows'
  | 'code-review'
  | 'refactoring'
  | 'api-design'
  | 'database'
  | 'security'
  | 'performance'
  | 'deployment-cicd'
  | 'observability'
  | 'accessibility'
  | 'frontend-frameworks'
  | 'backend-frameworks'
  | 'mobile'
  | 'devops-infra'
  | 'ai-ml'
  | 'data-engineering'
  | 'architecture'
  | 'design-systems'
  | 'seo-marketing'
  | 'project-management'
  | 'writing-docs'
  /** Catch-all for real, useful skills outside the 23 dev-tool-specific
   * buckets above — legal, healthcare, creative, finance, gaming, and
   * everything else the full skills.sh registry actually contains. Exists
   * so the sync-worker never silently drops a skill just because it isn't
   * a developer task; a future pass can split this into more specific
   * categories once real volume shows what's actually in here. */
  | 'general'

export interface SkillCategory {
  readonly slug: SkillCategorySlug
  readonly name: string
  readonly blurb: string
  readonly intro: string
  readonly icon: string
  readonly tile: 'yellow' | 'blue' | 'lavender' | 'green'
  /** skills.sh `/api/search` query terms used to seed and grow this
   * category — the combinatorial mechanism that reaches real volume without
   * inventing content (see the plan's "real, combinatorial taxonomy"
   * section). */
  readonly seedQueries: readonly string[]
}

/** One file from the skill's real source repo, verbatim. */
export interface SkillFile {
  readonly path: string
  readonly contents: string
}

export interface Skill {
  /** skills.sh's own id, e.g. "anthropics/skills/webapp-testing" — the
   * stable dedup key across sync runs. */
  readonly id: string
  /** Site-local URL slug, derived from `sourceSkillId` and de-duplicated
   * against collisions from other repos shipping the same skill name. */
  readonly slug: string
  readonly category: SkillCategorySlug
  /** The real `name` field from the skill's own SKILL.md frontmatter. */
  readonly name: string
  /** The real `description` field from SKILL.md frontmatter — the trigger
   * phrase text, not site copy. */
  readonly description: string
  /** The real SKILL.md markdown body, frontmatter stripped. */
  readonly body: string
  readonly tags: readonly string[]
  /** SPDX identifier when SKILL.md's frontmatter states one plainly (e.g.
   * "MIT"). Undefined when the license is unclear or points at a separate
   * LICENSE file this sync didn't classify as permissive — see
   * `licenseGated`. */
  readonly license?: string
  /** True when the source license couldn't be confirmed permissive — the
   * detail page must link out to the source instead of inlining `body`. */
  readonly licenseGated: boolean
  readonly sourceOwner: string
  readonly sourceRepo: string
  /** The skill's own id within its source repo, e.g. "webapp-testing" —
   * distinct from the site-local `slug`. */
  readonly sourceSkillId: string
  readonly sourceUrl: string
  readonly installs: number
  /** First time our own sync indexed this id — makes a "recently added"
   * feed a real, checkable fact. */
  readonly firstSeenAt: string
  /** Most recent sync that saw this id — makes "updated daily" a real,
   * checkable fact per entry, not a footer claim. */
  readonly lastSyncedAt: string
  /** Populated by a lightweight keyword-match heuristic against the real
   * tool/prompt registries — not hand-curated at this volume. */
  readonly relatedTools: readonly string[]
  readonly relatedPrompts: readonly string[]
}

/** Slugs the skills registry may never assign, mirroring
 * `lib/prompts/types.ts`'s `RESERVED_PROMPT_SLUGS` one level down. */
export const RESERVED_SKILL_SLUGS: readonly string[] = ['category', 'search']
