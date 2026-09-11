import { describe, expect, it } from 'vitest'
import { hasIcon } from '@/components/ui/Icon'
import { liveSkillCategories, SKILL_CATEGORIES } from './categories'

/**
 * Structural integrity for the static taxonomy only. Unlike
 * `lib/prompts/registry.test.ts`, there is no static array of skills to
 * check here anymore — the actual skill data lives in Supabase, populated
 * by a separate Vercel sync-worker, and checking it would mean giving the
 * test suite a live network dependency. That data is validated at
 * write-time instead: the sync-worker's own upsert enforces the DB schema
 * (supabase/migrations/0001_create_skills.sql — NOT NULL columns, the
 * (category, slug) unique index), and `scripts/db-migrate.mjs` /
 * `lib/skills/db.ts`'s error handling covers the read path.
 */
describe('category taxonomy integrity', () => {
  it('has no duplicate category slugs', () => {
    const slugs = SKILL_CATEGORIES.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses only url-safe lowercase kebab-case category slugs', () => {
    for (const category of SKILL_CATEGORIES) {
      expect(category.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('resolves every category icon to a real component', () => {
    for (const category of SKILL_CATEGORIES) {
      expect(hasIcon(category.icon), `${category.slug} -> "${category.icon}"`).toBe(true)
    }
  })

  it('gives every category at least one seed query for the sync-worker to discover it by', () => {
    for (const category of SKILL_CATEGORIES) {
      expect(category.seedQueries.length, category.slug).toBeGreaterThan(0)
    }
  })

  it('has no two categories sharing a name or a blurb', () => {
    const names = SKILL_CATEGORIES.map((c) => c.name)
    const blurbs = SKILL_CATEGORIES.map((c) => c.blurb)
    expect(new Set(names).size).toBe(names.length)
    expect(new Set(blurbs).size).toBe(blurbs.length)
  })
})

/**
 * Guards a real production incident: `getAllCategoryCounts()` degraded to
 * `{}` after a `57014` statement timeout during `next build`'s concurrent
 * page-data collection. `app/skills/[category]/page.tsx`'s
 * `generateStaticParams` filtered every category out against that `{}` and
 * returned zero static params, which Next's Cache Components hard-rejects
 * ("all `generateStaticParams` functions must return at least one
 * result") — one transient database hiccup failed the entire production
 * deploy, not just this one page.
 */
describe('liveSkillCategories', () => {
  const cats = [
    { slug: 'testing' },
    { slug: 'debugging' },
    { slug: 'general' },
  ] as unknown as typeof SKILL_CATEGORIES

  it('filters to only categories with a positive count, in the normal case', () => {
    const counts = { testing: 40, debugging: 0, general: 12 }
    const result = liveSkillCategories(counts, cats)
    expect(result.map((c) => c.slug)).toEqual(['testing', 'general'])
  })

  it('falls back to every category when the counts map is completely empty', () => {
    // The exact shape `getAllCategoryCounts()` degrades to on a database
    // failure — this must never resolve to zero live categories.
    const result = liveSkillCategories({}, cats)
    expect(result).toBe(cats)
  })

  it('falls back to every category when every individual count is zero', () => {
    // Same failure signature reached a different way: a counts object that
    // exists but reports zero everywhere — e.g. a query that returned rows
    // but for the wrong/empty result set.
    const counts = { testing: 0, debugging: 0, general: 0 }
    const result = liveSkillCategories(counts, cats)
    expect(result).toBe(cats)
  })

  it('does NOT fall back when the query genuinely, correctly excludes some categories', () => {
    // A real, successful result legitimately reporting a handful of
    // categories as empty is this site's actual current state (a couple of
    // skill categories are genuinely still empty) and must keep behaving
    // exactly as today — only the ALL-empty shape is the failure signature.
    const counts = { testing: 5 }
    const result = liveSkillCategories(counts, cats)
    expect(result.map((c) => c.slug)).toEqual(['testing'])
  })

  it('defaults to the real SKILL_CATEGORIES when no category list is passed', () => {
    expect(liveSkillCategories({})).toBe(SKILL_CATEGORIES)
  })
})
