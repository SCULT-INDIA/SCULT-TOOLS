import { describe, expect, it } from 'vitest'
import {
  REQUEST_DESCRIPTION_MAX,
  REQUEST_DESCRIPTION_MIN,
  REQUEST_TITLE_MAX,
  REQUEST_TITLE_MIN,
  requestErrorMessage,
  validateRequest,
} from './logic'

function validInput(overrides: Partial<Parameters<typeof validateRequest>[0]> = {}) {
  return {
    kind: 'tool_request',
    title: 'A bulk QR code generator',
    description: 'It should take a CSV of URLs and output one QR code per row.',
    pageUrl: 'https://tools.scult.in/all',
    ...overrides,
  }
}

describe('validateRequest — kind', () => {
  it('accepts each of the three real kinds', () => {
    for (const kind of ['tool_request', 'prompt_request', 'skill_request']) {
      const result = validateRequest(validInput({ kind }))
      expect('data' in result).toBe(true)
    }
  })

  it('rejects a kind that is not one of the three', () => {
    const result = validateRequest(validInput({ kind: 'something_else' }))
    expect(result).toEqual({ error: 'invalid-kind' })
  })

  it('rejects a missing kind', () => {
    const result = validateRequest(validInput({ kind: undefined }))
    expect(result).toEqual({ error: 'invalid-kind' })
  })
})

describe('validateRequest — honeypot', () => {
  it('flags a non-empty company field as a bot, before any other check', () => {
    const result = validateRequest(validInput({ company: 'Acme Inc' }))
    expect(result).toEqual({ error: 'bot' })
  })

  it('is unaffected by an empty or whitespace-only company field', () => {
    const result = validateRequest(validInput({ company: '   ' }))
    expect('data' in result).toBe(true)
  })
})

describe('validateRequest — title bounds', () => {
  it('rejects a title shorter than the minimum', () => {
    const result = validateRequest(
      validInput({ title: 'a'.repeat(REQUEST_TITLE_MIN - 1) }),
    )
    expect(result).toEqual({ error: 'title-too-short' })
  })

  it('accepts a title at exactly the minimum', () => {
    const result = validateRequest(validInput({ title: 'a'.repeat(REQUEST_TITLE_MIN) }))
    expect('data' in result).toBe(true)
  })

  it('rejects a title longer than the maximum', () => {
    const result = validateRequest(
      validInput({ title: 'a'.repeat(REQUEST_TITLE_MAX + 1) }),
    )
    expect(result).toEqual({ error: 'title-too-long' })
  })

  it('accepts a title at exactly the maximum', () => {
    const result = validateRequest(validInput({ title: 'a'.repeat(REQUEST_TITLE_MAX) }))
    expect('data' in result).toBe(true)
  })

  it('trims surrounding whitespace before measuring length', () => {
    const result = validateRequest(
      validInput({ title: `  ${'a'.repeat(REQUEST_TITLE_MIN)}  ` }),
    )
    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data.title).toBe('a'.repeat(REQUEST_TITLE_MIN))
  })
})

describe('validateRequest — description bounds', () => {
  it('rejects a description shorter than the minimum', () => {
    const result = validateRequest(
      validInput({ description: 'a'.repeat(REQUEST_DESCRIPTION_MIN - 1) }),
    )
    expect(result).toEqual({ error: 'description-too-short' })
  })

  it('rejects a description longer than the maximum', () => {
    const result = validateRequest(
      validInput({ description: 'a'.repeat(REQUEST_DESCRIPTION_MAX + 1) }),
    )
    expect(result).toEqual({ error: 'description-too-long' })
  })
})

describe('validateRequest — optional fields', () => {
  it('rejects a malformed email', () => {
    const result = validateRequest(validInput({ email: 'not-an-email' }))
    expect(result).toEqual({ error: 'invalid-email' })
  })

  it('accepts a missing email as undefined, not an error', () => {
    const result = validateRequest(validInput())
    expect('data' in result).toBe(true)
    if ('data' in result) expect(result.data.email).toBeUndefined()
  })

  it('passes affectedTool, name, and visitorId through when present', () => {
    const result = validateRequest(
      validInput({
        affectedTool: 'JSON Formatter',
        name: 'Ada',
        visitorId: 'vis_123',
      }),
    )
    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.affectedTool).toBe('JSON Formatter')
      expect(result.data.name).toBe('Ada')
      expect(result.data.visitorId).toBe('vis_123')
    }
  })

  it('omits affectedTool/name/visitorId entirely when blank rather than sending empty strings', () => {
    const result = validateRequest(
      validInput({ affectedTool: '  ', name: '  ', visitorId: '  ' }),
    )
    expect('data' in result).toBe(true)
    if ('data' in result) {
      expect(result.data.affectedTool).toBeUndefined()
      expect(result.data.name).toBeUndefined()
      expect(result.data.visitorId).toBeUndefined()
    }
  })
})

describe('requestErrorMessage', () => {
  it('returns a distinct, non-empty message for every validation error', () => {
    const errors = [
      'bot',
      'invalid-kind',
      'title-too-short',
      'title-too-long',
      'description-too-short',
      'description-too-long',
      'invalid-email',
    ] as const
    const messages = errors.map(requestErrorMessage)
    for (const message of messages) expect(message.length).toBeGreaterThan(0)
  })
})
