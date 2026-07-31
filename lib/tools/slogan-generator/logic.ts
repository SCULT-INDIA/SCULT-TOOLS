/**
 * Slogan generation from curated template banks.
 *
 * Purpose
 *   Turn a brand keyword (and optionally a "what you do" noun) into batches of
 *   ten slogans per tone. Every line comes from a hand-written bank — no
 *   madlibs word salad — and the keyword/noun are inflected grammatically:
 *   capitalised at sentence starts, with a/an chosen by vowel sound where a
 *   template needs an article.
 *
 * Inputs   keyword (required, 2–30 chars after whitespace collapse), optional
 *          noun, a tone id, an injected rng for testable shuffling, and an
 *          exclude list (whatever is already on screen or shortlisted).
 * Outputs  a SloganResult with up to `count` slogans; `error` set instead of a
 *          throw for invalid input, because the caller re-renders per keystroke
 *          and half-typed input is the normal case.
 * Failure  keyword/noun outside the length bounds → `error` string, empty
 *          slogans. An exhausted bank (everything excluded) returns an empty
 *          array with no error — that is a state, not a mistake.
 *
 * No React, no DOM, no I/O — pure functions, unit-tested in logic.test.ts.
 */

export type Tone = 'bold' | 'friendly' | 'premium' | 'playful' | 'minimal'

export interface ToneOption {
  readonly id: Tone
  readonly label: string
}

/** Chip order in the UI. Friendly first because it suits the most businesses. */
export const TONES: readonly ToneOption[] = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'bold', label: 'Bold' },
  { id: 'premium', label: 'Premium' },
  { id: 'playful', label: 'Playful' },
  { id: 'minimal', label: 'Minimal' },
]

/**
 * Template tokens:
 *   {K}   keyword, first letter capitalised (sentence start)
 *   {k}   keyword exactly as entered (mid-sentence — brands keep their casing)
 *   {N}   noun, first letter capitalised
 *   {n}   noun as entered
 *   {a:n} "a"/"an" chosen by vowel sound, followed by the noun
 *
 * Templates containing a noun token are dropped from the bank when no noun is
 * given; each tone keeps at least 12 keyword-only templates so a batch of ten
 * still has headroom without a noun.
 */
const TONE_BANKS: Readonly<Record<Tone, readonly string[]>> = {
  bold: [
    '{K}. Finally done right.',
    'Own your {n}.',
    "{K}. Because good enough isn't.",
    'Stop settling. Start with {k}.',
    '{K}. Built like we mean it.',
    'The last word in {n}.',
    '{K}. No shortcuts. No excuses.',
    'Demand more from your {n}.',
    "{K} doesn't follow. It leads.",
    'Raise the bar. Then raise it again. {K}.',
    '{K}. Strong opinions, stronger work.',
    '{K}. Outwork. Outbuild. Outlast.',
    '{K}. The standard, not the option.',
    'Make {n} your unfair advantage.',
    '{K}. Zero compromise.',
    'Built for people who mean it. {K}.',
  ],
  friendly: [
    "{K}. We're glad you're here.",
    'Good {n}, done with heart.',
    "Like a friend who's great at {n}. That's {k}.",
    'Say hello to easier {n}.',
    '{K}. No jargon, just help.',
    "We sweat the small stuff, so you don't have to. {K}.",
    '{K}. Real people, real answers.',
    'Come for the {n}, stay for the care.',
    '{K}. Always in your corner.',
    'Making {n} feel less like work.',
    '{K}. Warm welcomes, honest work.',
    'You bring the dream. {K} does the rest.',
    '{K}. Friendly by design.',
    'The neighbourly way to do {n}.',
    'Big help. Small fuss. {K}.',
    '{K}. Here when you need us.',
    '{K}. Simple to start, easy to love.',
    'Every question welcome. {K}.',
  ],
  premium: [
    '{K}. Quietly exceptional.',
    'Crafted, not manufactured. {K}.',
    '{K}. For those who notice.',
    'The finer side of {n}.',
    '{K}. Reserved for the discerning.',
    'Excellence, distilled. {K}.',
    '{K}. Where detail is the standard.',
    '{N}, elevated.',
    '{K}. Rare by intention.',
    'Thoughtful {n}, impeccably delivered.',
    '{K}. The quiet mark of quality.',
    'Nothing extra. Nothing missing. {K}.',
    '{K}. Understated. Never underestimated.',
    'Not just {a:n}. A signature.',
    '{K}. Refinement, as routine.',
    'The difference is deliberate. {K}.',
  ],
  playful: [
    'Serious about {n}. Not about ourselves.',
    '{K}. Warning: may cause high expectations.',
    "Life's short. Your {n} shouldn't be boring.",
    '{K}. The plot twist your {n} needed.',
    'Less "meh". More {k}.',
    '{K}. Now with 100% more delight.',
    'Your {n} called. It wants {k}.',
    '{K}. Because dull is a choice.',
    'We put the fun in functional. {K}.',
    '{K}. Your future self says thanks.',
    'Making {n} the best part of your day.',
    '{K}. Weirdly good at this.',
    "Spoiler: you're going to love {k}.",
    '{K}. High fives included.',
    'The cure for boring {n}.',
    '{K}. Delight, on tap.',
    'Go on, treat yourself to {k}.',
    'Cue the confetti. {K} is here.',
  ],
  minimal: [
    'Simply {k}.',
    '{K}. Enough said.',
    'Less, but better. {K}.',
    "{K}. That's the pitch.",
    'Just {n}. Just right.',
    '{K}. Nothing to hide.',
    '{N}, minus the noise.',
    'All signal. No noise. {K}.',
    '{K}. Start here.',
    'One word: {k}.',
    '{N}. Simplified.',
    'Made simple. Kept simple. {K}.',
    "Everything you need. Nothing you don't. {K}.",
    '{K}. Say less.',
    '{K}. The short answer.',
    'No clutter. No catch. {K}.',
  ],
}

const MIN_INPUT_CHARS = 2
const MAX_INPUT_CHARS = 30

/** Google Ads limits: 30 chars per headline, 90 per description line. */
export const AD_HEADLINE_LIMIT = 30
export const AD_DESCRIPTION_LIMIT = 90

export interface SloganInput {
  readonly keyword: string
  /** Optional "what you do" noun, e.g. "coffee", "marketing". */
  readonly noun?: string
  readonly tone: Tone
  /** Injected so batches are deterministic under a seeded rng in tests. */
  readonly rng: () => number
  /** Slogans already on screen or shortlisted — never repeated. */
  readonly exclude?: readonly string[]
  /** Batch size; defaults to 10. */
  readonly count?: number
}

export interface SloganResult {
  readonly slogans: readonly string[]
  readonly error?: string
}

interface Sanitized {
  readonly value: string
  readonly error?: string
}

/** Trims and collapses internal whitespace runs to single spaces. */
function collapse(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

/**
 * Validates the brand keyword: 2–30 characters after whitespace collapse.
 * Returns `{ value: '' , error }` rather than throwing — a single typed
 * character is the normal path to a valid keyword, not an exception.
 */
export function sanitizeKeyword(raw: string): Sanitized {
  const value = collapse(raw)
  if (value.length < MIN_INPUT_CHARS) {
    return { value: '', error: 'Enter a brand name or keyword (at least 2 characters).' }
  }
  if (value.length > MAX_INPUT_CHARS) {
    return {
      value: '',
      error: `Keep the keyword under ${MAX_INPUT_CHARS} characters — slogans need room to breathe.`,
    }
  }
  return { value }
}

/** Validates the optional noun. Empty input is fine and means "no noun". */
export function sanitizeNoun(raw: string): Sanitized {
  const value = collapse(raw)
  if (value === '') return { value: '' }
  if (value.length < MIN_INPUT_CHARS) {
    return { value: '', error: 'The "what you do" word needs at least 2 characters.' }
  }
  if (value.length > MAX_INPUT_CHARS) {
    return {
      value: '',
      error: `Keep "what you do" under ${MAX_INPUT_CHARS} characters — one or two words works best.`,
    }
  }
  return { value }
}

/** Words whose spelling starts with a consonant but sounds like a vowel. */
const SILENT_H = /^(hour|honest|honou?r|heir)/i
/** Words whose spelling starts with a vowel but sounds like "y"/"w"/"one". */
const CONSONANT_SOUND =
  /^(uni[cfqtv]|use|usa|usu|ute|utens|utop|ubiq|euro|eu[a-z]|ewe|one|once|ouija)/i

/**
 * Chooses "a" or "an" by vowel *sound*, not spelling: "an hour", "an honest",
 * but "a university", "a euro", "a one-stop". Heuristic — the exception lists
 * cover the common English cases templates actually meet.
 */
export function articleFor(word: string): 'a' | 'an' {
  const w = word.trim()
  if (w === '') return 'a'
  if (SILENT_H.test(w)) return 'an'
  if (CONSONANT_SOUND.test(w)) return 'a'
  return /^[aeiou]/i.test(w) ? 'an' : 'a'
}

/** Uppercases the first character only; the rest keeps the user's casing. */
function capFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function needsNoun(template: string): boolean {
  return (
    template.includes('{n}') || template.includes('{N}') || template.includes('{a:n}')
  )
}

function renderTemplate(template: string, keyword: string, noun: string): string {
  return template
    .replace(/\{K\}/g, capFirst(keyword))
    .replace(/\{k\}/g, keyword)
    .replace(/\{N\}/g, capFirst(noun))
    .replace(/\{n\}/g, noun)
    .replace(/\{a:n\}/g, `${articleFor(noun)} ${noun}`)
}

/**
 * Renders the complete bank for one tone — every slogan `generateSlogans` can
 * possibly return for these inputs, in bank order. The component uses it to
 * detect exhaustion; tests use it as the tone contract.
 */
export function allSlogansForTone(input: {
  readonly keyword: string
  readonly noun?: string
  readonly tone: Tone
}): SloganResult {
  const kw = sanitizeKeyword(input.keyword)
  if (kw.error !== undefined) return { slogans: [], error: kw.error }
  const noun = sanitizeNoun(input.noun ?? '')
  if (noun.error !== undefined) return { slogans: [], error: noun.error }

  const bank = TONE_BANKS[input.tone].filter(
    (template) => noun.value !== '' || !needsNoun(template),
  )
  // A Set guards against two templates rendering identically for some input.
  const seen = new Set<string>()
  const slogans: string[] = []
  for (const template of bank) {
    const line = renderTemplate(template, kw.value, noun.value)
    if (!seen.has(line)) {
      seen.add(line)
      slogans.push(line)
    }
  }
  return { slogans }
}

/** Fisher–Yates driven by the injected rng, so a seeded rng gives one order. */
function shuffle(items: readonly string[], rng: () => number): string[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    // Clamp guards an rng that returns exactly 1 (outside the [0,1) contract).
    const j = Math.min(i, Math.floor(rng() * (i + 1)))
    const a = arr[i]
    const b = arr[j]
    if (a !== undefined && b !== undefined) {
      arr[i] = b
      arr[j] = a
    }
  }
  return arr
}

/**
 * Draws a batch of slogans: render the tone's bank, drop everything in
 * `exclude` (exact-match after trimming), shuffle with the injected rng, take
 * the first `count`. Deterministic for a seeded rng; never repeats an excluded
 * line; returns fewer than `count` (possibly zero) when the bank runs dry.
 */
export function generateSlogans(input: SloganInput): SloganResult {
  const all = allSlogansForTone(input)
  if (all.error !== undefined) return all

  const excluded = new Set((input.exclude ?? []).map((s) => s.trim()))
  const available = all.slogans.filter((s) => !excluded.has(s))
  const count = input.count ?? 10
  if (count <= 0) return { slogans: [] }
  return { slogans: shuffle(available, input.rng).slice(0, count) }
}

export interface AdFit {
  readonly chars: number
  /** ≤30 chars — fits a Google Ads headline. */
  readonly headline: boolean
  /** ≤90 chars — fits a Google Ads description line. */
  readonly description: boolean
}

/** Character count plus which Google Ads slots the line fits into. */
export function adFit(slogan: string): AdFit {
  const chars = slogan.length
  return {
    chars,
    headline: chars <= AD_HEADLINE_LIMIT,
    description: chars <= AD_DESCRIPTION_LIMIT,
  }
}

/**
 * Validates a shortlist read back from localStorage. Storage is user-writable
 * and survives deploys, so it is untrusted input: anything that is not an
 * array of sane strings returns undefined instead of poisoning the UI.
 */
export function parseShortlist(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined
  if (raw.length > 200) return undefined
  const out: string[] = []
  for (const item of raw) {
    if (typeof item !== 'string' || item.length === 0 || item.length > 200) {
      return undefined
    }
    out.push(item)
  }
  return out
}

/**
 * Deterministic LCG (numerical-recipes constants) for the seeded first batch —
 * server and client render the same slogans, so hydration never mismatches —
 * and for tests. Returns values in [0, 1).
 */
export function createSeededRng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}
