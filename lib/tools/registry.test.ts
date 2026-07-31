import { describe, expect, it } from 'vitest'
import { IMPLEMENTED_TOOL_SLUGS } from '@/components/tools'
import { hasIcon } from '@/components/ui/Icon'
import { CATEGORIES } from './categories'
import { allRoutableSlugs, buildInboundMap, getToolsByCategory, TOOLS } from './registry'
import { RESERVED_SLUGS } from './types'

/**
 * Registry integrity.
 *
 * These are the guarantees docs/PLAN.md §6.8 promises will be "enforced by a CI
 * test that fails the build, not by review discipline". Every assertion here
 * protects against a class of bug that is cheap to prevent and expensive to find
 * in production: a slug colliding with a route, a tool nobody links to, a
 * dangling `related` reference, or a registry entry with no component behind it.
 */

describe('approved scope — the tool list is a product decision', () => {
  it('contains exactly the approved 15 tools, no more, no less', () => {
    // This is the scope gate: the approved list is the single source of truth
    // for what this site contains. Adding a tool here requires product approval,
    // and this assertion is what makes "no extra tools" enforceable in CI.
    const approved = [
      // SEO
      'schema-markup-generator',
      'faq-schema-generator',
      'utm-builder',
      'marketing-roi-calculator',
      'website-speed-test',
      // Business
      'invoice-generator',
      'business-name-generator',
      'slogan-generator',
      'email-signature-generator',
      // Developer
      'json-formatter',
      'qr-code-generator',
      'favicon-generator',
      // Productivity
      'word-counter',
      // Design
      'color-palette-generator',
      // GEO / AEO
      'ai-visibility-checker',
    ].sort()
    expect(TOOLS.map((t) => t.slug).sort()).toEqual(approved)
  })

  it('exposes exactly the six approved categories', () => {
    expect(CATEGORIES.map((c) => c.slug).sort()).toEqual(
      ['business', 'design', 'dev', 'geo', 'productivity', 'seo'].sort(),
    )
  })
})

describe('slug integrity', () => {
  it('has no duplicate slugs across tools', () => {
    const slugs = TOOLS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('has no duplicate category slugs', () => {
    const slugs = CATEGORIES.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('never collides with a reserved route slug', () => {
    // Category slugs live at the site root, so a collision would shadow a real
    // page (/about, /all, /api…). This is the test that makes the flat URL
    // structure safe.
    for (const slug of allRoutableSlugs()) {
      expect(RESERVED_SLUGS, `"${slug}" is a reserved route`).not.toContain(slug)
    }
  })

  it('never lets a tool slug collide with a category slug', () => {
    // Typed as Set<string>, not Set<CategorySlug>: the whole point is to test a
    // plain tool slug against it, which a CategorySlug-typed Set would reject at
    // compile time — exactly the case we want to check at runtime.
    const categorySlugs = new Set<string>(CATEGORIES.map((c) => c.slug))
    for (const tool of TOOLS) {
      expect(categorySlugs.has(tool.slug), `tool "${tool.slug}" shadows a category`).toBe(
        false,
      )
    }
  })

  it('uses only url-safe lowercase kebab-case slugs', () => {
    for (const tool of TOOLS) {
      expect(tool.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})

describe('internal link graph', () => {
  it('only references tools that exist', () => {
    const known = new Set(TOOLS.map((t) => t.slug))
    for (const tool of TOOLS) {
      for (const related of tool.related) {
        expect(known.has(related), `${tool.slug} -> missing "${related}"`).toBe(true)
      }
    }
  })

  it('never links to itself', () => {
    for (const tool of TOOLS) {
      expect(tool.related, `${tool.slug} links to itself`).not.toContain(tool.slug)
    }
  })

  it('gives every tool at least 3 inbound internal links', () => {
    const inbound = buildInboundMap()
    for (const tool of TOOLS) {
      const count = inbound.get(tool.slug)?.length ?? 0
      expect(
        count,
        `"${tool.slug}" has only ${count} inbound links`,
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('has zero orphans', () => {
    const inbound = buildInboundMap()
    const orphans = TOOLS.filter((t) => (inbound.get(t.slug)?.length ?? 0) === 0)
    expect(orphans.map((o) => o.slug)).toEqual([])
  })

  it('curates 3-6 related tools per tool', () => {
    for (const tool of TOOLS) {
      expect(tool.related.length, tool.slug).toBeGreaterThanOrEqual(3)
      expect(tool.related.length, tool.slug).toBeLessThanOrEqual(6)
    }
  })

  it('has no duplicate entries within a single related list', () => {
    for (const tool of TOOLS) {
      expect(new Set(tool.related).size, tool.slug).toBe(tool.related.length)
    }
  })
})

describe('category coverage', () => {
  it('gives every category at least one tool', () => {
    // Wave 1 deliberately spans all eight categories so the IA and link graph
    // are complete on day one — an empty category page would be a thin page.
    for (const category of CATEGORIES) {
      const count = getToolsByCategory(category.slug).length
      expect(count, `category "${category.slug}" is empty`).toBeGreaterThan(0)
    }
  })

  it('assigns every tool to a real category', () => {
    const known = new Set(CATEGORIES.map((c) => c.slug))
    for (const tool of TOOLS) {
      expect(known.has(tool.category), `${tool.slug} -> ${tool.category}`).toBe(true)
    }
  })
})

describe('implementation completeness', () => {
  it('has a component for every registered tool', () => {
    const implemented = new Set(IMPLEMENTED_TOOL_SLUGS)
    for (const tool of TOOLS) {
      expect(implemented.has(tool.slug), `no component for "${tool.slug}"`).toBe(true)
    }
  })

  it('has no component registered without a registry entry', () => {
    const registered = new Set(TOOLS.map((t) => t.slug))
    for (const slug of IMPLEMENTED_TOOL_SLUGS) {
      expect(registered.has(slug), `component "${slug}" has no registry entry`).toBe(true)
    }
  })

  it('resolves every referenced icon', () => {
    for (const tool of TOOLS) {
      expect(hasIcon(tool.icon), `${tool.slug} -> unknown icon "${tool.icon}"`).toBe(true)
    }
    for (const category of CATEGORIES) {
      expect(hasIcon(category.icon), `${category.slug} -> "${category.icon}"`).toBe(true)
    }
  })
})

describe('content quality gates', () => {
  it('has a hand-written description within meta-description length', () => {
    for (const tool of TOOLS) {
      expect(
        tool.description.length,
        `${tool.slug} description too short`,
      ).toBeGreaterThan(70)
      expect(
        tool.description.length,
        `${tool.slug} description too long`,
      ).toBeLessThanOrEqual(200)
    }
  })

  it('has no two tools sharing a description or title', () => {
    // Templated boilerplate is the doorway-page smell. 15 tools is small enough
    // that every description should be written by hand.
    const descriptions = TOOLS.map((t) => t.description)
    const titles = TOOLS.map((t) => t.title)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('has 3-5 how-to-use steps', () => {
    for (const tool of TOOLS) {
      expect(tool.howToUse.length, tool.slug).toBeGreaterThanOrEqual(3)
      expect(tool.howToUse.length, tool.slug).toBeLessThanOrEqual(5)
    }
  })

  it('explains how it works in real depth', () => {
    for (const tool of TOOLS) {
      expect(
        tool.howItWorks.length,
        `${tool.slug} howItWorks is too thin`,
      ).toBeGreaterThan(200)
    }
  })

  it('states at least two limitations per tool', () => {
    for (const tool of TOOLS) {
      expect(tool.limitations.length, tool.slug).toBeGreaterThanOrEqual(2)
    }
  })

  it('has 3-8 real FAQ entries with substantive answers', () => {
    for (const tool of TOOLS) {
      expect(tool.faq.length, tool.slug).toBeGreaterThanOrEqual(3)
      expect(tool.faq.length, tool.slug).toBeLessThanOrEqual(8)
      for (const item of tool.faq) {
        expect(item.q.endsWith('?'), `${tool.slug}: "${item.q}"`).toBe(true)
        expect(item.a.length, `${tool.slug}: answer to "${item.q}"`).toBeGreaterThan(40)
      }
    }
  })

  it('has at least one keyword per tool', () => {
    for (const tool of TOOLS) {
      expect(tool.keywords.length, tool.slug).toBeGreaterThan(0)
    }
  })
})

describe('cost and ownership discipline', () => {
  it('gives every client-side tool a zero cost ceiling', () => {
    for (const tool of TOOLS) {
      if (tool.runtime === 'client') {
        expect(
          tool.monthlyCostCeiling,
          `${tool.slug} is client-side but has a budget`,
        ).toBe(0)
      }
    }
  })

  it('requires a non-zero cost ceiling for anything that is not client-side', () => {
    // A server, API or LLM tool without a stated ceiling is an unbounded bill.
    for (const tool of TOOLS) {
      if (tool.runtime !== 'client') {
        expect(
          tool.monthlyCostCeiling,
          `${tool.slug} has no cost ceiling`,
        ).toBeGreaterThan(0)
      }
    }
  })

  it('marks runsInBrowser consistently with runtime', () => {
    for (const tool of TOOLS) {
      if (tool.runsInBrowser) expect(tool.runtime, tool.slug).toBe('client')
    }
  })

  it('names an owner for every tool', () => {
    // This is what makes the quarterly pruning policy executable rather than
    // aspirational.
    for (const tool of TOOLS) {
      expect(tool.owner.length, tool.slug).toBeGreaterThan(0)
    }
  })

  it('uses a real ISO date for updatedAt', () => {
    for (const tool of TOOLS) {
      expect(tool.updatedAt, tool.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(tool.updatedAt)), tool.slug).toBe(false)
    }
  })

  it('gives every Tier A tool a service target to convert into', () => {
    for (const tool of TOOLS) {
      if (tool.leadTier === 'A') {
        expect(
          tool.serviceTarget,
          `Tier A tool "${tool.slug}" has no serviceTarget`,
        ).toBeTruthy()
      }
    }
  })
})
