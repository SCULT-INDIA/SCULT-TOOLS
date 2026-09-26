import { describe, expect, it } from 'vitest'
import {
  buildPromptTemplate,
  parseTemplateReply,
  parseVariables,
} from './prompt-template'

const FULL_REPLY = `---TITLE---
"Chase an overdue invoice without sounding like a threat"

---CATEGORY---
business-ops

---DESCRIPTION---
Writes a firm, friendly follow-up for an unpaid invoice. For freelancers and small studios.

---PROMPT---
You are a calm accounts specialist who protects client relationships.
Write a follow-up about invoice {{invoice_number}} for {{client_name}}, now {{days_overdue}} days late.
1. Assume good faith.
2. State the amount and date once.
Output: a subject line and an email under 120 words.

---VARIABLES---
invoice_number | the invoice's own reference | INV-0042
client_name | who the email is addressed to | Priya at Northwind
{{days_overdue}} | how late the payment is | 12

---WHY_IT_WORKS---
It fixes the **tone** before the content.
- Role-setting keeps it calm.
- A hard word limit stops over-explaining.

---EXAMPLE_OUTPUT---
**Subject:** Invoice INV-0042 — quick check-in

Hi Priya, ...`

describe('parseTemplateReply', () => {
  it('fills every field from a well-formed reply', () => {
    const reply = parseTemplateReply(FULL_REPLY)
    expect(reply).not.toBeNull()
    expect(reply?.title).toBe('Chase an overdue invoice without sounding like a threat')
    expect(reply?.category).toBe('business-ops')
    expect(reply?.description).toMatch(/^Writes a firm/)
    expect(reply?.promptText).toMatch(/^You are a calm accounts specialist/)
    expect(reply?.promptText).toMatch(/under 120 words\.$/)
    expect(reply?.variables?.map((v) => v.name)).toEqual([
      'invoice_number',
      'client_name',
      'days_overdue',
    ])
    expect(reply?.variables?.[2]).toEqual({
      name: 'days_overdue',
      description: 'how late the payment is',
      example: '12',
      required: true,
    })
    expect(reply?.whyItWorks).toContain('- Role-setting keeps it calm.')
    expect(reply?.exampleOutput).toMatch(/^\*\*Subject:\*\*/)
  })

  it('tolerates code fences, spaced/bold/lowercase markers and a category written with its name', () => {
    const messy = [
      '```',
      '**--- title ---**',
      'Plan a launch',
      '--- CATEGORY ---',
      '`marketing` — Marketing',
      '---prompt---',
      'You are a launch strategist for {{product}}.',
      '--- VARIABLES ---',
      '- product | what is launching | a budgeting app',
      '---END---',
      '```',
    ].join('\n')
    const reply = parseTemplateReply(messy)
    expect(reply?.title).toBe('Plan a launch')
    expect(reply?.category).toBe('marketing')
    expect(reply?.promptText).toBe('You are a launch strategist for {{product}}.')
    expect(reply?.variables).toHaveLength(1)
  })

  it('still understands the old prompt-then-VARIABLES-only reply', () => {
    const legacy = 'You are a {{role}}.\n---VARIABLES---\nrole | who to be | editor'
    const reply = parseTemplateReply(legacy)
    expect(reply?.promptText).toBe('You are a {{role}}.')
    expect(reply?.variables?.[0]?.name).toBe('role')
    expect(reply?.title).toBeUndefined()
  })

  it('leaves missing sections absent rather than inventing them', () => {
    const reply = parseTemplateReply('---TITLE---\nOnly a title')
    expect(reply).toEqual({ title: 'Only a title' })
  })

  it('returns null for a paste with no markers at all', () => {
    expect(parseTemplateReply('just some prompt text with {{a_var}}')).toBeNull()
  })
})

describe('parseVariables', () => {
  it('skips malformed lines and duplicates', () => {
    const vars = parseVariables([
      'a | first | 1',
      'not a variable line',
      'a | duplicate | 2',
      'bad name! | x | y',
      '`b` | second | 2',
    ])
    expect(vars.map((v) => v.name)).toEqual(['a', 'b'])
  })
})

describe('buildPromptTemplate', () => {
  it('lists the real categories and every marker the parser understands', () => {
    const t = buildPromptTemplate([{ slug: 'chatgpt', name: 'ChatGPT' }])
    expect(t).toContain('chatgpt — ChatGPT')
    for (const s of [
      'TITLE',
      'CATEGORY',
      'DESCRIPTION',
      'PROMPT',
      'VARIABLES',
      'WHY_IT_WORKS',
      'EXAMPLE_OUTPUT',
    ]) {
      expect(t).toContain(`---${s}---`)
    }
    expect(t).toContain('no more than 5')
  })
})
