/**
 * Business name generation.
 *
 * Purpose
 *   Turn one or two keywords into batches of candidate business names using
 *   five transparent, deterministic strategies: brandable (syllable
 *   recombination on the keyword's root), compound (keyword + real word),
 *   modern suffix (-ly, -ify, -io…), portmanteau (keyword spliced into a real
 *   word at a shared letter) and alliteration (paired real words on the
 *   keyword's initial). This is combinatorial generation over curated word
 *   banks — no AI, no network — which is what makes it instant and private.
 *
 * Inputs   raw keyword strings (sanitised here), a style id, and an injected
 *          `rng: () => number` so every batch is reproducible under a seed.
 * Outputs  a BatchResult of scored NameIdea entries; each carries an honest
 *          `how` line explaining exactly how it was formed.
 * Failure  invalid or half-typed keywords NEVER throw — the batch comes back
 *          with `error` set and an empty list, because the caller re-renders
 *          on every keystroke.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export type StyleId = 'brandable' | 'compound' | 'suffix' | 'portmanteau' | 'alliteration'

export type LengthBand = 'great' | 'good' | 'long'

export interface StyleSpec {
  readonly id: StyleId
  readonly label: string
  readonly blurb: string
}

export const STYLES: readonly StyleSpec[] = [
  {
    id: 'brandable',
    label: 'Brandable',
    blurb:
      'Invented but pronounceable — your keyword’s root recombined with curated syllables.',
  },
  {
    id: 'compound',
    label: 'Compound',
    blurb: 'Your keyword joined to a real word: Hub, Labs, Works, Forge and friends.',
  },
  {
    id: 'suffix',
    label: 'Modern suffix',
    blurb: 'Startup-style endings such as -ly, -ify, -io, -eo and -ora.',
  },
  {
    id: 'portmanteau',
    label: 'Portmanteau',
    blurb: 'Your keyword blended into a real word at a letter they share.',
  },
  {
    id: 'alliteration',
    label: 'Alliteration',
    blurb: 'Paired with real words that share your keyword’s first letter.',
  },
]

export const BATCH_SIZE = 12

/** Endings the suffix style may append. The style contract: every suffix name ends with one of these. */
export const MODERN_SUFFIXES: readonly string[] = [
  'ly',
  'ify',
  'io',
  'eo',
  'ora',
  'ix',
  'ova',
  'ero',
  'ino',
  'sy',
]

/** Real words a compound name may end with. TitleCase because they render as-is. */
const COMPOUND_WORDS: readonly string[] = [
  'Hub',
  'Labs',
  'Works',
  'Forge',
  'Studio',
  'Loop',
  'Nest',
  'Base',
  'Craft',
  'Kit',
  'Yard',
  'Mill',
  'Wave',
  'Peak',
  'Spark',
  'Grove',
  'Den',
  'Flow',
  'Point',
  'House',
  'Line',
  'Land',
  'Box',
  'Port',
]

/** Real words a keyword can be blended into. Chosen for vowel spread so most keywords find a shared letter. */
const BLEND_WORDS: readonly string[] = [
  'nova',
  'vista',
  'pulse',
  'lumen',
  'orbit',
  'echo',
  'terra',
  'aura',
  'atlas',
  'vertex',
  'prism',
  'zenith',
  'ember',
  'summit',
  'harbor',
  'ridge',
  'bloom',
  'crest',
  'haven',
  'spark',
  'drift',
  'glide',
  'arena',
  'oasis',
  'canvas',
  'meadow',
  'willow',
  'horizon',
  'fable',
  'flora',
  'field',
  'stone',
  'stream',
  'breeze',
  'cloud',
  'tribe',
  'spire',
  'globe',
  'garden',
  'amber',
]

/** Alliteration partners, keyed by initial letter. Every word starts with its key. */
const ALLITERATION_WORDS: Readonly<Record<string, readonly string[]>> = {
  a: ['Amber', 'Apex', 'Atlas', 'Aurora', 'Anchor', 'Alpine', 'Acorn'],
  b: ['Bright', 'Birch', 'Bloom', 'Bravo', 'Breeze', 'Bold', 'Beacon'],
  c: ['Copper', 'Crest', 'Cobalt', 'Cedar', 'Canyon', 'Coral', 'Compass'],
  d: ['Dapper', 'Delta', 'Dune', 'Drift', 'Dawn', 'Dandy', 'Dove'],
  e: ['Ember', 'Echo', 'Everest', 'Eager', 'Edge', 'Elm', 'Evergreen'],
  f: ['Fable', 'Fern', 'Flint', 'Frontier', 'Fox', 'Fair', 'Fleet'],
  g: ['Golden', 'Grove', 'Granite', 'Glide', 'Garnet', 'Gala', 'Gentle'],
  h: ['Harbor', 'Hazel', 'Halo', 'Heritage', 'Horizon', 'Honey', 'Hearth'],
  i: ['Ivory', 'Iris', 'Indigo', 'Iron', 'Island', 'Ivy', 'Inland'],
  j: ['Jade', 'Jolly', 'Juniper', 'Jubilee', 'Jet', 'Jasper', 'Journey'],
  k: ['Keen', 'Kindred', 'Kite', 'Karma', 'Kettle', 'Kernel', 'Kingdom'],
  l: ['Lunar', 'Lively', 'Laurel', 'Legacy', 'Little', 'Lush', 'Lantern'],
  m: ['Maple', 'Modern', 'Mosaic', 'Meadow', 'Marble', 'Mellow', 'Mint'],
  n: ['Noble', 'North', 'Nimble', 'Nectar', 'Nova', 'Native', 'Nook'],
  o: ['Oak', 'Orbit', 'Onyx', 'Opal', 'Olive', 'Ocean', 'Orchard'],
  p: ['Prime', 'Pebble', 'Pioneer', 'Polar', 'Poppy', 'Pearl', 'Pine'],
  q: ['Quick', 'Quartz', 'Quest', 'Quiet', 'Quill', 'Quaint', 'Quantum'],
  r: ['Royal', 'River', 'Rustic', 'Raven', 'Ridge', 'Rally', 'Rosewood'],
  s: ['Silver', 'Summit', 'Sage', 'Swift', 'Stellar', 'Sunny', 'Saffron'],
  t: ['True', 'Timber', 'Tidal', 'Terra', 'Topaz', 'Tandem', 'Thrive'],
  u: ['Urban', 'Unity', 'Upbeat', 'Ultra', 'Umber', 'Union', 'Upland'],
  v: ['Velvet', 'Vivid', 'Vista', 'Valor', 'Verdant', 'Violet', 'Voyage'],
  w: ['Wild', 'Willow', 'Wander', 'Winter', 'Woven', 'Wren', 'Whistle'],
  x: ['Xenon', 'Xylem', 'Xanadu'],
  y: ['Yonder', 'Young', 'Yellow', 'Yarrow', 'Yield', 'Yukon'],
  z: ['Zen', 'Zesty', 'Zephyr', 'Zinc', 'Zenith', 'Zeal'],
}

/** Middle syllables for brandable names — open (consonant+vowel) so junctions stay sayable. */
const MID_SYLLABLES: readonly string[] = [
  'ra',
  'li',
  'ven',
  'ta',
  'mo',
  'ne',
  'so',
  'va',
  'ri',
  'lo',
  'na',
  'de',
  'mi',
  'sa',
  'to',
  'vi',
  'ka',
  'ze',
]

/** Final syllables for brandable names. */
const END_SYLLABLES: readonly string[] = [
  'ra',
  'lo',
  'na',
  'via',
  'sa',
  'ro',
  'za',
  'le',
  'no',
  'mi',
  'va',
  'ia',
  'io',
  'us',
  'en',
  'ar',
  'on',
  'el',
  'ix',
  'eo',
]

/** Three-consonant word onsets English speakers handle without blinking. */
const ALLOWED_ONSETS: ReadonlySet<string> = new Set([
  'str',
  'scr',
  'spr',
  'spl',
  'thr',
  'shr',
  'sch',
  'chr',
  'phr',
  'squ',
])

const MIN_KEYWORD = 2
const MAX_KEYWORD = 20
const MAX_NAME_LETTERS = 13

export const SHORTLIST_LIMIT = 40

/**
 * A small linear congruential generator (Numerical Recipes constants).
 * The same seed always yields the same sequence, which is what makes a
 * "Regenerate" batch reproducible and the whole module testable.
 */
export function createRng(seed: number): () => number {
  let s = (Math.trunc(seed) || 1) >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Lowercases and strips everything that is not a-z. `Coffee Shop!` → `coffeeshop`. */
export function sanitizeKeyword(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z]/g, '')
}

export interface KeywordsResult {
  readonly keywords: readonly string[]
  readonly error?: string
}

/**
 * Validates and dedupes the keyword slots. Blank slots are simply skipped;
 * a filled slot that sanitises to fewer than 2 or more than 20 letters is an
 * error, reported against the text the user actually typed.
 */
export function sanitizeKeywords(raw: readonly string[]): KeywordsResult {
  const cleaned: string[] = []
  for (const entry of raw) {
    const typed = entry.trim()
    if (typed === '') continue
    const k = sanitizeKeyword(typed)
    const shown = typed.length > 24 ? `${typed.slice(0, 24)}…` : typed
    if (k.length < MIN_KEYWORD) {
      return {
        keywords: [],
        error: `“${shown}” needs at least ${MIN_KEYWORD} letters (a–z) to build names from.`,
      }
    }
    if (k.length > MAX_KEYWORD) {
      return {
        keywords: [],
        error: `“${shown}” is too long — keep each keyword under ${MAX_KEYWORD} letters.`,
      }
    }
    if (!cleaned.includes(k)) cleaned.push(k)
  }
  if (cleaned.length === 0) {
    return {
      keywords: [],
      error: 'Enter at least one keyword (letters a–z) to generate names.',
    }
  }
  return { keywords: cleaned }
}

/**
 * The pronounceability heuristic: after collapsing doubled letters and
 * reading common digraphs (ch, sh, th…) as one sound, a run of three or more
 * consonants outside the whitelisted onsets (str, spr…) marks a name as
 * tricky to say. `y` counts as a vowel. A heuristic, not phonology — its job
 * is to flag names likely to be misheard and misspelled.
 */
export function isPronounceable(word: string): boolean {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '')
  if (lower === '') return false
  const collapsed = lower.replace(/(.)\1+/g, '$1')
  const reduced = collapsed.replace(/ch|sh|th|ph|wh|ck|qu/g, 'k')
  const clusters = reduced.match(/[^aeiouy]{3,}/g)
  if (clusters === null) return true
  return clusters.every((c) => c.length === 3 && ALLOWED_ONSETS.has(c))
}

/**
 * Length scoring, counting letters only (spaces excluded): ≤8 letters is a
 * great brand-name length, ≤12 is good, longer gets flagged.
 */
export function scoreLength(name: string): {
  readonly letters: number
  readonly band: LengthBand
} {
  const letters = name.replace(/[^a-zA-Z]/g, '').length
  const band: LengthBand = letters <= 8 ? 'great' : letters <= 12 ? 'good' : 'long'
  return { letters, band }
}

/** The exact-match .com a person would search for: letters only, lowercased. */
export function domainCandidate(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]/g, '')}.com`
}

/**
 * Validates a shortlist restored from localStorage, which is user-writable
 * and therefore untrusted: wrong shapes return undefined instead of leaking
 * non-strings into the UI. Oversized or duplicate entries are dropped.
 */
export function parseShortlist(raw: unknown): readonly string[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const out: string[] = []
  for (const item of raw) {
    if (typeof item !== 'string') return undefined
    const t = item.trim()
    if (t.length === 0 || t.length > 40) continue
    if (!out.includes(t)) out.push(t)
    if (out.length >= SHORTLIST_LIMIT) break
  }
  return out
}

export interface NameIdea {
  readonly name: string
  readonly style: StyleId
  /** The honest formation recipe, e.g. `“coffee” + Forge`. Transparency is the product. */
  readonly how: string
  /** What the name was built from — keyword first, then the bank material. */
  readonly sources: readonly string[]
  readonly letters: number
  readonly lengthBand: LengthBand
  readonly lengthNote: string
  readonly pronounceable: boolean
  /** Naive syllable split for the "say it out loud" tip, e.g. `co·fa·ra`. */
  readonly sayIt: string
  /** The .com to check externally, e.g. `cofara.com`. */
  readonly domain: string
}

export interface BatchResult {
  readonly names: readonly NameIdea[]
  readonly error?: string
}

interface Candidate {
  readonly name: string
  readonly how: string
  readonly sources: readonly string[]
  /** Human word units, used for syllable tips and pronounceability (a compound is judged per word). */
  readonly syllableParts: readonly string[]
}

type Generator = (keywords: readonly string[], rng: () => number) => Candidate | undefined

function isVowel(ch: string): boolean {
  return ch !== '' && 'aeiou'.includes(ch)
}

function titleCase(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function pick<T>(arr: readonly T[], rng: () => number): T | undefined {
  if (arr.length === 0) return undefined
  return arr[Math.min(Math.floor(rng() * arr.length), arr.length - 1)]
}

/** A candidate name may not read as a plausible word if it fails these. */
function looksClean(word: string): boolean {
  return !/[aeiou]{3,}/.test(word) && !/(.)\1\1/.test(word) && isPronounceable(word)
}

/**
 * The keyword's root: opening consonants, the first vowel run, and one
 * closing consonant, capped at 5 letters. `coffee` → `cof`, `aura` → `aur`.
 */
function rootOf(keyword: string): string {
  let i = 0
  while (i < keyword.length && !isVowel(keyword.charAt(i))) i++
  while (i < keyword.length && isVowel(keyword.charAt(i))) i++
  if (i < keyword.length && !isVowel(keyword.charAt(i))) i++
  const root = keyword.slice(0, Math.min(i, 5))
  return root.length >= 2 ? root : keyword.slice(0, Math.min(3, keyword.length))
}

function brandable(
  keywords: readonly string[],
  rng: () => number,
): Candidate | undefined {
  const k = pick(keywords, rng)
  if (k === undefined) return undefined
  const root = rootOf(k)
  const syls: string[] = []
  if (rng() < 0.4) {
    const mid = pick(MID_SYLLABLES, rng)
    if (mid !== undefined) syls.push(mid)
  }
  const end = pick(END_SYLLABLES, rng)
  if (end === undefined) return undefined
  syls.push(end)
  const raw = root + syls.join('')
  if (raw === k || raw.length < 4 || raw.length > 11 || !looksClean(raw)) return undefined
  return {
    name: titleCase(raw),
    how: `root “${root}-” of “${k}” + invented “-${syls.join('')}”`,
    sources: [k, syls.join('')],
    syllableParts: [raw],
  }
}

function compound(keywords: readonly string[], rng: () => number): Candidate | undefined {
  const k = pick(keywords, rng)
  const w = pick(COMPOUND_WORDS, rng)
  if (k === undefined || w === undefined || k === w.toLowerCase()) return undefined
  return {
    name: titleCase(k) + w,
    how: `“${k}” + ${w}`,
    sources: [k, w],
    syllableParts: [k, w.toLowerCase()],
  }
}

function suffixName(
  keywords: readonly string[],
  rng: () => number,
): Candidate | undefined {
  const k = pick(keywords, rng)
  const suf = pick(MODERN_SUFFIXES, rng)
  if (k === undefined || suf === undefined) return undefined
  let base = rng() < 0.35 ? rootOf(k) : k
  const first = suf.charAt(0)
  if (isVowel(first)) {
    // `coffee` + `io` reads better as `coffio` — drop the trailing vowels
    // rather than stacking them at the junction.
    while (base.length > 2 && isVowel(base.charAt(base.length - 1)))
      base = base.slice(0, -1)
  } else if (base.endsWith(first)) {
    base = base.slice(0, -1)
    if (base.length < 2) return undefined
  }
  const raw = base + suf
  if (raw === k || raw.length > MAX_NAME_LETTERS || !looksClean(raw)) return undefined
  return {
    name: titleCase(raw),
    how: `“${k}” + -${suf}`,
    sources: [k, `-${suf}`],
    syllableParts: [raw],
  }
}

function portmanteau(
  keywords: readonly string[],
  rng: () => number,
): Candidate | undefined {
  const k = pick(keywords, rng)
  const w = pick(BLEND_WORDS, rng)
  if (k === undefined || w === undefined || k.length < 3 || w === k) return undefined
  // Every valid junction keeps ≥3 letters of the keyword (the prefix) and
  // ≥3 letters of the real word (the tail), joined where they share a letter.
  const options: { readonly blended: string; readonly ch: string }[] = []
  for (let i = k.length - 1; i >= 2; i--) {
    const ch = k.charAt(i)
    for (let j = 0; j <= w.length - 4; j++) {
      if (w.charAt(j) !== ch) continue
      const blended: string = k.slice(0, i + 1) + w.slice(j + 1)
      if (blended === k || blended.length > MAX_NAME_LETTERS) continue
      if (!looksClean(blended)) continue
      options.push({ blended, ch })
    }
  }
  const chosen = pick(options, rng)
  if (chosen === undefined) return undefined
  return {
    name: titleCase(chosen.blended),
    how: `“${k}” blended into “${w}” at the shared “${chosen.ch}”`,
    sources: [k, w],
    syllableParts: [chosen.blended],
  }
}

function alliteration(
  keywords: readonly string[],
  rng: () => number,
): Candidate | undefined {
  const k = pick(keywords, rng)
  if (k === undefined) return undefined
  const initial = k.charAt(0)
  const bank = ALLITERATION_WORDS[initial]
  if (bank === undefined) return undefined
  const w = pick(bank, rng)
  if (w === undefined || w.toLowerCase() === k) return undefined
  const kT = titleCase(k)
  const name = rng() < 0.5 ? `${w} ${kT}` : `${kT} ${w}`
  return {
    name,
    how: `alliteration on “${initial.toUpperCase()}”: ${w} + ${kT}`,
    sources: [k, w],
    syllableParts: [k, w.toLowerCase()],
  }
}

const GENERATORS: Record<StyleId, Generator> = {
  brandable,
  compound,
  suffix: suffixName,
  portmanteau,
  alliteration,
}

/**
 * Naive syllable split for the "say it out loud" tip: break after a vowel
 * when a consonant+vowel follows and at least three letters remain, so
 * `cofara` → `co·fa·ra` while short words stay whole. A reading aid, not
 * linguistics.
 */
function syllabifyWord(word: string): string {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '')
  if (lower.length <= 3) return lower
  const parts: string[] = []
  let cur = ''
  for (let i = 0; i < lower.length; i++) {
    cur += lower.charAt(i)
    const remaining = lower.length - i - 1
    if (
      remaining >= 3 &&
      isVowel(lower.charAt(i)) &&
      !isVowel(lower.charAt(i + 1)) &&
      isVowel(lower.charAt(i + 2))
    ) {
      parts.push(cur)
      cur = ''
    }
  }
  if (cur !== '') parts.push(cur)
  return parts.join('·')
}

function decorate(c: Candidate, style: StyleId): NameIdea {
  const { letters, band } = scoreLength(c.name)
  const lengthNote =
    band === 'great'
      ? 'great length'
      : band === 'good'
        ? 'good length'
        : 'on the long side'
  return {
    name: c.name,
    style,
    how: c.how,
    sources: c.sources,
    letters,
    lengthBand: band,
    lengthNote,
    pronounceable: c.syllableParts.every((p) => isPronounceable(p)),
    sayIt: c.syllableParts.map(syllabifyWord).join(' · '),
    domain: domainCandidate(c.name),
  }
}

/**
 * Builds one batch of scored, deduplicated names. Deterministic under a
 * seeded rng: the same keywords, style and seed always produce the same
 * batch. Styles with a small combination space (e.g. alliteration on a rare
 * initial) may return fewer than `count` names rather than padding with junk.
 */
export function generateBatch(
  rawKeywords: readonly string[],
  style: StyleId,
  rng: () => number,
  count: number = BATCH_SIZE,
): BatchResult {
  const { keywords, error } = sanitizeKeywords(rawKeywords)
  if (error !== undefined || keywords.length === 0) {
    return { names: [], error: error ?? 'Enter at least one keyword to generate names.' }
  }

  const generate = GENERATORS[style]
  const seen = new Set<string>(keywords)
  const names: NameIdea[] = []
  const maxAttempts = count * 40

  for (let attempt = 0; attempt < maxAttempts && names.length < count; attempt++) {
    const candidate = generate(keywords, rng)
    if (candidate === undefined) continue
    const key = candidate.name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    names.push(decorate(candidate, style))
  }

  if (names.length === 0) {
    return {
      names: [],
      error:
        'Could not build names from that keyword with this style — try another style or a longer keyword.',
    }
  }
  return { names }
}
