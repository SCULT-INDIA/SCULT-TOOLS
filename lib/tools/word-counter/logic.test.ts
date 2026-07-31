import { describe, expect, it } from 'vitest'
import { analyzeText, bigramDensity, formatDuration } from './logic'

describe('analyzeText — empty and degenerate input', () => {
  it('returns zeroes (never NaN) for empty text', () => {
    const r = analyzeText('')
    expect(r.words).toBe(0)
    expect(r.chars).toBe(0)
    expect(r.charsNoSpaces).toBe(0)
    expect(r.sentences).toBe(0)
    expect(r.paragraphs).toBe(0)
    expect(r.readingMinutes).toBe(0)
    expect(r.speakingMinutes).toBe(0)
    expect(r.avgWordLength).toBe(0)
    expect(r.avgSentenceWords).toBe(0)
    expect(r.longestSentence).toEqual({ text: '', words: 0 })
    expect(r.density).toEqual([])
    for (const value of [r.avgWordLength, r.avgSentenceWords, r.readingMinutes]) {
      expect(Number.isNaN(value)).toBe(false)
    }
  })

  it('treats whitespace-only text as empty', () => {
    const r = analyzeText('   \n\n  \t ')
    expect(r.words).toBe(0)
    expect(r.sentences).toBe(0)
    expect(r.paragraphs).toBe(0)
    expect(r.charsNoSpaces).toBe(0)
  })
})

describe('analyzeText — word counting', () => {
  it('counts plain words', () => {
    expect(analyzeText('Hello world').words).toBe(2)
  })

  it('is not inflated by runs of spaces and newlines', () => {
    expect(analyzeText('one   two \n\n three\t four').words).toBe(4)
  })

  it("counts a contraction like don't as one word, not two", () => {
    expect(analyzeText("Don't stop").words).toBe(2)
  })

  it('counts CJK text without spaces as multiple words, unlike a naive split', () => {
    const r = analyzeText('你好世界')
    expect(r.words).toBeGreaterThanOrEqual(2)
    // A split-on-spaces counter would report 1 here.
    expect('你好世界'.split(/\s+/).length).toBe(1)
  })
})

describe('analyzeText — grapheme-cluster character counting', () => {
  it('counts an emoji as one character, not its UTF-16 length', () => {
    const r = analyzeText('👍')
    expect(r.chars).toBe(1)
    expect('👍'.length).toBe(2) // the naive count this tool avoids
  })

  it('counts a ZWJ family emoji as a single grapheme', () => {
    expect(analyzeText('a👩‍👩‍👧‍👦b').chars).toBe(3)
  })

  it('separates characters with and without spaces', () => {
    const r = analyzeText('ab cd')
    expect(r.chars).toBe(5)
    expect(r.charsNoSpaces).toBe(4)
  })
})

describe('analyzeText — sentences and paragraphs', () => {
  it('splits sentences on ., ! and ?', () => {
    expect(analyzeText('One two. Three four! Five six?').sentences).toBe(3)
  })

  it('counts paragraphs on blank lines, not single newlines', () => {
    const text = 'First line\nstill first paragraph\n\nSecond paragraph'
    const r = analyzeText(text)
    expect(r.paragraphs).toBe(2)
  })

  it('ignores leading, trailing and repeated blank lines for paragraphs', () => {
    expect(analyzeText('\n\nOnly paragraph\n\n\n\n').paragraphs).toBe(1)
  })

  it('flags the longest sentence with its word count', () => {
    const r = analyzeText(
      'Short one. This sentence here is clearly much longer than that. Tiny.',
    )
    expect(r.longestSentence.words).toBe(9)
    expect(r.longestSentence.text).toContain('clearly much longer')
  })

  it('computes average sentence length in words', () => {
    // 2 + 4 = 6 words over 2 sentences.
    expect(analyzeText('One two. Three four five six.').avgSentenceWords).toBe(3)
  })
})

describe('analyzeText — reading and speaking time', () => {
  it('reads 238 words in exactly 1 minute', () => {
    const text = Array.from({ length: 238 }, () => 'word').join(' ')
    expect(analyzeText(text).readingMinutes).toBeCloseTo(1, 10)
  })

  it('speaks 260 words in exactly 2 minutes', () => {
    const text = Array.from({ length: 260 }, () => 'word').join(' ')
    expect(analyzeText(text).speakingMinutes).toBeCloseTo(2, 10)
  })

  it('returns a positive fraction (not 0) for short text', () => {
    const r = analyzeText('Just a few words here.')
    expect(r.readingMinutes).toBeGreaterThan(0)
    expect(r.readingMinutes).toBeLessThan(1)
  })
})

describe('formatDuration — display rounding', () => {
  it('never shows "0 min" for short-but-real text', () => {
    expect(formatDuration(0.04)).toBe('< 1 min')
    expect(formatDuration(0.9)).toBe('< 1 min')
  })

  it('shows 0 min only for zero, and rounds whole minutes', () => {
    expect(formatDuration(0)).toBe('0 min')
    expect(formatDuration(1.2)).toBe('1 min')
    expect(formatDuration(2.6)).toBe('3 min')
  })

  it('rolls over to hours', () => {
    expect(formatDuration(60)).toBe('1 hr')
    expect(formatDuration(65.4)).toBe('1 hr 5 min')
  })

  it('handles non-finite input defensively', () => {
    expect(formatDuration(Number.NaN)).toBe('0 min')
    expect(formatDuration(-3)).toBe('0 min')
  })
})

describe('analyzeText — keyword density', () => {
  it('filters stopwords and counts case-insensitively', () => {
    const r = analyzeText('The quick fox and the lazy Fox jumped over the fox')
    const terms = r.density.map((d) => d.term)
    expect(terms).not.toContain('the')
    expect(terms).not.toContain('and')
    expect(terms).not.toContain('over')
    const fox = r.density.find((d) => d.term === 'fox')
    expect(fox?.count).toBe(3)
  })

  it('excludes terms shorter than 3 characters', () => {
    const r = analyzeText('go go go running running fast')
    const terms = r.density.map((d) => d.term)
    expect(terms).not.toContain('go')
    expect(terms).toContain('running')
  })

  it('orders by count descending, then alphabetically for ties', () => {
    const r = analyzeText('zebra apple zebra apple banana zebra')
    expect(r.density.map((d) => d.term)).toEqual(['zebra', 'apple', 'banana'])
  })

  it('computes pct as share of ALL words, rounded to 1 decimal', () => {
    // 8 words total, 'marketing' appears twice → 25%.
    const r = analyzeText('marketing plan for marketing teams shipping campaigns daily')
    const entry = r.density.find((d) => d.term === 'marketing')
    expect(entry?.pct).toBe(25)
  })

  it('caps the ranking at the top 10 terms', () => {
    const words = [
      'alpha',
      'bravo',
      'charlie',
      'delta',
      'echo',
      'foxtrot',
      'golf',
      'hotel',
      'india',
      'juliett',
      'kilo',
      'lima',
    ]
    const r = analyzeText(words.join(' '))
    expect(r.density).toHaveLength(10)
  })
})

describe('bigramDensity — two-word phrases', () => {
  it('extracts repeated two-word phrases', () => {
    const r = bigramDensity('Keyword density matters. Keyword density is a signal.')
    const top = r[0]
    expect(top?.term).toBe('keyword density')
    expect(top?.count).toBe(2)
  })

  it('drops pairs containing a stopword', () => {
    const r = bigramDensity('the plan of the year for the team')
    const terms = r.map((d) => d.term)
    expect(terms).not.toContain('of the')
    expect(terms).not.toContain('the plan')
  })

  it('does not build pairs across a sentence boundary', () => {
    const r = bigramDensity('Alpha beta. Gamma delta.')
    const terms = r.map((d) => d.term)
    expect(terms).toContain('alpha beta')
    expect(terms).toContain('gamma delta')
    expect(terms).not.toContain('beta gamma')
  })

  it('returns an empty ranking for empty text', () => {
    expect(bigramDensity('')).toEqual([])
  })
})

describe('analyzeText — averages', () => {
  it('computes average word length in characters, rounded to 1 decimal', () => {
    // 'cat' (3) + 'horse' (5) = 8 / 2 words = 4.
    expect(analyzeText('cat horse').avgWordLength).toBe(4)
  })

  it('rounds averages to one decimal place', () => {
    // 'cat' (3) + 'bird' (4) = 7 / 2 = 3.5.
    expect(analyzeText('cat bird').avgWordLength).toBe(3.5)
  })
})
