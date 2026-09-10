import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { GUIDES } from '@/lib/guides/registry'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import type { Prompt } from '@/lib/prompts/types'
import { absoluteUrl } from '@/lib/site'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { getAllCategoryCounts, getAllSkillRefs, getSyncMeta } from '@/lib/skills/db'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

/**
 * Static trust/reference pages the registries don't drive. `lastModified` for
 * `/about` and `/privacy` is their real last-commit date (`git log`), not a
 * guess — the 2026-08-09 build-out pages get the literal date they were
 * actually written, for the same reason: never `new Date()`.
 */
const STATIC_PAGES: readonly {
  path: string
  lastModified: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}[] = [
  {
    path: '/about',
    lastModified: '2026-08-08',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    path: '/privacy',
    lastModified: '2026-08-08',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  { path: '/faq', lastModified: '2026-08-09', changeFrequency: 'monthly', priority: 0.6 },
  {
    path: '/pricing',
    lastModified: '2026-08-14',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  // The MCP server's own landing page. A real product surface (it documents
  // the public Streamable HTTP endpoint every agent connects to), so it
  // carries a catalogue-level priority rather than a trust-page one — it was
  // missing from this list entirely until the route-coverage test below
  // caught it, despite already being linked from the footer and llms.txt.
  { path: '/mcp', lastModified: '2026-08-24', changeFrequency: 'monthly', priority: 0.8 },
  {
    path: '/glossary',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/collections',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/guides',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/blog',
    lastModified: '2026-08-15',
    changeFrequency: 'weekly',
    priority: 0.7,
  },
  {
    path: '/changelog',
    lastModified: '2026-08-09',
    changeFrequency: 'weekly',
    priority: 0.5,
  },
  {
    path: '/sitemap',
    lastModified: '2026-08-09',
    changeFrequency: 'weekly',
    priority: 0.4,
  },
  {
    path: '/roadmap',
    lastModified: '2026-08-09',
    changeFrequency: 'monthly',
    priority: 0.3,
  },
  {
    path: '/brand',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/contact',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/security',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/compliance',
    lastModified: '2026-08-16',
    changeFrequency: 'monthly',
    priority: 0.4,
  },
  {
    path: '/accessibility',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms',
    lastModified: '2026-08-09',
    changeFrequency: 'yearly',
    priority: 0.3,
  },
]

/** Latest of a set of ISO `YYYY-MM-DD` dates — lexical order is date order. */
function newest(dates: readonly string[], fallback: string): string {
  return dates.reduce((latest, date) => (date > latest ? date : latest), fallback)
}

/**
 * The prompt-side equivalent of a tool's `updatedAt`: the newest date the
 * prompt was actually changed or re-verified. Both arrays are required by
 * the Prompt contract, so the fallback is belt-and-braces only.
 */
function promptLastModified(prompt: Prompt): string {
  return newest(
    [
      ...prompt.changelog.map((entry) => entry.date),
      ...prompt.verifiedAgainst.map((entry) => entry.date),
    ],
    '2026-07-25',
  )
}

/** The sitemap protocol's real cap: 50,000 URLs per file (also well under
 * its 50MB-uncompressed size limit at this entry size) — used in full
 * rather than left with headroom, so every shard is maxed out and the
 * total shard count stays as low as the spec allows. The Skills Library is
 * sized to eventually hold the full skills.sh registry (~600k), so its
 * URLs alone need many shards at this cap (12 shards at 600k); everything
 * else on the site fits one (id 0) many times over. */
export const SKILLS_PER_SHARD = 50_000

/**
 * Every shard this sitemap serves, with the newest `lastModified` each one
 * contains. The single source of truth for "how many sitemap files exist":
 * `generateSitemaps()` below, `app/sitemap-index.xml/route.ts`'s index, and
 * `app/robots.ts` all derive from this, because the shard count used to be
 * recomputed from `totalSkills` in each of those places independently — and
 * three copies of `Math.ceil(totalSkills / SKILLS_PER_SHARD)` is three
 * chances for robots.txt to advertise a shard that isn't served, or to miss
 * one that is.
 *
 * `lastModified` is real in both cases, never `new Date()`: the skills
 * shards carry the sync-worker's recorded `last_synced_at`, and shard 0
 * carries the newest date across the registries and static pages it lists.
 * Mixed `YYYY-MM-DD` dates and full ISO timestamps compare correctly here
 * for the reason `newest()` relies on — lexical order is date order.
 */
export async function sitemapShards(): Promise<
  readonly { id: number; lastModified: string }[]
> {
  const { totalSkills, lastSyncedAt } = await getSyncMeta()
  const skillsLastModified = lastSyncedAt ?? '2026-08-23'
  const skillShardCount = Math.max(1, Math.ceil(totalSkills / SKILLS_PER_SHARD))
  return [
    {
      id: 0,
      lastModified: newest(
        [
          ...TOOLS.map((t) => t.updatedAt),
          ...PROMPTS.map(promptLastModified),
          ...STATIC_PAGES.map((p) => p.lastModified),
          ...GUIDES.map((g) => g.updatedAt),
          ...BLOG_POSTS.map((p) => p.updatedAt),
          // Shard 0 lists /skills and every /skills/<category>, so a sync
          // moves it too.
          skillsLastModified,
        ],
        skillsLastModified,
      ),
    },
    ...Array.from({ length: skillShardCount }, (_, i) => ({
      id: i + 1,
      lastModified: skillsLastModified,
    })),
  ]
}

export async function generateSitemaps() {
  // Next only wants the ids; the lastModified goes to the index route.
  return (await sitemapShards()).map(({ id }) => ({ id }))
}

async function siteSitemap(): Promise<MetadataRoute.Sitemap> {
  const newestTool = TOOLS.reduce(
    (latest, t) => (t.updatedAt > latest ? t.updatedAt : latest),
    TOOLS[0]?.updatedAt ?? '2026-07-28',
  )
  const newestPrompt = newest(PROMPTS.map(promptLastModified), '2026-07-25')

  const livePromptCategories = PROMPT_CATEGORIES.filter(
    (c) => getPromptsByCategory(c.slug).length > 0,
  )

  const [skillCounts, skillSyncMeta] = await Promise.all([
    getAllCategoryCounts(),
    getSyncMeta(),
  ])
  const skillsLastModified = skillSyncMeta.lastSyncedAt ?? '2026-08-23'
  const liveSkillCategories = SKILL_CATEGORIES.filter(
    (c) => (skillCounts[c.slug] ?? 0) > 0,
  )

  return [
    {
      url: absoluteUrl('/'),
      // The homepage surfaces both catalogues, so it moves when either does.
      lastModified: newestTool > newestPrompt ? newestTool : newestPrompt,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/all'),
      lastModified: newestTool,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...CATEGORIES.map((c) => ({
      url: absoluteUrl(`/${c.slug}`),
      lastModified: newestTool,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...TOOLS.map((t) => ({
      url: absoluteUrl(`/${t.category}/${t.slug}`),
      lastModified: t.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...TOOLS.map((t) => ({
      url: absoluteUrl(`/${t.category}/${t.slug}/how-it-works`),
      lastModified: t.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: absoluteUrl('/prompts'),
      lastModified: newestPrompt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...livePromptCategories.map((c) => ({
      url: absoluteUrl(`/prompts/${c.slug}`),
      lastModified: newest(
        getPromptsByCategory(c.slug).map(promptLastModified),
        '2026-07-25',
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...PROMPTS.map((p) => ({
      url: absoluteUrl(`/prompts/${p.category}/${p.slug}`),
      lastModified: promptLastModified(p),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...STATIC_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: absoluteUrl('/skills'),
      lastModified: skillsLastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...liveSkillCategories.map((c) => ({
      url: absoluteUrl(`/skills/${c.slug}`),
      lastModified: skillsLastModified,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ]
}

async function skillsShardSitemap(shardIndex: number): Promise<MetadataRoute.Sitemap> {
  const refs = await getAllSkillRefs(shardIndex * SKILLS_PER_SHARD, SKILLS_PER_SHARD)
  return refs.map((ref) => ({
    url: absoluteUrl(`/skills/${ref.category}/${ref.slug}`),
    lastModified: ref.lastSyncedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))
}

/**
 * `id` is NOT the `number` this signature claimed for as long as sharding
 * has existed here. Next 16 hands it over the same async-params channel every
 * dynamic route uses (see any dynamic-segment page in this app: `params:
 * Promise<...>` + `await params`), so what actually arrives is a Promise
 * resolving to a string — verified live against the dev server, which
 * logged `typeof id === 'object'` before the await and `"0"` (string) after.
 *
 * The consequence was silent and total: `id === 0` compared a Promise to a
 * number, never matched, so EVERY shard fell through to
 * `skillsShardSitemap(id - 1)`, where `Promise - 1` is `NaN` and the range
 * query returned nothing. Both `/sitemap/0.xml` and `/sitemap/1.xml` served
 * a valid-but-empty `<urlset>` — the whole site absent from its own sitemap,
 * with a 200 and no error anywhere to notice.
 *
 * Hence `Number(await id)`: await for the async-params contract, `Number()`
 * because the resolved value is a string. Anything that isn't a positive
 * shard index (bogus `/sitemap/abc.xml`, a negative, a non-integer) serves
 * the site sitemap rather than issuing a malformed `.range()` query.
 */
export default async function sitemap({
  id,
}: {
  id: Promise<string> | string | number
}): Promise<MetadataRoute.Sitemap> {
  const shard = Number(await id)
  if (!Number.isInteger(shard) || shard <= 0) return siteSitemap()
  return skillsShardSitemap(shard - 1)
}
