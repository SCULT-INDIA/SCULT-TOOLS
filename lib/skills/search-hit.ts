import { SKILL_CATEGORIES } from './categories'
import type { SkillCategory } from './types'

/**
 * The shape a Skills Library result takes inside site-wide search — kept
 * separate from `lib/search-client.ts`'s `SearchEntry`/`SearchHit` union
 * rather than folded into it, on purpose: that union is also the exact
 * contract `lib/search-payload.ts` compacts into tuples for the wire
 * format, and widening it with a fourth `kind` would force that unrelated
 * encoder/decoder to learn about skills too. Skills never travel through
 * that payload anyway — they arrive from `useSkillSearchHits`, live, one
 * request at a time, never baked into a static index (the registry has
 * 10,000 rows; the tool/prompt index exists specifically because THEIR
 * registries are small enough to ship whole — see search-payload.ts's own
 * measurements).
 *
 * Field-for-field this deliberately matches `PromptSearchEntry` (`href`,
 * `name`, `categoryName`, `icon`, `tile`) rather than inventing its own
 * shape: `SearchBox`'s option renderer already knows how to draw "an
 * icon-on-pastel-tile row with a name and a categoryName line" for a
 * prompt, and a skill result wants exactly that same treatment, so sharing
 * the field names lets the renderer accept either without a kind-specific
 * branch.
 */
export interface SkillHit {
  readonly kind: 'skill'
  readonly slug: string
  readonly category: string
  readonly href: string
  readonly name: string
  readonly description: string
  readonly categoryName: string
  /** Lucide icon name of the skill's category, rendered via <Icon/> —
   * same fallback treatment PromptCard/SearchBox already use for a prompt
   * result with no per-item mark of its own. */
  readonly icon: string
  readonly tile: SkillCategory['tile']
}

/**
 * category slug -> display fields, built once from the real category
 * registry (never invented) so a skill hit's icon/tile/name always match
 * the category page it links to. `lib/skills/categories.ts` also carries
 * each category's `seedQueries` (used only by the sync tooling), which is
 * why this stays a derived lookup rather than something client code re-keys
 * from raw category objects at every call site.
 */
// Explicitly `Map<string, …>`, not the `Map<SkillCategorySlug, …>` inference
// would otherwise give it: the key on the read side is whatever `category`
// string a JSON response over the network happens to contain, which
// TypeScript can only ever know is `string`, never the narrower slug type.
const CATEGORY_META: Map<
  string,
  { name: string; icon: string; tile: SkillCategory['tile'] }
> = new Map(
  SKILL_CATEGORIES.map((c) => [c.slug, { name: c.name, icon: c.icon, tile: c.tile }]),
)

/** The CLI skills-search endpoint's response row — see
 * app/api/cli/v1/skills/search/route.ts. Reused as-is rather than adding a
 * second public search endpoint for the same query. */
export interface CliSkillSearchRow {
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly category: string
}

/** True for a value with every field `toSkillHit` reads, all as strings —
 * the minimum needed to trust network JSON enough to map it, without
 * pulling in a schema-validation dependency for one small, stable shape. */
export function isCliSkillSearchRow(value: unknown): value is CliSkillSearchRow {
  if (value === null || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.slug === 'string' &&
    typeof row.name === 'string' &&
    typeof row.description === 'string' &&
    typeof row.category === 'string'
  )
}

/** Maps one CLI search row to a `SkillHit`, or `undefined` for a category
 * the client-side registry doesn't recognise (defensive only — every row
 * the endpoint returns came from a real, still-existing category). */
export function toSkillHit(row: CliSkillSearchRow): SkillHit | undefined {
  const meta = CATEGORY_META.get(row.category)
  if (!meta) return undefined
  return {
    kind: 'skill',
    slug: row.slug,
    category: row.category,
    href: `/skills/${row.category}/${row.slug}`,
    name: row.name,
    description: row.description,
    categoryName: meta.name,
    icon: meta.icon,
    tile: meta.tile,
  }
}
