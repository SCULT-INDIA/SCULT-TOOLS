import { describe, expect, it } from 'vitest'
import {
  adFit,
  allSlogansForTone,
  articleFor,
  createSeededRng,
  generateSlogans,
  parseShortlist,
  sanitizeKeyword,
  TONES,
} from './logic'

const BASE = { keyword: 'Bloom', noun: 'marketing', tone: 'friendly' } as const

describe('generateSlogans — batches', () => {
  it('returns 10 slogans by default', () => {
    const r = generateSlogans({ ...BASE, rng: createSeededRng(1) })
    expect(r.error).toBeUndefined()
    expect(r.slogans).toHaveLength(10)
    expect(new Set(r.slogans).size).toBe(10)
  })

  it('is deterministic under a seeded rng', () => {
    const a = generateSlogans({ ...BASE, rng: createSeededRng(42) })
    const b = generateSlogans({ ...BASE, rng: createSeededRng(42) })
    expect(a.slogans).toEqual(b.slogans)
  })

  it('produces a different order for a different seed', () => {
    const a = generateSlogans({ ...BASE, rng: createSeededRng(1) })
    const b = generateSlogans({ ...BASE, rng: createSeededRng(99) })
    expect(a.slogans).not.toEqual(b.slogans)
  })

  it('respects a custom count', () => {
    const r = generateSlogans({ ...BASE, rng: createSeededRng(1), count: 3 })
    expect(r.slogans).toHaveLength(3)
  })
})

describe('generateSlogans — tone contract', () => {
  it('only ever emits lines from the selected tone bank', () => {
    for (const tone of TONES) {
      const bank = new Set(
        allSlogansForTone({ keyword: 'Bloom', noun: 'marketing', tone: tone.id }).slogans,
      )
      const batch = generateSlogans({
        keyword: 'Bloom',
        noun: 'marketing',
        tone: tone.id,
        rng: createSeededRng(7),
      })
      expect(batch.slogans.length).toBeGreaterThan(0)
      for (const slogan of batch.slogans) {
        expect(bank.has(slogan)).toBe(true)
      }
    }
  })

  it('every tone bank has at least 12 templates even without a noun', () => {
    for (const tone of TONES) {
      const withoutNoun = allSlogansForTone({ keyword: 'Bloom', tone: tone.id })
      expect(withoutNoun.slogans.length).toBeGreaterThanOrEqual(12)
      const withNoun = allSlogansForTone({
        keyword: 'Bloom',
        noun: 'marketing',
        tone: tone.id,
      })
      expect(withNoun.slogans.length).toBeGreaterThan(withoutNoun.slogans.length)
    }
  })

  it('drops noun templates rather than rendering a blank when no noun is given', () => {
    const r = allSlogansForTone({ keyword: 'Bloom', tone: 'bold' })
    for (const slogan of r.slogans) {
      expect(slogan).not.toContain('{')
      expect(slogan).not.toContain('  ')
    }
  })
})

describe('generateSlogans — exclusion', () => {
  it('never repeats an excluded slogan', () => {
    const first = generateSlogans({ ...BASE, rng: createSeededRng(1) })
    const second = generateSlogans({
      ...BASE,
      rng: createSeededRng(2),
      exclude: first.slogans,
    })
    for (const slogan of second.slogans) {
      expect(first.slogans).not.toContain(slogan)
    }
  })

  it('returns an empty batch, not an error, when everything is excluded', () => {
    const bank = allSlogansForTone(BASE).slogans
    const r = generateSlogans({ ...BASE, rng: createSeededRng(1), exclude: bank })
    expect(r.error).toBeUndefined()
    expect(r.slogans).toHaveLength(0)
  })
})

describe('sanitisation and capitalisation', () => {
  it('collapses whitespace runs in the keyword', () => {
    const r = generateSlogans({
      keyword: '  Bloom    Labs ',
      tone: 'minimal',
      rng: createSeededRng(1),
    })
    expect(r.error).toBeUndefined()
    expect(r.slogans.some((s) => s.includes('Bloom Labs'))).toBe(true)
    expect(r.slogans.every((s) => !s.includes('  '))).toBe(true)
  })

  it('rejects a keyword shorter than 2 chars or longer than 30', () => {
    const short = generateSlogans({ keyword: 'x', tone: 'bold', rng: createSeededRng(1) })
    expect(short.error).toBeDefined()
    expect(short.slogans).toHaveLength(0)
    const long = generateSlogans({
      keyword: 'a'.repeat(31),
      tone: 'bold',
      rng: createSeededRng(1),
    })
    expect(long.error).toBeDefined()
    expect(sanitizeKeyword('ok').error).toBeUndefined()
    expect(sanitizeKeyword('').error).toBeDefined()
  })

  it('rejects a noun longer than 30 chars', () => {
    const r = generateSlogans({
      keyword: 'Bloom',
      noun: 'n'.repeat(31),
      tone: 'friendly',
      rng: createSeededRng(1),
    })
    expect(r.error).toBeDefined()
  })

  it('capitalises the keyword when it opens a sentence, keeps it as typed mid-sentence', () => {
    const bank = allSlogansForTone({ keyword: 'acme', tone: 'bold' }).slogans
    expect(bank).toContain('Acme. Finally done right.')
    expect(bank).toContain('Stop settling. Start with acme.')
  })
})

describe('articleFor — a/an by vowel sound', () => {
  it('uses "an" before vowel sounds and "a" before consonant sounds', () => {
    expect(articleFor('agency')).toBe('an')
    expect(articleFor('bakery')).toBe('a')
    expect(articleFor('hour')).toBe('an')
    expect(articleFor('honest broker')).toBe('an')
    expect(articleFor('university')).toBe('a')
    expect(articleFor('one-stop shop')).toBe('a')
  })

  it('inflects the article inside a template', () => {
    const withVowel = allSlogansForTone({
      keyword: 'Bloom',
      noun: 'agency',
      tone: 'premium',
    }).slogans
    expect(withVowel).toContain('Not just an agency. A signature.')
    const withConsonant = allSlogansForTone({
      keyword: 'Bloom',
      noun: 'bakery',
      tone: 'premium',
    }).slogans
    expect(withConsonant).toContain('Not just a bakery. A signature.')
  })
})

describe('adFit — Google Ads badge boundaries', () => {
  it('flips the headline badge exactly at 30 characters', () => {
    expect(adFit('x'.repeat(30))).toEqual({
      chars: 30,
      headline: true,
      description: true,
    })
    expect(adFit('x'.repeat(31)).headline).toBe(false)
    expect(adFit('x'.repeat(31)).description).toBe(true)
  })

  it('flips the description badge exactly at 90 characters', () => {
    expect(adFit('x'.repeat(90)).description).toBe(true)
    expect(adFit('x'.repeat(91)).description).toBe(false)
    expect(adFit('x'.repeat(91)).chars).toBe(91)
  })
})

describe('parseShortlist — untrusted localStorage input', () => {
  it('accepts an array of sane strings', () => {
    expect(parseShortlist(['Bloom. Say less.'])).toEqual(['Bloom. Say less.'])
  })

  it('rejects non-arrays, non-strings, and oversized entries', () => {
    expect(parseShortlist('nope')).toBeUndefined()
    expect(parseShortlist([42])).toBeUndefined()
    expect(parseShortlist(['x'.repeat(201)])).toBeUndefined()
    expect(parseShortlist(null)).toBeUndefined()
  })
})
