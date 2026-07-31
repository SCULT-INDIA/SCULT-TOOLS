/**
 * Text analysis for the word counter.
 *
 * Purpose
 *   Count words, characters, sentences and paragraphs the way Unicode defines
 *   them (UAX #29), not the way `split(' ')` approximates them — so "don't" is
 *   one word, CJK text without spaces still gets a word count, and a
 *   multi-code-point emoji counts as one character.
 *
 * Inputs   arbitrary text, re-analysed on every keystroke. Empty and
 *          half-typed input are the normal case.
 * Outputs  a TextStats object of plain numbers plus a keyword-density ranking.
 *          Every field is a finite number — never NaN, never a throw.
 * Failure  none by design: any string (including '') yields a complete result
 *          with zeroes where nothing can be counted.
 *
 * Segmentation uses `Intl.Segmenter` behind a capability check with a regex
 * fallback, so the functions stay pure and runnable in any JS environment.
 * No React, no DOM, no I/O.
 */

/** Average adult silent-reading rate (Brysbaert 2019 meta-analysis), wpm. */
export const READING_WPM = 238

/** Typical conversational speaking rate, wpm. */
export const SPEAKING_WPM = 130

export interface DensityEntry {
  readonly term: string
  readonly count: number
  /** Share of the denominator (total words, or total adjacent pairs for bigrams), 0–100. */
  readonly pct: number
}

export interface LongestSentence {
  readonly text: string
  readonly words: number
}

export interface TextStats {
  readonly words: number
  /** Grapheme clusters, so one emoji (even a ZWJ family) is one character. */
  readonly chars: number
  readonly charsNoSpaces: number
  readonly sentences: number
  /** Blocks separated by blank lines. */
  readonly paragraphs: number
  /** Exact minutes at READING_WPM; display rounding is the caller's job. */
  readonly readingMinutes: number
  /** Exact minutes at SPEAKING_WPM. */
  readonly speakingMinutes: number
  /** Mean word length in code points, rounded to 1 decimal. */
  readonly avgWordLength: number
  /** Mean words per sentence, rounded to 1 decimal. */
  readonly avgSentenceWords: number
  readonly longestSentence: LongestSentence
  /** Top 10 non-stopword terms of 3+ characters, by count then A–Z. */
  readonly density: readonly DensityEntry[]
}

/** Character limits the component renders as live remaining-count badges. */
export interface PlatformLimit {
  readonly name: string
  readonly limit: number
}

export const PLATFORM_LIMITS: readonly PlatformLimit[] = [
  { name: 'X post', limit: 280 },
  { name: 'Meta title', limit: 60 },
  { name: 'Meta description', limit: 155 },
  { name: 'LinkedIn post', limit: 3000 },
]

/**
 * English stopwords excluded from keyword density. Standard list (articles,
 * pronouns, auxiliaries, common contractions); lookups normalise curly
 * apostrophes to straight ones first.
 */
const STOPWORDS: ReadonlySet<string> = new Set([
  'a',
  'about',
  'above',
  'after',
  'again',
  'against',
  'all',
  'also',
  'am',
  'an',
  'and',
  'any',
  'are',
  "aren't",
  'as',
  'at',
  'be',
  'because',
  'been',
  'before',
  'being',
  'below',
  'between',
  'both',
  'but',
  'by',
  'can',
  "can't",
  'cannot',
  'could',
  "couldn't",
  'did',
  "didn't",
  'do',
  'does',
  "doesn't",
  'doing',
  "don't",
  'down',
  'during',
  'each',
  'few',
  'for',
  'from',
  'further',
  'had',
  "hadn't",
  'has',
  "hasn't",
  'have',
  "haven't",
  'having',
  'he',
  "he'd",
  "he'll",
  "he's",
  'her',
  'here',
  "here's",
  'hers',
  'herself',
  'him',
  'himself',
  'his',
  'how',
  "how's",
  'i',
  "i'd",
  "i'll",
  "i'm",
  "i've",
  'if',
  'in',
  'into',
  'is',
  "isn't",
  'it',
  "it's",
  'its',
  'itself',
  'just',
  "let's",
  'me',
  'more',
  'most',
  "mustn't",
  'my',
  'myself',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'on',
  'once',
  'only',
  'or',
  'other',
  'ought',
  'our',
  'ours',
  'ourselves',
  'out',
  'over',
  'own',
  'same',
  "shan't",
  'she',
  "she'd",
  "she'll",
  "she's",
  'should',
  "shouldn't",
  'so',
  'some',
  'such',
  'than',
  'that',
  "that's",
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'there',
  "there's",
  'these',
  'they',
  "they'd",
  "they'll",
  "they're",
  "they've",
  'this',
  'those',
  'through',
  'to',
  'too',
  'under',
  'until',
  'up',
  'very',
  'was',
  "wasn't",
  'we',
  "we'd",
  "we'll",
  "we're",
  "we've",
  'were',
  "weren't",
  'what',
  "what's",
  'when',
  "when's",
  'where',
  "where's",
  'which',
  'while',
  'who',
  "who's",
  'whom',
  'why',
  "why's",
  'will',
  'with',
  "won't",
  'would',
  "wouldn't",
  'you',
  "you'd",
  "you'll",
  "you're",
  "you've",
  'your',
  'yours',
  'yourself',
  'yourselves',
])

type Granularity = 'grapheme' | 'word' | 'sentence'

/**
 * Lazily constructed, cached segmenters. `Intl.Segmenter` shipped in every
 * evergreen browser by 2024 but the capability check keeps the module safe in
 * older engines, where the regex fallbacks below take over.
 */
const segmenterCache: Partial<Record<Granularity, Intl.Segmenter | null>> = {}

function getSegmenter(granularity: Granularity): Intl.Segmenter | undefined {
  const cached = segmenterCache[granularity]
  if (cached !== undefined) return cached ?? undefined
  let segmenter: Intl.Segmenter | null = null
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    try {
      segmenter = new Intl.Segmenter('en', { granularity })
    } catch {
      segmenter = null
    }
  }
  segmenterCache[granularity] = segmenter
  return segmenter ?? undefined
}

/** Fallback tokeniser: letter/number runs, keeping in-word apostrophes and hyphens. */
const FALLBACK_WORD_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu

/** A "sentence" must contain at least one letter or digit to count. */
const HAS_CONTENT = /[\p{L}\p{N}]/u

const WHITESPACE_ONLY = /^\s+$/

function wordTokens(text: string): string[] {
  const segmenter = getSegmenter('word')
  if (segmenter) {
    const tokens: string[] = []
    for (const part of segmenter.segment(text)) {
      if (part.isWordLike === true) tokens.push(part.segment)
    }
    return tokens
  }
  return text.match(FALLBACK_WORD_RE) ?? []
}

function countGraphemes(text: string): { chars: number; charsNoSpaces: number } {
  let chars = 0
  let charsNoSpaces = 0
  const segmenter = getSegmenter('grapheme')
  if (segmenter) {
    for (const part of segmenter.segment(text)) {
      chars += 1
      if (!WHITESPACE_ONLY.test(part.segment)) charsNoSpaces += 1
    }
  } else {
    // Code points, not UTF-16 units: '👍' is still 1 here, though ZWJ
    // sequences degrade to their component count without the Segmenter.
    for (const codePoint of text) {
      chars += 1
      if (!WHITESPACE_ONLY.test(codePoint)) charsNoSpaces += 1
    }
  }
  return { chars, charsNoSpaces }
}

function sentenceList(text: string): string[] {
  const sentences: string[] = []
  const segmenter = getSegmenter('sentence')
  if (segmenter) {
    for (const part of segmenter.segment(text)) {
      const trimmed = part.segment.trim()
      if (HAS_CONTENT.test(trimmed)) sentences.push(trimmed)
    }
    return sentences
  }
  for (const piece of text.split(/[.!?…]+|\n+/)) {
    const trimmed = piece.trim()
    if (HAS_CONTENT.test(trimmed)) sentences.push(trimmed)
  }
  return sentences
}

function paragraphCount(text: string): number {
  let count = 0
  for (const block of text.split(/\n\s*\n/)) {
    if (block.trim() !== '') count += 1
  }
  return count
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/’/g, "'")
}

/** Code-point length, so 'café' is 4 whether composed or not-quite. */
function codePointLength(value: string): number {
  return Array.from(value).length
}

function isCountableTerm(term: string): boolean {
  return !STOPWORDS.has(term) && codePointLength(term) >= 3
}

/**
 * Turns a term→count map into the top-10 ranking. Ties break alphabetically
 * so the output is deterministic — the table must not reshuffle mid-keystroke.
 */
function rankDensity(
  counts: ReadonlyMap<string, number>,
  denominator: number,
): DensityEntry[] {
  const entries: DensityEntry[] = []
  for (const [term, count] of counts) {
    entries.push({
      term,
      count,
      pct: denominator === 0 ? 0 : round1((count / denominator) * 100),
    })
  }
  entries.sort((a, b) => b.count - a.count || a.term.localeCompare(b.term, 'en'))
  return entries.slice(0, 10)
}

/**
 * Full analysis pass. Single O(n) walk per metric family: words are tokenised
 * once for counting, averages and unigram density; sentences are segmented
 * once and re-tokenised only to find the longest.
 */
export function analyzeText(text: string): TextStats {
  const tokens = wordTokens(text)
  const words = tokens.length
  const { chars, charsNoSpaces } = countGraphemes(text)
  const sentences = sentenceList(text)
  const paragraphs = paragraphCount(text)

  let longestSentence: LongestSentence = { text: '', words: 0 }
  for (const sentence of sentences) {
    const sentenceWords = wordTokens(sentence).length
    if (sentenceWords > longestSentence.words) {
      longestSentence = { text: sentence, words: sentenceWords }
    }
  }

  let letterTotal = 0
  const counts = new Map<string, number>()
  for (const raw of tokens) {
    letterTotal += codePointLength(raw)
    const term = normalizeToken(raw)
    if (!isCountableTerm(term)) continue
    counts.set(term, (counts.get(term) ?? 0) + 1)
  }

  return {
    words,
    chars,
    charsNoSpaces,
    sentences: sentences.length,
    paragraphs,
    readingMinutes: words / READING_WPM,
    speakingMinutes: words / SPEAKING_WPM,
    avgWordLength: words === 0 ? 0 : round1(letterTotal / words),
    avgSentenceWords: sentences.length === 0 ? 0 : round1(words / sentences.length),
    longestSentence,
    density: rankDensity(counts, words),
  }
}

/**
 * Two-word phrase density. Pairs are formed from adjacent words *within* a
 * sentence — "…the end. New beginning…" must not yield "end new". A pair is
 * dropped when either word is a stopword, which is what surfaces "keyword
 * density" while suppressing "of the". `pct` is the phrase's share of all
 * adjacent pairs, since that is the population a bigram is drawn from.
 */
export function bigramDensity(text: string): DensityEntry[] {
  const counts = new Map<string, number>()
  let totalPairs = 0
  for (const sentence of sentenceList(text)) {
    let prev: string | undefined
    for (const raw of wordTokens(sentence)) {
      const term = normalizeToken(raw)
      if (prev !== undefined) {
        totalPairs += 1
        if (!STOPWORDS.has(prev) && !STOPWORDS.has(term)) {
          const phrase = `${prev} ${term}`
          counts.set(phrase, (counts.get(phrase) ?? 0) + 1)
        }
      }
      prev = term
    }
  }
  return rankDensity(counts, totalPairs)
}

/**
 * Display formatting for reading/speaking time. Anything over zero but under
 * a minute reads "< 1 min" — a short paragraph must never claim "0 min".
 */
export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return '0 min'
  if (minutes < 1) return '< 1 min'
  const rounded = Math.max(1, Math.round(minutes))
  if (rounded < 60) return `${rounded} min`
  const hours = Math.floor(rounded / 60)
  const rest = rounded % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}
