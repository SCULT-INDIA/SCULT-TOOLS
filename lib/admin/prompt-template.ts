import type { PromptVariable } from '@/lib/prompts/types'

/**
 * The meta-prompt an admin hands to an AI, and the parser for what comes
 * back. Together they are how a prompt page gets authored without typing
 * into any field: describe the idea, paste the reply, review, publish.
 *
 * The reply format is a fixed set of `---SECTION---` markers. Markers
 * rather than JSON because every model reliably reproduces a line of
 * dashes and capitals verbatim, while JSON invites smart quotes, stray
 * commentary, and code fences — all of which the parser below tolerates
 * anyway, since replies get copied through chat UIs that add them.
 */

export const REPLY_SECTIONS = [
  'TITLE',
  'CATEGORY',
  'DESCRIPTION',
  'PROMPT',
  'VARIABLES',
  'WHY_IT_WORKS',
  'EXAMPLE_OUTPUT',
] as const
export type ReplySection = (typeof REPLY_SECTIONS)[number]

export interface TemplateReply {
  readonly title?: string
  readonly category?: string
  readonly description?: string
  readonly promptText?: string
  readonly variables?: readonly PromptVariable[]
  readonly whyItWorks?: string
  readonly exampleOutput?: string
}

export interface TemplateCategory {
  readonly slug: string
  readonly name: string
}

const marker = (section: string) => `---${section}---`

export function buildPromptTemplate(categories: readonly TemplateCategory[]): string {
  const categoryList = categories.map((c) => `${c.slug} — ${c.name}`).join('\n')
  return `I'm building a reusable AI prompt for the following:

[Describe what you want the prompt to help with — replace this line with your own idea, as detailed or rough as you like.]

Write everything a prompt-library page for it needs. Rules for the prompt itself:

1. Use {{snake_case_name}} for every part someone should customize before using the prompt (e.g. {{topic}}, {{tone}}, {{target_audience}}) — never write a specific example inline; always mark it as a placeholder instead.
2. Open with clear role-setting: "You are a/an [role] who/that ...".
3. State the task in plain language, then list the constraints, steps, or requirements as a numbered or bulleted list — no more than 5 of them, the most important ones only.
4. End with an explicit instruction on the output format (length, structure, tone, what NOT to include).
5. Keep the prompt self-contained — it should make sense on its own, with no reference to "the template" or "this conversation".

Reply in EXACTLY this structure — these marker lines verbatim, in this order, each on its own line, nothing before the first marker and nothing after the last section (no commentary, no headings, no code fences):

${marker('TITLE')}
A short, specific title for the prompt page — under 80 characters, written like a benefit or an action, e.g. "Chase an overdue invoice without sounding like a threat".

${marker('CATEGORY')}
Exactly one slug from this list, the best fit (the slug only, nothing else):
${categoryList}

${marker('DESCRIPTION')}
One or two plain sentences (under 300 characters) saying what the prompt does and who it's for. No markdown.

${marker('PROMPT')}
The complete prompt text, following rules 1–5 above.

${marker('VARIABLES')}
Every {{variable}} used in the prompt — one per line, in exactly this format (no numbering, no extra punctuation):
name | one-line description of what it represents | a realistic example value

${marker('WHY_IT_WORKS')}
2–4 sentences on why this prompt gets better results than asking plainly — the specific techniques it uses (role, constraints, output format, examples). You may use **bold** and "- " bullet lines.

${marker('EXAMPLE_OUTPUT')}
A realistic, abridged example of what the AI returns when the prompt is run with the example values — 5–15 lines. You may use **bold** and "- " bullet lines.`
}

/** `---TITLE---`, `--- TITLE ---`, `**---TITLE---**`, `### ---TITLE---`,
 * lower-case… anything that is clearly one of the markers. */
const MARKER_LINE = /^[\s#*_>]*-{3,}\s*([A-Z_]+)\s*-{3,}[\s#*_]*$/i

/** Chat UIs love wrapping a reply in a code fence; a fence line carries
 * no content of its own. */
const FENCE_LINE = /^\s*(`{3,}|~{3,})\w*\s*$/

/**
 * Splits a pasted reply into its sections. Returns `null` when nothing in
 * the text is a recognised marker — a plain paste with no structure —
 * so callers can fall through to ordinary behaviour. Missing sections are
 * simply absent from the result, never invented. The legacy reply shape
 * (prompt text, then only `---VARIABLES---`) still parses: everything
 * before the first marker becomes the prompt when no PROMPT section
 * exists.
 */
export function parseTemplateReply(raw: string): TemplateReply | null {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const sections = new Map<ReplySection, string[]>()
  const preamble: string[] = []
  let current: ReplySection | null = null
  let sawMarker = false

  for (const line of lines) {
    if (FENCE_LINE.test(line)) continue
    const m = MARKER_LINE.exec(line)
    if (m?.[1]) {
      const name = m[1].toUpperCase().replace(/[^A-Z_]/g, '')
      const section = REPLY_SECTIONS.find(
        (s) => s === name || s.replace(/_/g, '') === name,
      )
      if (section) {
        sawMarker = true
        current = section
        if (!sections.has(section)) sections.set(section, [])
        continue
      }
      if (name === 'END') {
        current = null
        continue
      }
    }
    if (current) sections.get(current)?.push(line)
    else preamble.push(line)
  }
  if (!sawMarker) return null

  const text = (section: ReplySection): string | undefined => {
    const body = sections.get(section)?.join('\n').trim()
    return body ? body : undefined
  }

  const promptText = text('PROMPT') ?? (preamble.join('\n').trim() || undefined)
  const variablesBlock = sections.get('VARIABLES')
  const variables = variablesBlock ? parseVariables(variablesBlock) : undefined

  const result: TemplateReply = {
    ...(text('TITLE') !== undefined ? { title: singleLine(text('TITLE') ?? '') } : {}),
    ...(text('CATEGORY') !== undefined
      ? { category: firstToken(text('CATEGORY') ?? '') }
      : {}),
    ...(text('DESCRIPTION') !== undefined ? { description: text('DESCRIPTION') } : {}),
    ...(promptText !== undefined ? { promptText } : {}),
    ...(variables && variables.length > 0 ? { variables } : {}),
    ...(text('WHY_IT_WORKS') !== undefined ? { whyItWorks: text('WHY_IT_WORKS') } : {}),
    ...(text('EXAMPLE_OUTPUT') !== undefined
      ? { exampleOutput: text('EXAMPLE_OUTPUT') }
      : {}),
  }
  return result
}

/** `name | description | example` per line, tolerating `{{name}}`, a
 * leading bullet, and surrounding backticks or bold. */
export function parseVariables(lines: readonly string[]): PromptVariable[] {
  const variables: PromptVariable[] = []
  const seen = new Set<string>()
  for (const line of lines) {
    const trimmed = line.trim().replace(/^[-*•]\s+/, '')
    if (!trimmed.includes('|')) continue
    const [rawName, description, example] = trimmed.split('|').map((p) => p.trim())
    const name = rawName?.replace(/[{}`*]/g, '').trim()
    if (!name || !/^[a-zA-Z0-9_]+$/.test(name) || seen.has(name)) continue
    seen.add(name)
    variables.push({
      name,
      description: description ?? '',
      example: example ?? '',
      required: true,
    })
  }
  return variables
}

/** A title is one line; a model that wraps it in quotes or bold gets
 * those stripped rather than shipped. */
function singleLine(value: string): string {
  return (
    value
      .split('\n')[0]
      ?.trim()
      .replace(/^["'“”*#\s]+|["'“”*\s]+$/g, '')
      .trim() ?? ''
  )
}

/** The category section should be one slug; take the first slug-shaped
 * token so "chatgpt — ChatGPT" or "`chatgpt`" both resolve to "chatgpt". */
function firstToken(value: string): string {
  const match = /[a-z0-9][a-z0-9-]*/i.exec(value.replace(/`/g, ''))
  return match ? match[0].toLowerCase() : ''
}
