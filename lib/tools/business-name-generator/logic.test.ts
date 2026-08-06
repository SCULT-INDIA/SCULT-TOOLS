import { describe, expect, it } from 'vitest'
import {
  BATCH_SIZE,
  computeBrandabilityScore,
  createRng,
  domainCandidate,
  generateBatch,
  isPronounceable,
  MODERN_SUFFIXES,
  parseShortlist,
  STYLES,
  type StyleId,
  sanitizeKeyword,
  sanitizeKeywords,
  scoreLength,
} from './logic'

const ALL_STYLES: readonly StyleId[] = STYLES.map((s) => s.id)

describe('generateBatch — determinism under a seeded rng', () => {
  it('produces the identical batch for the same seed, for every style', () => {
    for (const style of ALL_STYLES) {
      const a = generateBatch(['coffee'], style, createRng(42))
      const b = generateBatch(['coffee'], style, createRng(42))
      expect(a).toEqual(b)
    }
  })

  it('produces a different brandable batch for a different seed', () => {
    const a = generateBatch(['coffee'], 'brandable', createRng(1))
    const b = generateBatch(['coffee'], 'brandable', createRng(999983))
    expect(a.names.map((n) => n.name)).not.toEqual(b.names.map((n) => n.name))
  })
})

describe('generateBatch — batch shape', () => {
  it('returns a full batch of 12 for every style on a common keyword', () => {
    for (const style of ALL_STYLES) {
      const r = generateBatch(['coffee'], style, createRng(7))
      expect(r.error).toBeUndefined()
      expect(r.names).toHaveLength(BATCH_SIZE)
    }
  })

  it('never repeats a name within a batch (case-insensitive dedupe)', () => {
    for (const style of ALL_STYLES) {
      for (const seed of [3, 11, 12345]) {
        const r = generateBatch(['studio'], style, createRng(seed))
        const keys = r.names.map((n) => n.name.toLowerCase())
        expect(new Set(keys).size).toBe(keys.length)
      }
    }
  })

  it('never returns the bare keyword itself as a name', () => {
    for (const style of ALL_STYLES) {
      const r = generateBatch(['nova'], style, createRng(5))
      expect(r.names.map((n) => n.name.toLowerCase())).not.toContain('nova')
    }
  })

  it('scores and explains every name: how, sayIt and domain are always present', () => {
    for (const style of ALL_STYLES) {
      const r = generateBatch(['market'], style, createRng(9))
      for (const idea of r.names) {
        expect(idea.how.length).toBeGreaterThan(0)
        expect(idea.sayIt.length).toBeGreaterThan(0)
        expect(idea.domain.endsWith('.com')).toBe(true)
        expect(idea.letters).toBeGreaterThan(0)
        expect(typeof idea.pronounceable).toBe('boolean')
      }
    }
  })
})

describe('style contracts', () => {
  it('suffix: every name ends with a known modern suffix', () => {
    const r = generateBatch(['coffee'], 'suffix', createRng(21))
    for (const idea of r.names) {
      const lower = idea.name.toLowerCase()
      expect(MODERN_SUFFIXES.some((s) => lower.endsWith(s))).toBe(true)
    }
  })

  it('compound: every name contains one of the keywords', () => {
    const r = generateBatch(['coffee', 'bean'], 'compound', createRng(31))
    for (const idea of r.names) {
      const lower = idea.name.toLowerCase()
      expect(lower.includes('coffee') || lower.includes('bean')).toBe(true)
    }
  })

  it('alliteration: two real words sharing the keyword’s initial', () => {
    const r = generateBatch(['coffee'], 'alliteration', createRng(41))
    for (const idea of r.names) {
      const words = idea.name.split(' ')
      expect(words).toHaveLength(2)
      for (const w of words) {
        expect(w.toLowerCase().startsWith('c')).toBe(true)
      }
    }
  })

  it('portmanteau: keeps ≥3 chars of the keyword and ends with ≥3 chars of the blend word', () => {
    const r = generateBatch(['coffee'], 'portmanteau', createRng(51))
    expect(r.names.length).toBeGreaterThanOrEqual(5)
    for (const idea of r.names) {
      const lower = idea.name.toLowerCase()
      expect(lower.startsWith('cof')).toBe(true)
      const blendWord = idea.sources[1]
      expect(blendWord).toBeDefined()
      const tail = lower.slice(-3)
      expect(blendWord?.includes(tail)).toBe(true)
    }
  })

  it('portmanteau: a 2-letter keyword cannot blend and reports an error, never throws', () => {
    const r = generateBatch(['ab'], 'portmanteau', createRng(61))
    expect(r.names).toHaveLength(0)
    expect(r.error).toBeDefined()
  })
})

describe('keyword sanitisation and errors', () => {
  it('lowercases and strips non-letters', () => {
    expect(sanitizeKeyword('Coffee Shop!')).toBe('coffeeshop')
    expect(sanitizeKeyword(' Café-9 ')).toBe('caf')
  })

  it('rejects empty input with an error and no names', () => {
    const r = generateBatch(['', '   '], 'brandable', createRng(1))
    expect(r.names).toHaveLength(0)
    expect(r.error).toBeDefined()
  })

  it('rejects garbage that sanitises to under 2 letters', () => {
    expect(generateBatch(['123!!'], 'compound', createRng(1)).error).toBeDefined()
    expect(generateBatch(['a'], 'compound', createRng(1)).error).toBeDefined()
  })

  it('rejects a keyword over 20 letters', () => {
    const r = sanitizeKeywords(['a'.repeat(21)])
    expect(r.error).toContain('too long')
    expect(r.keywords).toHaveLength(0)
  })

  it('skips blank slots and dedupes repeated keywords', () => {
    expect(sanitizeKeywords(['Coffee', '', 'coffee!'])).toEqual({ keywords: ['coffee'] })
  })
})

describe('scoring', () => {
  it('scores length bands at the documented boundaries (≤8 great, ≤12 good)', () => {
    expect(scoreLength('Brandly1')).toEqual({ letters: 7, band: 'great' })
    expect(scoreLength('a'.repeat(8)).band).toBe('great')
    expect(scoreLength('a'.repeat(9)).band).toBe('good')
    expect(scoreLength('a'.repeat(12)).band).toBe('good')
    expect(scoreLength('a'.repeat(13)).band).toBe('long')
  })

  it('counts letters only, ignoring spaces, in two-word names', () => {
    expect(scoreLength('Copper Coffee')).toEqual({ letters: 12, band: 'good' })
  })

  it('flags 3+ consonant clusters as hard to pronounce, allowing common onsets', () => {
    expect(isPronounceable('brand')).toBe(true)
    expect(isPronounceable('strand')).toBe(true)
    expect(isPronounceable('katvrk')).toBe(false)
    expect(isPronounceable('nxtqrk')).toBe(false)
    expect(isPronounceable('')).toBe(false)
  })

  it('builds the exact-match .com candidate from any name shape', () => {
    expect(domainCandidate('Copper Coffee')).toBe('coppercoffee.com')
    expect(domainCandidate('Cofara')).toBe('cofara.com')
  })
})

describe('computeBrandabilityScore', () => {
  it('scores 100 when every check passes', () => {
    const r = generateBatch(['coffee'], 'brandable', createRng(3))
    const idea = r.names.find((n) => n.pronounceable && n.lengthBand !== 'long')
    expect(idea).toBeDefined()
    if (idea === undefined) return
    const result = computeBrandabilityScore(idea)
    expect(result.score).toBe(100)
    expect(result.checks.every((c) => c.pass)).toBe(true)
  })

  it('never disagrees with the fields it was computed from', () => {
    for (const style of ALL_STYLES) {
      const r = generateBatch(['market'], style, createRng(9))
      for (const idea of r.names) {
        const result = computeBrandabilityScore(idea)
        const lengthCheck = result.checks.find((c) => c.id === 'length')
        const pronounceableCheck = result.checks.find((c) => c.id === 'pronounceable')
        const singleWordCheck = result.checks.find((c) => c.id === 'single-word')
        expect(lengthCheck?.pass).toBe(idea.lengthBand !== 'long')
        expect(pronounceableCheck?.pass).toBe(idea.pronounceable)
        expect(singleWordCheck?.pass).toBe(!idea.name.includes(' '))
        expect(result.score).toBe(
          Math.round(
            (result.checks.filter((c) => c.pass).length / result.checks.length) * 100,
          ),
        )
      }
    }
  })

  it('scores lower for a long, tricky-to-say name than a short, easy one', () => {
    const easy = generateBatch(['coffee'], 'brandable', createRng(3)).names.find(
      (n) => n.pronounceable && n.lengthBand === 'great',
    )
    const hard = generateBatch(['coffee'], 'alliteration', createRng(41)).names.find(
      (n) => n.name.includes(' '),
    )
    expect(easy).toBeDefined()
    expect(hard).toBeDefined()
    if (easy === undefined || hard === undefined) return
    expect(computeBrandabilityScore(easy).score).toBeGreaterThan(
      computeBrandabilityScore(hard).score,
    )
  })
})

describe('parseShortlist — untrusted localStorage input', () => {
  it('accepts a clean array of names and dedupes it', () => {
    expect(parseShortlist(['Cofara', 'CoffeeHub', 'Cofara'])).toEqual([
      'Cofara',
      'CoffeeHub',
    ])
  })

  it('rejects non-arrays and arrays containing non-strings', () => {
    expect(parseShortlist(null)).toBeUndefined()
    expect(parseShortlist('Cofara')).toBeUndefined()
    expect(parseShortlist([1, 'Cofara'])).toBeUndefined()
    expect(parseShortlist({ 0: 'Cofara' })).toBeUndefined()
  })

  it('drops blank and oversized entries instead of failing the whole list', () => {
    expect(parseShortlist(['  ', 'Cofara', 'x'.repeat(50)])).toEqual(['Cofara'])
  })
})
