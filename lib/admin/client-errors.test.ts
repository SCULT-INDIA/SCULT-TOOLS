import { describe, expect, it } from 'vitest'
import { loginHref, readApiFailure, safeReturnTo } from './client-errors'

function response(status: number, body: unknown): Response {
  return new Response(body === undefined ? 'not json' : JSON.stringify(body), { status })
}

describe('readApiFailure', () => {
  it('returns the field errors the API sent', async () => {
    const { errors, unauthenticated } = await readApiFailure(
      response(422, { errors: [{ field: 'slug', message: 'Taken.' }] }),
    )
    expect(errors).toEqual([{ field: 'slug', message: 'Taken.' }])
    expect(unauthenticated).toBe(false)
  })

  it('falls back to the top-level error message', async () => {
    const { errors } = await readApiFailure(
      response(500, { error: 'SUPABASE_DB_URL is not set.', code: 'not-configured' }),
    )
    expect(errors).toEqual([{ field: '(root)', message: 'SUPABASE_DB_URL is not set.' }])
  })

  it('flags a 401 so the caller can send the admin to log in', async () => {
    const { errors, unauthenticated } = await readApiFailure(response(401, undefined))
    expect(unauthenticated).toBe(true)
    expect(errors[0]?.message).toMatch(/log in again/)
  })

  it('explains a body-less 429 and 413 instead of "Request failed."', async () => {
    expect((await readApiFailure(response(429, undefined))).errors[0]?.message).toMatch(
      /Too many requests/,
    )
    expect((await readApiFailure(response(413, undefined))).errors[0]?.message).toMatch(
      /too large/,
    )
  })
})

describe('loginHref / safeReturnTo', () => {
  it('round-trips an admin path through the login URL', () => {
    const href = loginHref('/admin/prompts/new')
    expect(href).toBe('/admin/login?next=%2Fadmin%2Fprompts%2Fnew')
    const next = new URL(href, 'http://localhost').searchParams.get('next')
    expect(safeReturnTo(next)).toBe('/admin/prompts/new')
  })

  it('accepts admin and admin-preview paths only', () => {
    expect(safeReturnTo('/admin')).toBe('/admin')
    expect(safeReturnTo('/admin/skills/abc')).toBe('/admin/skills/abc')
    expect(safeReturnTo('/admin-preview/prompts/abc')).toBe('/admin-preview/prompts/abc')
    expect(safeReturnTo('/administrator')).toBe('/admin')
    expect(safeReturnTo('/prompts')).toBe('/admin')
  })

  it('refuses anything that could leave the site', () => {
    expect(safeReturnTo('//evil.example/admin')).toBe('/admin')
    expect(safeReturnTo('https://evil.example/admin')).toBe('/admin')
    expect(safeReturnTo('javascript:alert(1)')).toBe('/admin')
    expect(safeReturnTo(null)).toBe('/admin')
    expect(safeReturnTo(undefined)).toBe('/admin')
    expect(safeReturnTo('')).toBe('/admin')
  })
})
