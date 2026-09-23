import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** A minimal in-memory stand-in for Next's cookie store — just the three
 * methods lib/admin/auth.ts actually calls (`get`, `set`, `delete`). */
function fakeCookieStore() {
  const jar = new Map<string, string>()
  return {
    jar,
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

let store = fakeCookieStore()
vi.mock('next/headers', () => ({
  cookies: async () => store,
}))

const TEST_EMAIL = 'connect@scult.in'
const TEST_PASSWORD = 'correct-horse-battery-staple'

describe('admin auth', () => {
  let testHash: string

  beforeEach(async () => {
    store = fakeCookieStore()
    const { hashPassword } = await import('./auth')
    testHash = hashPassword(TEST_PASSWORD)
    vi.stubEnv('ADMIN_EMAIL', TEST_EMAIL)
    vi.stubEnv('ADMIN_PASSWORD_HASH', testHash)
    vi.stubEnv('ADMIN_SESSION_SECRET', 'a-test-signing-secret-not-used-anywhere-real')
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.useRealTimers()
    vi.resetModules()
  })

  describe('hashPassword / checkCredentials round-trip', () => {
    it('accepts the exact configured email and password', async () => {
      const { checkCredentials } = await import('./auth')
      expect(checkCredentials(TEST_EMAIL, TEST_PASSWORD)).toBe(true)
    })

    it('is case-insensitive and trims whitespace on the email, but not the password', async () => {
      const { checkCredentials } = await import('./auth')
      expect(checkCredentials('  Connect@Scult.IN  ', TEST_PASSWORD)).toBe(true)
      expect(checkCredentials(TEST_EMAIL, ` ${TEST_PASSWORD} `)).toBe(false)
    })

    it('rejects a wrong password', async () => {
      const { checkCredentials } = await import('./auth')
      expect(checkCredentials(TEST_EMAIL, 'wrong')).toBe(false)
    })

    it('rejects a wrong email even with the right password', async () => {
      const { checkCredentials } = await import('./auth')
      expect(checkCredentials('someone-else@scult.in', TEST_PASSWORD)).toBe(false)
    })

    it('rejects empty strings', async () => {
      const { checkCredentials } = await import('./auth')
      expect(checkCredentials('', '')).toBe(false)
    })

    it('two hashes of the same password are different (random salt) but both verify', async () => {
      const { hashPassword, checkCredentials } = await import('./auth')
      const hashA = hashPassword(TEST_PASSWORD)
      const hashB = hashPassword(TEST_PASSWORD)
      expect(hashA).not.toBe(hashB)
      vi.stubEnv('ADMIN_PASSWORD_HASH', hashA)
      expect(checkCredentials(TEST_EMAIL, TEST_PASSWORD)).toBe(true)
      vi.stubEnv('ADMIN_PASSWORD_HASH', hashB)
      expect(checkCredentials(TEST_EMAIL, TEST_PASSWORD)).toBe(true)
    })

    it('a malformed stored hash fails closed rather than throwing', async () => {
      vi.stubEnv('ADMIN_PASSWORD_HASH', 'not-a-real-hash')
      const { checkCredentials } = await import('./auth')
      expect(() => checkCredentials(TEST_EMAIL, TEST_PASSWORD)).not.toThrow()
      expect(checkCredentials(TEST_EMAIL, TEST_PASSWORD)).toBe(false)
    })

    it('throws a clear error when ADMIN_EMAIL/ADMIN_PASSWORD_HASH are unset, rather than silently accepting anything', async () => {
      vi.stubEnv('ADMIN_EMAIL', '')
      vi.stubEnv('ADMIN_PASSWORD_HASH', '')
      const { checkCredentials } = await import('./auth')
      expect(() => checkCredentials(TEST_EMAIL, TEST_PASSWORD)).toThrow(
        /ADMIN_EMAIL.*ADMIN_PASSWORD_HASH/,
      )
    })
  })

  describe('session lifecycle', () => {
    it('has no valid session before login', async () => {
      const { hasValidSession } = await import('./auth')
      expect(await hasValidSession()).toBe(false)
    })

    it('createSession then hasValidSession round-trips true', async () => {
      const { createSession, hasValidSession } = await import('./auth')
      await createSession(TEST_EMAIL)
      expect(await hasValidSession()).toBe(true)
    })

    it('getSessionEmail returns the email the session was created with', async () => {
      const { createSession, getSessionEmail } = await import('./auth')
      await createSession(TEST_EMAIL)
      expect(await getSessionEmail()).toBe(TEST_EMAIL)
    })

    it('getSessionEmail is undefined with no session', async () => {
      const { getSessionEmail } = await import('./auth')
      expect(await getSessionEmail()).toBeUndefined()
    })

    it('destroySession removes the cookie entirely', async () => {
      const { createSession, destroySession, hasValidSession } = await import('./auth')
      await createSession(TEST_EMAIL)
      await destroySession()
      expect(await hasValidSession()).toBe(false)
      expect(store.jar.has('admin_session')).toBe(false)
    })

    it('a session expires after its TTL', async () => {
      const { createSession, hasValidSession } = await import('./auth')
      await createSession(TEST_EMAIL)
      expect(await hasValidSession()).toBe(true)
      vi.advanceTimersByTime(12 * 60 * 60 * 1000 + 1)
      expect(await hasValidSession()).toBe(false)
    })

    it('a tampered payload (valid shape, wrong content) is rejected — the signature covers it', async () => {
      const { createSession, hasValidSession } = await import('./auth')
      await createSession(TEST_EMAIL)
      const token = store.jar.get('admin_session') as string
      const [body] = token.split('.')
      const forgedBody = Buffer.from(
        JSON.stringify({
          email: 'attacker@example.com',
          iat: Date.now(),
          exp: Date.now() + 999_999_999,
        }),
      ).toString('base64url')
      expect(forgedBody).not.toBe(body)
      store.jar.set('admin_session', `${forgedBody}.${token.split('.')[1]}`)
      expect(await hasValidSession()).toBe(false)
    })

    it('a cookie signed with a different secret is rejected — a stale cookie from a rotated secret cannot resurrect a session', async () => {
      const { createSession } = await import('./auth')
      await createSession(TEST_EMAIL)
      const stale = store.jar.get('admin_session')
      vi.resetModules()
      store = fakeCookieStore()
      if (stale) store.jar.set('admin_session', stale)
      vi.stubEnv('ADMIN_SESSION_SECRET', 'a-different-rotated-secret')
      const { hasValidSession } = await import('./auth')
      expect(await hasValidSession()).toBe(false)
    })

    it('a garbage cookie value is rejected, not thrown', async () => {
      store.jar.set('admin_session', 'not-a-real-token')
      const { hasValidSession } = await import('./auth')
      await expect(hasValidSession()).resolves.toBe(false)
    })

    it('a cookie with no signature separator is rejected', async () => {
      store.jar.set('admin_session', 'nodothere')
      const { hasValidSession } = await import('./auth')
      await expect(hasValidSession()).resolves.toBe(false)
    })

    it('a payload with no email field is rejected', async () => {
      const { createSession } = await import('./auth')
      await createSession(TEST_EMAIL)
      const token = store.jar.get('admin_session') as string
      const [, signaturePart] = token.split('.')
      const bodyNoEmail = Buffer.from(
        JSON.stringify({ iat: Date.now(), exp: Date.now() + 1000 }),
      ).toString('base64url')
      // Deliberately keep the ORIGINAL signature invalid for this body — a
      // forged body can never carry a valid signature without the secret,
      // so this also exercises "signature rejects first" rather than
      // "email check saves a forged token".
      store.jar.set('admin_session', `${bodyNoEmail}.${signaturePart}`)
      const { hasValidSession } = await import('./auth')
      expect(await hasValidSession()).toBe(false)
    })
  })
})
