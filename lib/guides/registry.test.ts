import { describe, expect, it } from 'vitest'
import { TOOLS } from '@/lib/tools/registry'
import { GUIDES } from './registry'

/**
 * Registry integrity, scaled down from `lib/tools/registry.test.ts` for a
 * three-entry catalogue: the checks that matter here are that a guide never
 * references a tool that does not exist (link rot on day one) and that the
 * content floors from the build brief actually held.
 */

describe('slug integrity', () => {
  it('has no duplicate guide slugs', () => {
    const slugs = GUIDES.map((g) => g.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses only url-safe lowercase kebab-case slugs', () => {
    for (const guide of GUIDES) {
      expect(guide.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})

describe('internal link graph', () => {
  it('only references tools that exist in the tool registry', () => {
    const known = new Set(TOOLS.map((t) => t.slug))
    for (const guide of GUIDES) {
      for (const slug of guide.relatedTools) {
        expect(known.has(slug), `${guide.slug} -> missing tool "${slug}"`).toBe(true)
      }
    }
  })

  it('curates at least one related tool per guide', () => {
    for (const guide of GUIDES) {
      expect(guide.relatedTools.length, guide.slug).toBeGreaterThan(0)
    }
  })
})

describe('content quality gates', () => {
  it('has a hand-written description within meta-description length', () => {
    for (const guide of GUIDES) {
      expect(
        guide.description.length,
        `${guide.slug} description too short`,
      ).toBeGreaterThan(70)
      expect(
        guide.description.length,
        `${guide.slug} description too long`,
      ).toBeLessThanOrEqual(200)
    }
  })

  it('has no two guides sharing a description or title', () => {
    const descriptions = GUIDES.map((g) => g.description)
    const titles = GUIDES.map((g) => g.title)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('has at least 3 real sections with non-empty bodies', () => {
    for (const guide of GUIDES) {
      expect(guide.sections.length, guide.slug).toBeGreaterThanOrEqual(3)
      for (const section of guide.sections) {
        expect(
          section.body.length,
          `${guide.slug}: "${section.heading}"`,
        ).toBeGreaterThan(0)
        for (const paragraph of section.body) {
          expect(
            paragraph.length,
            `${guide.slug}: "${section.heading}" has a thin paragraph`,
          ).toBeGreaterThan(40)
        }
      }
    }
  })

  it('uses a real ISO date for updatedAt', () => {
    for (const guide of GUIDES) {
      expect(guide.updatedAt, guide.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(guide.updatedAt)), guide.slug).toBe(false)
    }
  })

  it('gives every guide a positive, plausible reading-time estimate', () => {
    for (const guide of GUIDES) {
      expect(guide.readingMinutes, guide.slug).toBeGreaterThan(0)
      expect(guide.readingMinutes, guide.slug).toBeLessThanOrEqual(30)
    }
  })
})
