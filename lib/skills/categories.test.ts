import { describe, expect, it } from 'vitest'
import { hasIcon } from '@/components/ui/Icon'
import { SKILL_CATEGORIES } from './categories'

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
