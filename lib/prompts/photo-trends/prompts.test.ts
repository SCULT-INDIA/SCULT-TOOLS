import { describe, expect, it } from 'vitest'
import { prompts } from './prompts'

/**
 * Category-specific invariants for Photo Trends, on top of the site-wide
 * gates `lib/prompts/registry.test.ts` already runs (global slug uniqueness,
 * kebab-case). This category's whole layout depends on properties those
 * gates don't check, and a routine future edit — someone adding a 41st
 * prompt, or "fixing" one of these to look more like the rest of the
 * library — could reintroduce exactly the defects this category was built
 * to avoid without any other test noticing:
 *
 *  - a stray `variables` entry would put a Customize form in front of the
 *    one-tap copy action this category exists for (PromptCopyBlock only
 *    omits that panel when `variables` is empty)
 *  - a leftover `{{placeholder}}` would ship broken text to the copy button
 *    with no variable declared to fill it
 *  - a pasted `--ar`/`--v` Midjourney flag is read as literal garbage text
 *    by ChatGPT and Gemini, the two documented failure this whole category
 *    is written to avoid (see the two real competitors' pages that ship it)
 *  - a missing exampleImage silently reverts a prompt to the text-only card
 *    layout, defeating the picture-grid category page
 */
describe('photo-trends prompts', () => {
  it('ships exactly the 40 prompts this category was built with', () => {
    expect(prompts).toHaveLength(40)
  })

  it('is entirely one category, never mixed in with another', () => {
    for (const p of prompts) {
      expect(p.category, p.slug).toBe('photo-trends')
    }
  })

  it('has zero variables on every prompt — no Customize panel, ever', () => {
    for (const p of prompts) {
      expect(p.variables, p.slug).toEqual([])
    }
  })

  it('leaves no {{placeholder}} in a promptText with no variables to fill it', () => {
    for (const p of prompts) {
      expect(p.promptText, p.slug).not.toMatch(/\{\{/)
    }
  })

  it('never carries a Midjourney flag, which ChatGPT and Gemini read as literal text', () => {
    for (const p of prompts) {
      expect(p.promptText, p.slug).not.toMatch(/--ar\b|--v\s+\d|--style\b|--chaos\b/)
    }
  })

  it('opens every prompt with the identity lock, before any styling detail', () => {
    // Every prompt opens "Use my uploaded photo" — solo prompts go straight
    // into "keep my face exactly as it is", group prompts (couples/family)
    // need a headcount/position lock first ("which has two people in it.
    // Anchor each face...", "Count the people in it... Anchor each face...")
    // since that is the group-specific failure mode §1 of the research
    // brief names alongside face drift. Both shapes are the identity lock
    // this test guards — what matters is that it is the OPENING clause, not
    // buried after paragraphs of era detail.
    const opensWithLock =
      /^use my uploaded photo\b[^.]*\.\s*(keep my face|anchor each|count the people)/i
    for (const p of prompts) {
      expect(p.promptText.slice(0, 220), p.slug).toMatch(opensWithLock)
    }
  })

  it('states its aspect ratio in words, never as a flag', () => {
    for (const p of prompts) {
      expect(p.promptText, p.slug).toMatch(
        /vertical 9:16|9:16 portrait|3:4|4:3|16:9|horizontal/i,
      )
    }
  })

  it('has a real, distinct example image for every prompt', () => {
    const seen = new Set<string>()
    for (const p of prompts) {
      expect(p.exampleImage, p.slug).toBeDefined()
      const src = p.exampleImage?.src ?? ''
      expect(src, p.slug).toMatch(/^\/prompt-images\/photo-trends\/[a-z0-9-]+\.webp$/)
      expect(seen.has(src), `duplicate exampleImage.src: ${src}`).toBe(false)
      seen.add(src)
      expect(p.exampleImage?.alt.length ?? 0, p.slug).toBeGreaterThan(20)
    }
  })

  it('gives every image a valid, real aspect ratio when one is stated', () => {
    const valid = new Set(['9:16', '3:4', '4:3', '16:9'])
    for (const p of prompts) {
      const ratio = p.exampleImage?.aspectRatio
      if (ratio !== undefined) expect(valid.has(ratio), p.slug).toBe(true)
    }
  })

  it('carries a short whyItWorks — the long explanation lives in the blog, not here', () => {
    for (const p of prompts) {
      const words = p.whyItWorks.trim().split(/\s+/).length
      // The handover's own target is 60-90 words; kept generous (200) so
      // this guards against a real regression (someone pasting in a
      // paragraph-length explanation) without being brittle against minor
      // future rewording.
      expect(words, p.slug).toBeLessThanOrEqual(200)
      expect(words, p.slug).toBeGreaterThan(10)
    }
  })

  it('has at least one verifiedAgainst entry and at least one changelog entry', () => {
    for (const p of prompts) {
      expect(p.verifiedAgainst.length, p.slug).toBeGreaterThan(0)
      expect(p.changelog.length, p.slug).toBeGreaterThan(0)
    }
  })

  it('never sets serviceTarget or relatedToolSlug — this category has no CTA tie-in', () => {
    for (const p of prompts) {
      expect(p.serviceTarget, p.slug).toBeUndefined()
      expect(p.relatedToolSlug, p.slug).toBeUndefined()
    }
  })
})
