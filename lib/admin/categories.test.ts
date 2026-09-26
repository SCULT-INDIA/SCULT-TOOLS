import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isRasterImageDataUrl, validateCategory } from './categories'

describe('isRasterImageDataUrl', () => {
  it('accepts well-formed raster image data URLs', () => {
    expect(isRasterImageDataUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true)
    expect(isRasterImageDataUrl('data:image/webp;base64,UklGRg==')).toBe(true)
  })

  it('rejects SVG (can carry script), non-image types, and malformed base64', () => {
    expect(isRasterImageDataUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBe(false)
    expect(isRasterImageDataUrl('data:text/html;base64,PGI+')).toBe(false)
    expect(isRasterImageDataUrl('data:image/png;base64,not base64!')).toBe(false)
    expect(isRasterImageDataUrl('https://example.com/logo.png')).toBe(false)
  })

  it('is enforced by the category schema', () => {
    const base = {
      contentType: 'skill' as const,
      slug: 'x',
      name: 'X',
      blurb: 'b',
      intro: 'i',
      icon: 'Sparkles',
      tile: 'green' as const,
    }
    expect(
      validateCategory({ ...base, logoDataUrl: 'data:image/svg+xml;base64,PHN2Zz4=' }).ok,
    ).toBe(false)
    expect(
      validateCategory({ ...base, logoDataUrl: 'data:image/png;base64,iVBORw0KGgo=' }).ok,
    ).toBe(true)
  })
})

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

const VALID_SKILL = {
  contentType: 'skill' as const,
  slug: 'my-new-category',
  name: 'My New Category',
  blurb: 'A short one-liner.',
  intro: 'A longer paragraph explaining the category.',
  icon: 'Sparkles',
  tile: 'green' as const,
}

const VALID_PROMPT = {
  ...VALID_SKILL,
  contentType: 'prompt' as const,
  group: 'development',
}

describe('validateCategory', () => {
  it('accepts a well-formed skill category', () => {
    const result = validateCategory(VALID_SKILL)
    expect(result.ok).toBe(true)
  })

  it('accepts a well-formed prompt category with a group', () => {
    const result = validateCategory(VALID_PROMPT)
    expect(result.ok).toBe(true)
  })

  it('accepts a prompt category with no group — createCustomCategory defaults it to "development"', () => {
    const { group: _group, ...withoutGroup } = VALID_PROMPT
    const result = validateCategory(withoutGroup)
    expect(result.ok).toBe(true)
  })

  it('does not require a group for a skill category', () => {
    const result = validateCategory(VALID_SKILL)
    expect(result.ok).toBe(true)
  })

  it('repairs a slug that only looked wrong instead of rejecting it', () => {
    const result = validateCategory({ ...VALID_SKILL, slug: 'Not A Slug!' })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.slug).toBe('not-a-slug')
  })

  it('rejects a slug with nothing usable in it and names the field', () => {
    const result = validateCategory({ ...VALID_SKILL, slug: '★★★' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.some((e) => e.field === 'slug')).toBe(true)
  })

  it('rejects a missing required field', () => {
    const { name: _name, ...withoutName } = VALID_SKILL
    const result = validateCategory(withoutName)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.some((e) => e.field === 'name')).toBe(true)
  })

  it('rejects an invalid tile value', () => {
    const result = validateCategory({ ...VALID_SKILL, tile: 'purple' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.some((e) => e.field === 'tile')).toBe(true)
  })

  it('rejects completely malformed input rather than throwing', () => {
    const result = validateCategory('not an object at all')
    expect(result.ok).toBe(false)
  })
})

describe('createCustomCategory', () => {
  const queryMock = vi.fn()

  beforeEach(() => {
    queryMock.mockReset()
    vi.doMock('./pg', () => ({ adminPool: () => ({ query: queryMock }) }))
  })

  afterEach(() => {
    vi.doUnmock('./pg')
    vi.resetModules()
  })

  it('returns the validation errors without touching the database for invalid input', async () => {
    vi.resetModules()
    const { createCustomCategory } = await import('./categories')
    const result = await createCustomCategory({ ...VALID_SKILL, slug: '★★★' })
    expect(result.ok).toBe(false)
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('inserts and returns ok on success, and logs the action to the audit trail', async () => {
    vi.resetModules()
    queryMock.mockResolvedValue({ rows: [] })
    const { createCustomCategory } = await import('./categories')
    const result = await createCustomCategory(VALID_SKILL)
    expect(result).toEqual({ ok: true, slug: 'my-new-category' })
    // Once for the insert, once for lib/admin/audit.ts's own insert into
    // admin_audit_log — both go through the same mocked pool.
    expect(queryMock).toHaveBeenCalledTimes(2)
    const queries = queryMock.mock.calls.map((call) => call[0])
    expect(queries.some((sql) => sql.includes('insert into custom_categories'))).toBe(
      true,
    )
    expect(queries.some((sql) => sql.includes('insert into admin_audit_log'))).toBe(true)
  })

  it('defaults a prompt category with no group to "development" on insert', async () => {
    vi.resetModules()
    queryMock.mockResolvedValue({ rows: [] })
    const { createCustomCategory } = await import('./categories')
    const { group: _group, ...withoutGroup } = VALID_PROMPT
    const result = await createCustomCategory(withoutGroup)
    expect(result.ok).toBe(true)
    const insertCall = queryMock.mock.calls.find((call) =>
      call[0].includes('insert into custom_categories'),
    )
    expect(insertCall?.[1]).toContain('development')
  })

  it('writes a null group for a skill category, never defaulting it', async () => {
    vi.resetModules()
    queryMock.mockResolvedValue({ rows: [] })
    const { createCustomCategory } = await import('./categories')
    await createCustomCategory(VALID_SKILL)
    const insertCall = queryMock.mock.calls.find((call) =>
      call[0].includes('insert into custom_categories'),
    )
    expect(insertCall?.[1]).toContain(null)
  })

  it('writes an uploaded logoDataUrl through to the insert', async () => {
    vi.resetModules()
    queryMock.mockResolvedValue({ rows: [] })
    const { createCustomCategory } = await import('./categories')
    await createCustomCategory({
      ...VALID_SKILL,
      logoDataUrl: 'data:image/png;base64,iVBORw0KGgo=',
    })
    const insertCall = queryMock.mock.calls.find((call) =>
      call[0].includes('insert into custom_categories'),
    )
    expect(insertCall?.[1]).toContain('data:image/png;base64,iVBORw0KGgo=')
  })

  it('reports a duplicate slug as a field error, not an unhandled throw', async () => {
    vi.resetModules()
    queryMock.mockRejectedValue({ code: '23505', message: 'duplicate key value' })
    const { createCustomCategory } = await import('./categories')
    const result = await createCustomCategory(VALID_SKILL)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors).toEqual([
        {
          field: 'slug',
          message: 'A skill category with slug "my-new-category" already exists.',
        },
      ])
    }
  })

  it('rethrows a non-duplicate database error rather than swallowing it', async () => {
    vi.resetModules()
    queryMock.mockRejectedValue(new Error('connection reset'))
    const { createCustomCategory } = await import('./categories')
    await expect(createCustomCategory(VALID_SKILL)).rejects.toThrow('connection reset')
  })
})
