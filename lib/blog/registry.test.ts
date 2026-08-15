import { describe, expect, it } from 'vitest'
import { getPrompt } from '@/lib/prompts/registry'
import { TOOLS } from '@/lib/tools/registry'
import { SERVICE_PAGES } from '@/lib/tools/service-links'
import { BLOG_POSTS } from './registry'
import type { Inline } from './types'

/**
 * Registry integrity, scaled up from `lib/guides/registry.test.ts` for a
 * 100-entry catalogue with a stricter contract: every post must carry real
 * hyperlinks (the whole point of this content), not just related-slug
 * references.
 */

function flatten(post: (typeof BLOG_POSTS)[number]): readonly Inline[] {
  return post.sections.flatMap((s) => s.body.flatMap((p) => p))
}

describe('slug integrity', () => {
  it('has no duplicate blog post slugs', () => {
    const slugs = BLOG_POSTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('uses only url-safe lowercase kebab-case slugs', () => {
    for (const post of BLOG_POSTS) {
      expect(post.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})

describe('internal link graph', () => {
  it('only references tools that exist in the tool registry', () => {
    const known = new Set(TOOLS.map((t) => t.slug))
    for (const post of BLOG_POSTS) {
      for (const slug of post.relatedTools) {
        expect(known.has(slug), `${post.slug} -> missing tool "${slug}"`).toBe(true)
      }
    }
  })

  it('only references prompts that exist in the prompt registry', () => {
    for (const post of BLOG_POSTS) {
      for (const slug of post.relatedPrompts) {
        expect(getPrompt(slug), `${post.slug} -> missing prompt "${slug}"`).toBeDefined()
      }
    }
  })

  it('only references service targets that exist in SERVICE_PAGES', () => {
    for (const post of BLOG_POSTS) {
      if (post.serviceTarget === undefined) continue
      expect(
        Object.hasOwn(SERVICE_PAGES, post.serviceTarget),
        `${post.slug} -> missing service "${post.serviceTarget}"`,
      ).toBe(true)
    }
  })
})

describe('hyperlink requirement', () => {
  it('has at least one external (service/book-meeting) link per post', () => {
    for (const post of BLOG_POSTS) {
      const externalLinks = flatten(post).filter(
        (seg): seg is Extract<Inline, { external?: boolean }> =>
          typeof seg !== 'string' && seg.external === true,
      )
      expect(externalLinks.length, post.slug).toBeGreaterThanOrEqual(1)
    }
  })

  it('has at least two internal links per post', () => {
    for (const post of BLOG_POSTS) {
      const internalLinks = flatten(post).filter(
        (seg): seg is Extract<Inline, { external?: boolean }> =>
          typeof seg !== 'string' && !seg.external,
      )
      expect(internalLinks.length, post.slug).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('content quality gates', () => {
  it('has a hand-written description within meta-description length', () => {
    for (const post of BLOG_POSTS) {
      expect(
        post.description.length,
        `${post.slug} description too short`,
      ).toBeGreaterThan(70)
      expect(
        post.description.length,
        `${post.slug} description too long`,
      ).toBeLessThanOrEqual(200)
    }
  })

  it('has no two posts sharing a description, title, or target keyword', () => {
    const descriptions = BLOG_POSTS.map((p) => p.description)
    const titles = BLOG_POSTS.map((p) => p.title)
    const keywords = BLOG_POSTS.map((p) => p.targetKeyword)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(keywords).size).toBe(keywords.length)
  })

  it('has at least 5 real sections with non-empty bodies', () => {
    for (const post of BLOG_POSTS) {
      expect(post.sections.length, post.slug).toBeGreaterThanOrEqual(5)
      for (const section of post.sections) {
        expect(section.body.length, `${post.slug}: "${section.heading}"`).toBeGreaterThan(
          0,
        )
        for (const paragraph of section.body) {
          const text = paragraph
            .map((seg) => (typeof seg === 'string' ? seg : seg.text))
            .join('')
          expect(
            text.length,
            `${post.slug}: "${section.heading}" has a thin paragraph`,
          ).toBeGreaterThan(40)
        }
      }
    }
  })

  it('uses a real ISO date for updatedAt', () => {
    for (const post of BLOG_POSTS) {
      expect(post.updatedAt, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(post.updatedAt)), post.slug).toBe(false)
    }
  })

  it('gives every post a positive, plausible reading-time estimate', () => {
    for (const post of BLOG_POSTS) {
      expect(post.readingMinutes, post.slug).toBeGreaterThan(0)
      expect(post.readingMinutes, post.slug).toBeLessThanOrEqual(30)
    }
  })
})
