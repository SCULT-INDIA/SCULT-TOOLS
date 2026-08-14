import { describe, expect, it } from 'vitest'
import { PROMPTS } from './registry'

/**
 * Slug integrity for the prompt catalogue — the same guarantee
 * `lib/tools/registry.test.ts` and `lib/guides/registry.test.ts` already
 * enforce for their own registries, missing here until now.
 *
 * `PROMPT_BY_SLUG`/`getPrompt(slug)` in ./registry.ts key on slug ALONE, not
 * on (category, slug) — so a slug reused across two of the 46 independently
 * authored `prompts.ts` files wouldn't create a duplicate URL, it would make
 * one of the two routes silently unreachable (`generateStaticParams` would
 * still emit both paths, but both would resolve to whichever prompt
 * `PROMPT_BY_SLUG` happened to keep). This test is what turns that into a
 * build-time failure instead of a production 404 nobody notices.
 */
describe('slug integrity', () => {
  it('has no duplicate prompt slugs across categories', () => {
    const slugs = PROMPTS.map((p) => p.slug)
    const seen = new Set<string>()
    const duplicates = new Set<string>()
    for (const slug of slugs) {
      if (seen.has(slug)) duplicates.add(slug)
      seen.add(slug)
    }
    expect([...duplicates], 'duplicate prompt slugs').toEqual([])
  })

  it('uses only url-safe lowercase kebab-case slugs', () => {
    for (const prompt of PROMPTS) {
      expect(prompt.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})
