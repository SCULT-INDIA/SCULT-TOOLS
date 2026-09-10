import { readdirSync } from 'node:fs'
import { join, sep } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

/**
 * Route-coverage guard for the XML sitemap.
 *
 * Four hand-maintained lists describe "the static pages of this site" —
 * `app/sitemap.ts`'s STATIC_PAGES, `app/sitemap/page.tsx`'s TRUST_PAGES,
 * `lib/seo/llms.ts`'s TRUST_PAGES and `components/layout/Footer.tsx`'s Site
 * column. They had silently drifted: `/mcp` was live, linked from the footer
 * and named in llms.txt, yet absent from the XML sitemap entirely, so search
 * engines got no sitemap signal for a real product page. `/pricing` and
 * `/compliance` were each missing from other copies.
 *
 * Rather than trust a comment telling the next person to keep four lists in
 * sync, this walks the real `app/` route tree and asserts the sitemap covers
 * every static page that actually exists. Dynamic segments are excluded on
 * purpose: those entries are generated from the registries (TOOLS, PROMPTS,
 * GUIDES, BLOG_POSTS, skills) which cannot drift from the routes the same
 * way a hand-typed list can.
 *
 * Same spirit as `lib/no-hardcoded-booking-url.test.ts`: scan what the repo
 * really contains instead of asserting against a second hand-written list.
 *
 * Lives in `tests/` rather than beside the route: `vitest.config.ts` only
 * collects from `lib/`, `components/` and `tests/`, and this is a
 * cross-cutting route-tree assertion rather than a unit test of one module.
 */

/**
 * The skills entries hit Supabase. Stubbed so this file is hermetic and
 * offline — it asserts route coverage, not query behaviour.
 *
 * `getAllCategoryCounts` reports every category as populated rather than
 * returning `{}`: the sitemap lists `/skills/<category>` only for categories
 * that actually hold skills (an empty one `notFound()`s, so listing it would
 * put a 404 in the sitemap), and with `{}` there would be no live category
 * to check that against — the coverage assertion would pass vacuously.
 * `totalSkills` stays 0 so the shard-count assertions below stay exact.
 * The async factory is what makes importing SKILL_CATEGORIES here safe:
 * `vi.mock` is hoisted above the imports, so a synchronous factory could
 * read the module before it initialised.
 */
vi.mock('@/lib/skills/db', async () => {
  const { SKILL_CATEGORIES } = await import('@/lib/skills/categories')
  return {
    getAllCategoryCounts: async () =>
      Object.fromEntries(SKILL_CATEGORIES.map((c) => [c.slug, 1])),
    getAllSkillRefs: async () => [],
    getSyncMeta: async () => ({ totalSkills: 0, lastSyncedAt: '2026-09-01' }),
    getTotalSkillCount: async () => 0,
  }
})

import sitemap, { generateSitemaps, SKILLS_PER_SHARD, sitemapShards } from '@/app/sitemap'
import { BLOG_POSTS } from '@/lib/blog/registry'
import { GUIDES } from '@/lib/guides/registry'
import { PROMPT_CATEGORIES } from '@/lib/prompts/categories'
import { getPromptsByCategory, PROMPTS } from '@/lib/prompts/registry'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { CATEGORIES } from '@/lib/tools/categories'
import { TOOLS } from '@/lib/tools/registry'

const APP_DIR = join(process.cwd(), 'app')

/** Every non-dynamic route in `app/`, as a URL pathname. */
function staticRoutes(dir = APP_DIR, prefix = ''): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      found.push(prefix === '' ? '/' : prefix)
      continue
    }
    if (!entry.isDirectory()) continue
    // Dynamic segments ([slug]) come from the registries; `api` serves no
    // pages; route groups aren't used in this app but are skipped for safety.
    if (
      entry.name.startsWith('[') ||
      entry.name === 'api' ||
      entry.name.startsWith('(')
    ) {
      continue
    }
    found.push(...staticRoutes(join(dir, entry.name), `${prefix}/${entry.name}`))
  }
  return found
}

function pathnamesFrom(entries: { url: string }[]): Set<string> {
  return new Set(
    entries.map((entry) => new URL(entry.url).pathname.replace(/\/$/, '') || '/'),
  )
}

describe('sitemap route coverage', () => {
  it('finds the real route tree (sanity check on the walker itself)', () => {
    const routes = staticRoutes()
    // A walker that silently returned [] would make every assertion below
    // vacuously pass, so pin the shape of what it found.
    expect(routes).toContain('/')
    expect(routes).toContain('/mcp')
    expect(routes).toContain('/skills')
    expect(routes.every((r) => !r.includes(sep))).toBe(true)
    expect(routes.length).toBeGreaterThan(15)
  })

  it('includes every static page that exists in app/', async () => {
    const covered = pathnamesFrom(await sitemap({ id: 0 }))
    const missing = staticRoutes().filter((route) => !covered.has(route))
    expect(missing).toEqual([])
  })

  /**
   * The shape Next 16 ACTUALLY passes, and the regression this guards.
   * `id` arrives as a Promise resolving to a STRING, so the original
   * `id === 0` check compared a Promise to a number, never matched, and
   * every shard silently served an empty `<urlset>` with a 200. Verified
   * against the running dev server before the fix. Any future refactor that
   * drops the `await` or the numeric coercion fails right here.
   */
  it('serves the site sitemap for a promised string id, as Next really calls it', async () => {
    const entries = await sitemap({ id: Promise.resolve('0') })
    expect(entries.length).toBeGreaterThan(15)
    expect(pathnamesFrom(entries).has('/mcp')).toBe(true)
  })

  it('routes a promised string shard id to skills, not the site sitemap', async () => {
    // Shard 1 is the first skills shard. With skills mocked empty it must
    // come back empty — crucially NOT the site sitemap, which would mean
    // every skills shard duplicated all the site URLs.
    expect(await sitemap({ id: Promise.resolve('1') })).toEqual([])
  })

  it('falls back to the site sitemap for a nonsense shard id', async () => {
    // A direct hit on /sitemap/abc.xml must not reach `.range(NaN, NaN)`.
    const entries = await sitemap({ id: Promise.resolve('abc') })
    expect(entries.length).toBeGreaterThan(15)
  })

  it('lists no duplicate URLs', async () => {
    const entries = await sitemap({ id: 0 })
    const urls = entries.map((e) => e.url)
    expect(urls.length).toBe(new Set(urls).size)
  })

  it('gives every entry an absolute https URL and a real lastModified date', async () => {
    for (const entry of await sitemap({ id: 0 })) {
      expect(entry.url.startsWith('https://')).toBe(true)
      expect(String(entry.lastModified)).toMatch(/^\d{4}-\d{2}-\d{2}/)
    }
  })

  it('shards skills at the protocol cap, always with a site sitemap at id 0', async () => {
    // Mocked to 0 skills: still one skills shard, so the map never has a hole.
    expect(await generateSitemaps()).toEqual([{ id: 0 }, { id: 1 }])
    expect(SKILLS_PER_SHARD).toBe(50_000)
  })

  /**
   * `generateSitemaps()` (what Next serves), `app/sitemap-index.xml`'s
   * `<sitemapindex>` and `app/robots.ts`'s `Sitemap:` lines all have to agree
   * on how many shards exist. They used to each recompute
   * `ceil(totalSkills / SKILLS_PER_SHARD)`, so any change had three places to
   * miss — and disagreement is invisible until robots.txt advertises a shard
   * that 404s. All three now derive from `sitemapShards()`.
   */
  it('derives the served shard ids from the same list the index uses', async () => {
    const shards = await sitemapShards()
    expect(shards.map(({ id }) => ({ id }))).toEqual(await generateSitemaps())
    // Every shard the index will advertise must be one Next actually serves.
    expect(shards.map((s) => s.id)).toEqual([0, 1])
  })

  it('gives every shard in the index a real lastModified, never a build clock', async () => {
    for (const shard of await sitemapShards()) {
      expect(shard.lastModified).toMatch(/^\d{4}-\d{2}-\d{2}/)
    }
  })
})

/**
 * Coverage of the DYNAMIC routes, which the walker above deliberately skips
 * and which are ~97% of the site's pages.
 *
 * `staticRoutes()` proves no hand-typed page is missing, but it says nothing
 * about the nine `[param]` route patterns — `/[category]`,
 * `/[category]/[slug]`, `/[category]/[slug]/how-it-works`, `/blog/[slug]`,
 * `/guides/[slug]`, `/prompts/[category]`, `/prompts/[category]/[slug]`,
 * `/skills/[category]`, `/skills/[category]/[slug]`. Those come from the
 * registries, so they can't drift from a hand-typed list — but the sitemap
 * could still expand the wrong registry, forget one, or emit the wrong URL
 * shape, and nothing above would notice.
 *
 * `expectedPathnames()` below rebuilds the complete route set independently
 * of `app/sitemap.ts`: the real static tree plus each registry expanded by
 * the shape its route file declares. The set is then compared in BOTH
 * directions, which is what makes it a completeness proof rather than a spot
 * check:
 *
 *   - missing (expected - sitemap): a real page absent from the sitemap, so
 *     search engines get no signal for it. This is the `/mcp` class of bug.
 *   - extra (sitemap - expected): a URL in the sitemap with no page behind
 *     it, i.e. the sitemap advertising a 404 — worse than an omission,
 *     because it costs crawl budget and signals a broken site.
 */
function expectedPathnames(): Set<string> {
  return new Set([
    // Every non-dynamic page that exists on disk.
    ...staticRoutes(),
    // Tool categories and tools. Every tool has a how-it-works page:
    // `howItWorks` is a required field on the Tool type and that route's
    // `generateStaticParams` maps over all of TOOLS unfiltered.
    ...CATEGORIES.map((c) => `/${c.slug}`),
    ...TOOLS.map((t) => `/${t.category}/${t.slug}`),
    ...TOOLS.map((t) => `/${t.category}/${t.slug}/how-it-works`),
    // Prompt categories, minus empty ones — `app/prompts/[category]` calls
    // notFound() when a category holds no prompts, so an empty category is a
    // real 404 and listing it would be the "extra" failure above.
    ...PROMPT_CATEGORIES.filter((c) => getPromptsByCategory(c.slug).length > 0).map(
      (c) => `/prompts/${c.slug}`,
    ),
    ...PROMPTS.map((p) => `/prompts/${p.category}/${p.slug}`),
    ...GUIDES.map((g) => `/guides/${g.slug}`),
    ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
    // Same empty-category rule as prompts (`app/skills/[category]` also
    // notFound()s); the mock reports all of them populated.
    ...SKILL_CATEGORIES.map((c) => `/skills/${c.slug}`),
  ])
}

describe('sitemap dynamic-route coverage', () => {
  it('covers every page the route tree and registries produce, and nothing else', async () => {
    // Individual skill pages live in shards 1+ (mocked empty here) and are
    // verified against the live table instead — 50,000 + 456 URLs for
    // exactly 50,456 rows. Shard 0 holds every other page on the site.
    const actual = pathnamesFrom(await sitemap({ id: Promise.resolve('0') }))
    const expected = expectedPathnames()

    const missing = [...expected].filter((p) => !actual.has(p)).sort()
    const extra = [...actual].filter((p) => !expected.has(p)).sort()

    expect({ missing, extra }).toEqual({ missing: [], extra: [] })
  })

  it('expands every registry, so a whole content type cannot go missing', async () => {
    // Guards the vacuous-pass failure mode: if a registry were empty, or the
    // sitemap stopped expanding one, the set comparison above would still
    // pass while a whole content type silently vanished.
    const actual = pathnamesFrom(await sitemap({ id: Promise.resolve('0') }))
    const counts = {
      toolCategories: CATEGORIES.filter((c) => actual.has(`/${c.slug}`)).length,
      tools: TOOLS.filter((t) => actual.has(`/${t.category}/${t.slug}`)).length,
      howItWorks: TOOLS.filter((t) => actual.has(`/${t.category}/${t.slug}/how-it-works`))
        .length,
      prompts: PROMPTS.filter((p) => actual.has(`/prompts/${p.category}/${p.slug}`))
        .length,
      guides: GUIDES.filter((g) => actual.has(`/guides/${g.slug}`)).length,
      blogPosts: BLOG_POSTS.filter((p) => actual.has(`/blog/${p.slug}`)).length,
      skillCategories: SKILL_CATEGORIES.filter((c) => actual.has(`/skills/${c.slug}`))
        .length,
    }
    expect(counts).toEqual({
      toolCategories: CATEGORIES.length,
      tools: TOOLS.length,
      howItWorks: TOOLS.length,
      prompts: PROMPTS.length,
      guides: GUIDES.length,
      blogPosts: BLOG_POSTS.length,
      skillCategories: SKILL_CATEGORIES.length,
    })
    for (const [name, count] of Object.entries(counts)) {
      expect(count, `${name} expanded to zero URLs`).toBeGreaterThan(0)
    }
  })
})
