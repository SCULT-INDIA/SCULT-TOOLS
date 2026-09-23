import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))
// Hoisted for the whole file — importing lib/admin/prompts.ts transitively
// pulls in lib/supabase-anon.ts, whose module-level `createClient(...)`
// throws immediately in a test environment with no Supabase env vars set.
// Only the two tests below that actually exercise the custom-category
// fallback override this per-call; every other test's happy/unhappy path
// never needs a real network response from it.
const getCustomCategoryMock = vi.fn().mockResolvedValue(undefined)
vi.mock('../custom-categories', () => ({ getCustomCategory: getCustomCategoryMock }))

// A real built-in category so validation's happy path exercises the real
// lib/prompts/categories.ts lookup, not a mock of it.
const REAL_CATEGORY = 'react'

const BASE_INPUT = {
  slug: 'my-new-prompt',
  category: REAL_CATEGORY,
  title: 'My New Prompt',
  description: 'A short description of what this prompt does.',
  promptText: 'Do the thing with {{variable}}.',
  whyItWorks: 'Because it constrains the model to a concrete output shape.',
}

const VERIFIED = { tool: 'ChatGPT', version: '5.1', date: '2026-09-01' }

describe('validatePromptInput', () => {
  it('accepts minimal valid input against a real built-in category', async () => {
    const { validatePromptInput } = await import('./prompts')
    const result = await validatePromptInput(BASE_INPUT)
    expect(result.ok).toBe(true)
  })

  it('rejects a badly-shaped slug', async () => {
    const { validatePromptInput } = await import('./prompts')
    const result = await validatePromptInput({ ...BASE_INPUT, slug: 'Not A Slug' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.some((e) => e.field === 'slug')).toBe(true)
  })

  it('rejects a missing required field', async () => {
    const { title: _title, ...withoutTitle } = BASE_INPUT
    const { validatePromptInput } = await import('./prompts')
    const result = await validatePromptInput(withoutTitle)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.some((e) => e.field === 'title')).toBe(true)
  })

  it('rejects an unknown category, checking custom_categories before giving up', async () => {
    getCustomCategoryMock.mockResolvedValueOnce(undefined)
    const { validatePromptInput } = await import('./prompts')
    const result = await validatePromptInput({
      ...BASE_INPUT,
      category: 'not-a-real-category',
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors.some((e) => e.field === 'category')).toBe(true)
    expect(getCustomCategoryMock).toHaveBeenCalledWith('prompt', 'not-a-real-category')
  })

  it('accepts a category found only in custom_categories', async () => {
    getCustomCategoryMock.mockResolvedValueOnce({ slug: 'my-custom-cat' })
    const { validatePromptInput } = await import('./prompts')
    const result = await validatePromptInput({ ...BASE_INPUT, category: 'my-custom-cat' })
    expect(result.ok).toBe(true)
  })
})

describe('createDraftPrompt / updatePrompt / status transitions', () => {
  const queryMock = vi.fn()

  beforeEach(() => {
    queryMock.mockReset()
    vi.doMock('./pg', () => ({ adminPool: () => ({ query: queryMock }) }))
  })

  afterEach(() => {
    vi.doUnmock('./pg')
    vi.resetModules()
  })

  it('createDraftPrompt inserts with status=draft and returns the new id', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'abc-123' }] }) // insert
    queryMock.mockResolvedValueOnce({ rows: [] }) // audit log
    const { createDraftPrompt } = await import('./prompts')
    const result = await createDraftPrompt(BASE_INPUT)
    expect(result).toEqual({ ok: true, id: 'abc-123', slug: 'my-new-prompt' })
    const insertSql = queryMock.mock.calls[0]?.[0] as string
    expect(insertSql).toContain("'draft'")
  })

  it('createDraftPrompt reports a duplicate (category, slug) as a slug field error', async () => {
    vi.resetModules()
    queryMock.mockRejectedValueOnce({ code: '23505' })
    const { createDraftPrompt } = await import('./prompts')
    const result = await createDraftPrompt(BASE_INPUT)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('slug')
  })

  it('createDraftPrompt never touches the database for invalid input', async () => {
    vi.resetModules()
    const { createDraftPrompt } = await import('./prompts')
    await createDraftPrompt({ ...BASE_INPUT, slug: 'BAD' })
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('publishPrompt refuses a prompt with no verifiedAgainst entries', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'p1',
          slug: 'x',
          category: 'react',
          title: 'X',
          status: 'draft',
          variables: [],
          verified_against: [],
        },
      ],
    })
    const { publishPrompt } = await import('./prompts')
    const result = await publishPrompt('p1')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('verifiedAgainst')
    // Only the select ran — no update was attempted once readiness failed.
    expect(queryMock).toHaveBeenCalledTimes(1)
  })

  it('publishPrompt succeeds and sets status=published when verifiedAgainst is present', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          id: 'p1',
          slug: 'x',
          category: 'react',
          title: 'X',
          status: 'draft',
          variables: [],
          verified_against: [VERIFIED],
        },
      ],
    })
    queryMock.mockResolvedValueOnce({ rows: [] }) // update
    queryMock.mockResolvedValueOnce({ rows: [] }) // audit log
    const { publishPrompt } = await import('./prompts')
    const result = await publishPrompt('p1')
    expect(result).toEqual({ ok: true, id: 'p1', slug: 'x' })
    const updateSql = queryMock.mock.calls[1]?.[0] as string
    expect(updateSql).toContain("status = 'published'")
  })

  it('publishPrompt reports "no prompt" for an unknown id instead of throwing', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { publishPrompt } = await import('./prompts')
    const result = await publishPrompt('does-not-exist')
    expect(result.ok).toBe(false)
  })

  it('unpublishPrompt sets status=unpublished', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'p1', slug: 'x' }] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { unpublishPrompt } = await import('./prompts')
    const result = await unpublishPrompt('p1')
    expect(result).toEqual({ ok: true, id: 'p1', slug: 'x' })
    expect(queryMock.mock.calls[1]?.[1]).toEqual(['p1', 'unpublished'])
  })

  it('archivePrompt sets status=archived', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'p1', slug: 'x' }] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { archivePrompt } = await import('./prompts')
    const result = await archivePrompt('p1')
    expect(result).toEqual({ ok: true, id: 'p1', slug: 'x' })
    expect(queryMock.mock.calls[1]?.[1]).toEqual(['p1', 'archived'])
  })

  it('deletePrompt removes the row and logs the deletion with the fetched slug', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [{ id: 'p1', slug: 'x' }] }) // select
    queryMock.mockResolvedValueOnce({ rows: [] }) // delete
    queryMock.mockResolvedValueOnce({ rows: [] }) // audit log
    const { deletePrompt } = await import('./prompts')
    const result = await deletePrompt('p1', 'connect@scult.in')
    expect(result).toEqual({ ok: true, id: 'p1', slug: 'x' })
    const deleteSql = queryMock.mock.calls[1]?.[0] as string
    expect(deleteSql).toContain('delete from prompts')
    expect(queryMock.mock.calls[1]?.[1]).toEqual(['p1'])
    const auditSql = queryMock.mock.calls[2]?.[0] as string
    const auditParams = queryMock.mock.calls[2]?.[1] as unknown[]
    expect(auditSql).toContain('insert into admin_audit_log')
    expect(auditParams).toEqual(['connect@scult.in', 'delete', 'prompt', 'p1', 'x', '{}'])
  })

  it('deletePrompt reports "no prompt" for an unknown id instead of throwing, and never issues a delete', async () => {
    vi.resetModules()
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { deletePrompt } = await import('./prompts')
    const result = await deletePrompt('does-not-exist')
    expect(result.ok).toBe(false)
    expect(queryMock).toHaveBeenCalledTimes(1)
  })
})
