import { describe, expect, it } from 'vitest'
import { parseMessage, replyText, stem } from './assistant-reply'

describe('stem', () => {
  it('returns a prefix of the word that also matches its other forms', () => {
    expect(stem('chasing')).toBe('chas')
    expect(stem('planning')).toBe('plan')
    expect(stem('invoices')).toBe('invoice')
    expect(stem('audited')).toBe('audit')
    expect(stem('categories')).toBe('categor')
    for (const w of ['chasing', 'planning', 'invoices', 'audited', 'categories']) {
      expect(w.startsWith(stem(w))).toBe(true)
    }
  })

  it('refuses stems that would be too short or wrong to be useful', () => {
    expect(stem('thing')).toBe('thing')
    expect(stem('speed')).toBe('speed')
    expect(stem('css')).toBe('css')
    expect(stem('status')).toBe('status')
    expect(stem('analysis')).toBe('analysis')
    expect(stem('gst')).toBe('gst')
  })
})

describe('parseMessage', () => {
  it('strips conversational filler down to the searchable keywords, stemmed', () => {
    const parsed = parseMessage('I need something for chasing an overdue invoice')
    expect(parsed.display).toBe('chasing overdue invoice')
    expect(parsed.terms).toEqual(['chas', 'overdue', 'invoice'])
    expect(parsed.keywords).toBe('chas overdue invoice')
  })

  it('treats catalogue nouns as intent signals, not search terms', () => {
    const parsed = parseMessage('show me prompts for react testing')
    expect(parsed.intents).toEqual(['prompt'])
    expect(parsed.display).toBe('react testing')
    expect(parsed.keywords).toBe('react test')
  })

  it('keeps tool-type words that are also real search terms', () => {
    const parsed = parseMessage('a gst calculator')
    expect(parsed.intents).toEqual(['tool'])
    expect(parsed.display).toBe('gst calculator')
  })

  it('recognises a bare greeting', () => {
    const parsed = parseMessage('Hi!')
    expect(parsed.greeting).toBe(true)
    expect(parsed.keywords).toBe('')
  })

  it('records intents in the order mentioned, once each', () => {
    expect(parseMessage('skills and tools and skills').intents).toEqual(['skill', 'tool'])
  })
})

describe('replyText', () => {
  const none = { tools: 0, prompts: 0, skills: 0 }

  it('greets when there is nothing to search for', () => {
    expect(replyText(parseMessage('hello'), none, false)).toMatch(/^Hi!/)
  })

  it('points at the catalogue when only an intent was given', () => {
    expect(replyText(parseMessage('prompts'), none, false)).toContain(
      'where the prompts live',
    )
  })

  it('counts each catalogue and joins them naturally', () => {
    const text = replyText(
      parseMessage('invoice'),
      { tools: 1, prompts: 3, skills: 2 },
      false,
    )
    expect(text).toBe(
      "Here's what I found for “invoice”: 1 tool, 3 prompts and 2 skills.",
    )
  })

  it('stays honest while skills are still loading', () => {
    expect(replyText(parseMessage('invoice'), none, true)).toMatch(
      /^Checking the skills library/,
    )
    expect(
      replyText(parseMessage('invoice'), { tools: 2, prompts: 0, skills: 0 }, true),
    ).toContain('still checking skills')
  })

  it('never says "nothing found" before the tools/prompts index has loaded', () => {
    const text = replyText(parseMessage('invoice'), none, false, true)
    expect(text).toMatch(/^Searching for/)
    expect(text).not.toContain("couldn't find")
  })

  it('offers a way forward when nothing matched', () => {
    expect(replyText(parseMessage('xyzzy'), none, false)).toContain(
      "couldn't find anything",
    )
  })
})
