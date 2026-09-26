import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** Same minimal cookie-store stand-in lib/admin/auth.test.ts uses. */
function fakeCookieStore() {
  const jar = new Map<string, string>()
  return {
    get: (name: string) =>
      jar.has(name) ? { value: jar.get(name) as string } : undefined,
    set: (name: string, value: string) => {
      jar.set(name, value)
    },
    delete: (name: string) => {
      jar.delete(name)
    },
  }
}

vi.mock('next/headers', () => ({ cookies: async () => fakeCookieStore() }))

let ipCounter = 0
function requestFor(
  email: string,
  password: string,
  ip = `10.1.0.${++ipCounter}`,
): Request {
  return new Request('http://localhost/api/admin/login', {
    method: 'POST',
    // A browser always sends Origin on a POST; adminRoute's same-origin
    // check relies on it.
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
      origin: 'http://localhost',
    },
    body: JSON.stringify({ email, password }),
  })
}
const ctx = { params: Promise.resolve({}) }

describe('POST /api/admin/login', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns a clear 500 (not an opaque crash) when ADMIN_EMAIL/ADMIN_PASSWORD_HASH are unset', async () => {
    // No ADMIN_EMAIL / ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET stubbed —
    // the exact state of a deployment where the admin env vars were never
    // added (found live 2026-09-23: production 500'd on every login
    // attempt with no indication why).
    const { POST } = await import('./route')
    const res = await POST(requestFor('connect@scult.in', 'whatever'), ctx)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.code).toBe('not-configured')
    expect(body.error).toMatch(/ADMIN_EMAIL/)
  })

  it('returns a clear 500 when only ADMIN_SESSION_SECRET is unset (credentials check out)', async () => {
    vi.stubEnv('ADMIN_EMAIL', 'connect@scult.in')
    const { hashPassword } = await import('../../../../lib/admin/auth')
    vi.stubEnv('ADMIN_PASSWORD_HASH', hashPassword('correct-horse'))
    const { POST } = await import('./route')
    const res = await POST(requestFor('connect@scult.in', 'correct-horse'), ctx)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toMatch(/ADMIN_SESSION_SECRET/)
  })

  it('still returns an ordinary 401 for a wrong password once everything is configured', async () => {
    vi.stubEnv('ADMIN_EMAIL', 'connect@scult.in')
    const { hashPassword } = await import('../../../../lib/admin/auth')
    vi.stubEnv('ADMIN_PASSWORD_HASH', hashPassword('correct-horse'))
    vi.stubEnv('ADMIN_SESSION_SECRET', 'a-test-signing-secret')
    const { POST } = await import('./route')
    const res = await POST(requestFor('connect@scult.in', 'wrong-password'), ctx)
    expect(res.status).toBe(401)
  })

  it('succeeds and issues a session once everything is configured', async () => {
    vi.stubEnv('ADMIN_EMAIL', 'connect@scult.in')
    const { hashPassword } = await import('../../../../lib/admin/auth')
    vi.stubEnv('ADMIN_PASSWORD_HASH', hashPassword('correct-horse'))
    vi.stubEnv('ADMIN_SESSION_SECRET', 'a-test-signing-secret')
    const { POST } = await import('./route')
    const res = await POST(requestFor('connect@scult.in', 'correct-horse'), ctx)
    expect(res.status).toBe(200)
  })
})
