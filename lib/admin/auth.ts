import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * Admin session handling — one shared login (`ADMIN_EMAIL` /
 * `ADMIN_PASSWORD_HASH`), a signed session cookie (`ADMIN_SESSION_SECRET`),
 * no per-person accounts or Supabase Auth. This is the same v1 choice made
 * explicitly over a full auth provider as the passcode scheme it replaces
 * (2026-09-22 → 2026-09-23): a small trusted team, self-serve publish (no
 * second approver), fastest to ship, and now an actual login identity
 * (`session.email`) that flows into `lib/admin/audit.ts`'s `actor` column
 * — the passcode version had no identity to log beyond an optional
 * free-text field nobody was required to fill in.
 *
 * The password is never stored or compared in plaintext, including in
 * environment variables: `ADMIN_PASSWORD_HASH` holds a scrypt digest
 * (`salt:hash`, both hex), generated once via `hashPassword` and pasted
 * into `.env.local`/Vercel — see `scripts/hash-admin-password.mjs`. This
 * is a real step up from the passcode scheme's plaintext `ADMIN_PASSCODE`
 * env var: a leaked `ADMIN_PASSWORD_HASH` (a misconfigured dashboard, a
 * support ticket, a screen share) does not hand over the credential
 * itself, whereas a leaked `ADMIN_PASSCODE` always was the credential.
 *
 * The cookie is a signed, NOT encrypted, token: `payload.signature`,
 * where `payload` is a base64url JSON object `{ email, iat, exp }` and
 * `signature` is an HMAC-SHA256 of `payload` keyed on
 * `ADMIN_SESSION_SECRET`. Signing (not just a random opaque token checked
 * against a server-side store) means no session table and no cleanup job
 * for an admin tool this small — the cookie IS the session, verifiable
 * statelessly on every request, and `exp` bounds how long a stolen cookie
 * stays useful. `email` rides in the payload only for display/audit
 * attribution — it is never treated as authorization by itself, since the
 * signature is what proves the cookie was actually issued by this server.
 */

const COOKIE_NAME = 'admin_session'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12h — long enough for a work session, short enough that a stale forgotten login doesn't linger for days.
const SCRYPT_KEY_LENGTH = 64

interface SessionPayload {
  readonly email: string
  readonly iat: number
  readonly exp: number
}

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set — see .env.example. The admin area cannot issue or verify sessions without it.',
    )
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

/** Constant-time signature comparison — a naive `===` here would leak the
 * correct signature one byte at a time through response-timing, the same
 * class of bug string-comparing a password directly would be. */
function signaturesMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

/** `undefined` for anything not a validly-signed, unexpired token —
 * malformed, wrong signature, or expired are all just "not a session",
 * never a distinguishable error (nothing about *why* a token is rejected
 * should be visible to whoever presented it). */
function decodeSession(token: string): SessionPayload | undefined {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return undefined
  const body = token.slice(0, dot)
  const signature = token.slice(dot + 1)
  if (!signaturesMatch(signature, sign(body))) return undefined
  let payload: SessionPayload
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return undefined
  }
  if (typeof payload.exp !== 'number' || Date.now() >= payload.exp) return undefined
  if (typeof payload.email !== 'string' || payload.email.length === 0) return undefined
  return payload
}

/**
 * Derives a `salt:hash` digest (both hex) from a plaintext password —
 * scrypt, Node's built-in memory-hard KDF, so no extra dependency (bcrypt
 * needs a native binding; argon2 needs one too) while still being far
 * harder to brute-force offline than a raw SHA-256 hash would be. Run this
 * once per password (`scripts/hash-admin-password.mjs`) and paste the
 * result into `ADMIN_PASSWORD_HASH` — never call it at request time.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

/** Verifies a submitted password against a `hashPassword` digest,
 * constant-time on the final comparison. Malformed stored hashes (wrong
 * shape, not hex) fail closed rather than throwing — a corrupt
 * `ADMIN_PASSWORD_HASH` should read as "no admin can log in", never as a
 * server error that might leak stack details. */
function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  let salt: Buffer
  let expected: Buffer
  try {
    salt = Buffer.from(saltHex, 'hex')
    expected = Buffer.from(hashHex, 'hex')
  } catch {
    return false
  }
  if (salt.length === 0 || expected.length !== SCRYPT_KEY_LENGTH) return false
  const actual = scryptSync(password, salt, SCRYPT_KEY_LENGTH)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

/** Case-insensitive, trimmed exact match — an admin's email is an
 * identifier here, not a secret; the password is what's actually being
 * verified. Plain comparison (not constant-time) is fine for a value this
 * app also happily displays back in the audit log. */
function emailsMatch(submitted: string, expected: string): boolean {
  return submitted.trim().toLowerCase() === expected.trim().toLowerCase()
}

/** Checks a submitted email+password pair against `ADMIN_EMAIL` /
 * `ADMIN_PASSWORD_HASH`. Always runs `verifyPassword` even when the email
 * already doesn't match, against a static all-zero placeholder hash of
 * the same shape — so a wrong email doesn't short-circuit the request
 * measurably faster than a wrong password would, which would otherwise
 * let an attacker enumerate valid admin emails by response timing alone. */
export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL
  const expectedHash = process.env.ADMIN_PASSWORD_HASH
  if (!expectedEmail || !expectedHash) {
    throw new Error('ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set — see .env.example.')
  }
  const emailOk = emailsMatch(email, expectedEmail)
  const decoyHash = `${'00'.repeat(16)}:${'00'.repeat(SCRYPT_KEY_LENGTH)}`
  const passwordOk = verifyPassword(password, emailOk ? expectedHash : decoyHash)
  return emailOk && passwordOk
}

/** Issues a fresh session cookie for the given email — call after
 * `checkCredentials` succeeds. */
export async function createSession(email: string): Promise<void> {
  const now = Date.now()
  const token = encodeSession({ email, iat: now, exp: now + SESSION_TTL_MS })
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** True if the current request carries a valid, unexpired admin session.
 * Every admin Server Component and Route Handler gates on this — see
 * app/admin/layout.tsx and lib/admin/require-session.ts. */
export async function hasValidSession(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  return decodeSession(token) !== undefined
}

/** The logged-in admin's email for the current request, or `undefined`
 * outside a valid session — the real identity `lib/admin/audit.ts`'s
 * `actor` column now records, in place of the passcode scheme's optional
 * free-text author name. */
export async function getSessionEmail(): Promise<string | undefined> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return undefined
  return decodeSession(token)?.email
}
