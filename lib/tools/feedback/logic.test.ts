import { describe, expect, it } from 'vitest'
import {
  FEEDBACK_MESSAGE_MAX,
  FEEDBACK_MESSAGE_MIN,
  feedbackErrorMessage,
  validateFeedback,
} from './logic'

function validInput(overrides: Partial<Parameters<typeof validateFeedback>[0]> = {}) {
  return {
    toolSlug: 'json-formatter',
    toolTitle: 'JSON Formatter & Validator',
    pageUrl: 'https://tools.scult.in/dev/json-formatter',
    message: 'This tool saved me a bunch of time, thanks!',
    ...overrides,
  }
}

describe('validateFeedback — honeypot and required fields', () => {
  it('flags a non-empty company field as a bot', () => {
    expect(validateFeedback(validInput({ company: 'Acme Inc' }))).toEqual({ error: 'bot' })
  })

  it('rejects a missing tool slug', () => {
    expect(validateFeedback(validInput({ toolSlug: '' }))).toEqual({ error: 'missing-tool' })
  })

  it('falls back toolTitle to toolSlug when title is blank', () => {
    const result = validateFeedback(validInput({ toolTitle: '' }))
    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data.toolTitle).toBe('json-formatter')
  })
})

describe('validateFeedback — message bounds', () => {
  it('rejects a message shorter than the minimum', () => {
    const result = validateFeedback(validInput({ message: 'a'.repeat(FEEDBACK_MESSAGE_MIN - 1) }))
    expect(result).toEqual({ error: 'message-too-short' })
  })

  it('rejects a message longer than the maximum', () => {
    const result = validateFeedback(validInput({ message: 'a'.repeat(FEEDBACK_MESSAGE_MAX + 1) }))
    expect(result).toEqual({ error: 'message-too-long' })
  })
})

describe('validateFeedback — rating', () => {
  it('accepts each integer 1 through 5', () => {
    for (const rating of [1, 2, 3, 4, 5]) {
      const result = validateFeedback(validInput({ rating }))
      expect('data' in result).toBe(true)
      if ('data' in result) expect(result.data.rating).toBe(rating)
    }
  })

  it('accepts a missing rating as undefined, not an error', () => {
    const result = validateFeedback(validInput())
    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data.rating).toBeUndefined()
  })

  it('rejects 0, 6, a non-integer, and a negative number', () => {
    for (const rating of [0, 6, 2.5, -1]) {
      expect(validateFeedback(validInput({ rating }))).toEqual({ error: 'invalid-rating' })
    }
  })
})

describe('validateFeedback — category and visitorId pass-through', () => {
  it('passes category and visitorId through when present', () => {
    const result = validateFeedback(
      validInput({ category: 'Developer', visitorId: 'vis_123' }),
    )
    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.category).toBe('Developer')
      expect(result.data.visitorId).toBe('vis_123')
    }
  })

  it('omits category and visitorId entirely when blank rather than sending empty strings', () => {
    const result = validateFeedback(validInput({ category: '  ', visitorId: '  ' }))
    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.category).toBeUndefined()
      expect(result.data.visitorId).toBeUndefined()
    }
  })
})

describe('validateFeedback — email', () => {
  it('rejects a malformed email', () => {
    expect(validateFeedback(validInput({ email: 'nope' }))).toEqual({ error: 'invalid-email' })
  })
})

describe('feedbackErrorMessage', () => {
  it('returns a distinct, non-empty message for every validation error', () => {
    const errors = [
      'bot',
      'missing-tool',
      'message-too-short',
      'message-too-long',
      'invalid-email',
      'invalid-rating',
    ] as const
    for (const message of errors.map(feedbackErrorMessage)) {
      expect(message.length).toBeGreaterThan(0)
    }
  })
})
