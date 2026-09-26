import { describe, expect, it } from 'vitest'
import { checkDbUrl, dbUrlHint } from './db-url'

const POOLER =
  'postgresql://postgres.abcdefgh:secret@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres'
const DIRECT = 'postgresql://postgres:secret@db.abcdefgh.supabase.co:5432/postgres'

describe('checkDbUrl', () => {
  it('accepts the session pooler URL', () => {
    expect(checkDbUrl(POOLER)).toEqual({
      ok: true,
      host: 'aws-0-ap-northeast-2.pooler.supabase.com',
    })
  })

  it('names the IPv6-only direct host and says what to use instead', () => {
    const r = checkDbUrl(DIRECT)
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.message).toMatch(/IPv6-only/)
    expect(r.message).toMatch(/pooler\.supabase\.com/)
    expect(r.message).not.toMatch(/secret/)
  })

  it('catches the pooler host used with the plain postgres user', () => {
    const r = checkDbUrl(
      'postgresql://postgres:secret@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
    )
    expect(r.ok).toBe(false)
    if (r.ok) return
    expect(r.message).toMatch(/postgres\.<project-ref>/)
  })

  it('rejects an unset value, a non-URL and a non-postgres scheme', () => {
    expect(checkDbUrl(undefined)).toMatchObject({ ok: false, message: /not set/ })
    expect(checkDbUrl('not a url')).toMatchObject({ ok: false, message: /valid URL/ })
    expect(checkDbUrl('https://example.com')).toMatchObject({
      ok: false,
      message: /postgresql:\/\//,
    })
  })

  it('accepts any other reachable Postgres host (self-hosted)', () => {
    expect(checkDbUrl('postgres://app:pw@10.0.0.5:5432/app')).toEqual({
      ok: true,
      host: '10.0.0.5',
    })
  })
})

describe('dbUrlHint', () => {
  it('gives the host on a good URL and the fix on a bad one, never the password', () => {
    expect(dbUrlHint(POOLER)).toBe(' Host: aws-0-ap-northeast-2.pooler.supabase.com.')
    expect(dbUrlHint(DIRECT)).toMatch(/IPv6-only/)
    expect(dbUrlHint(DIRECT)).not.toMatch(/secret/)
  })
})
