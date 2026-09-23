/**
 * The keyword side of the homepage assistant (components/sections/
 * HeroAssistant.tsx): turns a chatty message into the search terms the
 * existing ranker understands, and writes the one-line reply that sits
 * above the result links. Pure functions, no registry imports — this is
 * imported by a client component, and lib/search.ts's docblock explains why
 * nothing client-side may pull the registries in.
 *
 * There is no language model here, on purpose. The site's promise is "no
 * account, runs in your browser, free forever", and the catalogue is small
 * and well-tagged, so a keyword match against the same index the search box
 * already uses finds the right page without a paid API call per keystroke.
 * The conversational framing is honest about that: it points at real pages
 * and never claims to have "understood" more than the keywords it matched.
 */

export type AssistantIntent = 'tool' | 'prompt' | 'skill'

export interface ParsedMessage {
  /** Search terms, one per meaningful word, each stemmed (see `stem`) —
   * what the ranker and the skills search actually receive. */
  readonly terms: readonly string[]
  /** `terms` joined with spaces — the query string form the ranker takes. */
  readonly keywords: string
  /** The same words as the visitor typed them, filler removed — what the
   * reply quotes back ("chasing overdue invoice", not "chas overdue invoice"). */
  readonly display: string
  /** Catalogues the message asked for by name, in the order mentioned. */
  readonly intents: readonly AssistantIntent[]
  readonly greeting: boolean
}

/**
 * Prefix-safe stemming: every stem returned is a leading substring of the
 * word it came from, so it still matches the word itself AND its other
 * forms under the ranker's substring/prefix checks and the skills search's
 * `ilike '%…%'` ("chasing" → "chas" finds "chase", "chased", "chasing";
 * "invoices" → "invoice"; "planning" → "plan"). Conservative on purpose —
 * a wrong stem that matches nothing is worse than no stem, so short
 * results are refused rather than risked.
 */
export function stem(word: string): string {
  const doubled = (s: string) => (/([b-df-hj-np-tv-z])\1$/.test(s) ? s.slice(0, -1) : s)
  if (word.length >= 6 && word.endsWith('ing')) {
    const s = doubled(word.slice(0, -3))
    if (s.length >= 3) return s
  }
  if (word.length >= 6 && word.endsWith('ed')) {
    const s = doubled(word.slice(0, -2))
    if (s.length >= 4) return s
  }
  if (word.length >= 6 && word.endsWith('ies')) return word.slice(0, -3)
  if (
    word.length >= 4 &&
    word.endsWith('s') &&
    !word.endsWith('ss') &&
    !word.endsWith('us') &&
    !word.endsWith('is')
  ) {
    return word.slice(0, -1)
  }
  return word
}

const INTENT_WORDS: Record<string, AssistantIntent> = {
  tool: 'tool',
  tools: 'tool',
  utility: 'tool',
  utilities: 'tool',
  calculator: 'tool',
  generator: 'tool',
  checker: 'tool',
  prompt: 'prompt',
  prompts: 'prompt',
  template: 'prompt',
  templates: 'prompt',
  skill: 'skill',
  skills: 'skill',
}

/** Words that carry no search meaning in a request like "i need something
 * for chasing an invoice" — dropped so the ranker sees "chasing invoice". */
const FILLER = new Set([
  'i',
  'im',
  'me',
  'my',
  'we',
  'our',
  'you',
  'your',
  'a',
  'an',
  'the',
  'to',
  'for',
  'of',
  'in',
  'on',
  'at',
  'with',
  'and',
  'or',
  'is',
  'are',
  'it',
  'its',
  'this',
  'that',
  'these',
  'those',
  'some',
  'something',
  'anything',
  'want',
  'need',
  'looking',
  'look',
  'find',
  'show',
  'give',
  'get',
  'help',
  'please',
  'pls',
  'can',
  'could',
  'would',
  'do',
  'does',
  'how',
  'what',
  'which',
  'where',
  'any',
  'about',
  'best',
  'good',
  'free',
  'there',
  'have',
  'has',
  'use',
  'using',
  'make',
  'write',
  'create',
  'thanks',
  'thank',
])

const GREETINGS = new Set(['hi', 'hello', 'hey', 'yo', 'hola', 'namaste', 'sup'])

export function parseMessage(raw: string): ParsedMessage {
  const words = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const intents: AssistantIntent[] = []
  const kept: string[] = []
  let greeting = false

  for (const word of words) {
    const intent = INTENT_WORDS[word]
    if (intent) {
      if (!intents.includes(intent)) intents.push(intent)
      // "calculator"/"generator"/"checker" are real search terms as well as
      // intent signals — a visitor asking for "a gst calculator" means the
      // word. The generic catalogue nouns are only signals.
      if (!/^(tools?|utilit(y|ies)|prompts?|templates?|skills?)$/.test(word)) {
        kept.push(word)
      }
      continue
    }
    if (GREETINGS.has(word)) {
      greeting = true
      continue
    }
    if (FILLER.has(word)) continue
    kept.push(word)
  }

  const terms = kept.map(stem)
  return { terms, keywords: terms.join(' '), display: kept.join(' '), intents, greeting }
}

export const CATALOGUE_LINKS: readonly {
  readonly intent: AssistantIntent
  readonly href: string
  readonly label: string
}[] = [
  { intent: 'tool', href: '/all', label: 'All tools' },
  { intent: 'prompt', href: '/prompts', label: 'Prompt library' },
  { intent: 'skill', href: '/skills', label: 'Skills library' },
]

export interface ReplyCounts {
  readonly tools: number
  readonly prompts: number
  readonly skills: number
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

function joinNatural(parts: readonly string[]): string {
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
}

/** The sentence above the links. `skillsLoading` and `indexPending` keep the
 * wording honest while a leg is still in flight — zero results before the
 * tools/prompts index has even downloaded means "not yet", not "none". */
export function replyText(
  parsed: ParsedMessage,
  counts: ReplyCounts,
  skillsLoading: boolean,
  indexPending = false,
): string {
  if (!parsed.keywords) {
    if (parsed.intents.length > 0) {
      const names = parsed.intents.map((i) =>
        i === 'tool' ? 'tools' : i === 'prompt' ? 'prompts' : 'skills',
      )
      return `Here's where the ${joinNatural(names)} live — or tell me what you're working on and I'll pick out specific ones:`
    }
    return "Hi! Tell me what you're working on — a task, a tool name or a topic — and I'll point you to the right tool, prompt or skill."
  }

  const total = counts.tools + counts.prompts + counts.skills
  const quoted = `“${parsed.display}”`

  if (total === 0) {
    if (indexPending) return `Searching for ${quoted}…`
    if (skillsLoading) return `Checking the skills library for ${quoted}…`
    return `I couldn't find anything for ${quoted}. Try a different word, or start from one of these:`
  }

  const parts: string[] = []
  if (counts.tools > 0) parts.push(plural(counts.tools, 'tool'))
  if (counts.prompts > 0) parts.push(plural(counts.prompts, 'prompt'))
  if (counts.skills > 0) parts.push(plural(counts.skills, 'skill'))
  const tail = skillsLoading && counts.skills === 0 ? ' — still checking skills' : ''
  return `Here's what I found for ${quoted}: ${joinNatural(parts)}${tail}.`
}
