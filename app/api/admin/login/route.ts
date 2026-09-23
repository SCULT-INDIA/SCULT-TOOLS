import { NextResponse } from 'next/server'
import { checkCredentials, createSession } from '@/lib/admin/auth'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * POST /api/admin/login — the only unauthenticated admin endpoint, by
 * necessity. Body: `{ email: string, password: string }`. On a correct
 * pair, issues the signed session cookie (lib/admin/auth.ts) and returns
 * 200; on a wrong one, 401 with no detail beyond "incorrect" — never
 * distinguishing "wrong password" from "no such email", which would leak
 * information a brute-force attempt could use.
 *
 * Rate limiting: this route lives under `/api/`, which proxy.ts's own
 * matcher deliberately excludes (every `/api/*` route is expected to
 * limit itself — see that file's own docblock). A login endpoint gated by
 * a single shared credential is exactly the kind of route a brute-force
 * script would target, so it gets its own bucket here rather than relying
 * on the page-route layer it isn't even covered by.
 */

const MAX_ATTEMPTS_PER_WINDOW = 10
const WINDOW_MS = 60_000

export async function POST(request: Request): Promise<NextResponse> {
  const ip = clientIpFromHeaders(request.headers)
  const gate = checkRateLimit(`admin-login:${ip}`, MAX_ATTEMPTS_PER_WINDOW, WINDOW_MS)
  if (!gate.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again shortly.' },
      { status: 429, headers: { 'retry-after': String(gate.retryAfterSeconds) } },
    )
  }

  const body = (await request.json().catch(() => null)) as {
    email?: unknown
    password?: unknown
  } | null
  if (
    typeof body?.email !== 'string' ||
    body.email.length === 0 ||
    typeof body?.password !== 'string' ||
    body.password.length === 0
  ) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    )
  }

  let credentialsOk: boolean
  try {
    credentialsOk = checkCredentials(body.email, body.password)
  } catch (error) {
    // `checkCredentials`/`createSession` throw a plain Error when
    // ADMIN_EMAIL/ADMIN_PASSWORD_HASH/ADMIN_SESSION_SECRET aren't set
    // (lib/admin/auth.ts) — an env var missing in this deployment, not a
    // bug in a request. Uncaught, that throw became a bare 500 with no
    // indication why (found live 2026-09-23: the admin system was new in
    // production and its three env vars were never added there). Logged
    // server-side for the real detail; the client only ever sees that
    // configuration, not credentials, is the problem.
    console.error('[admin login] misconfigured:', error)
    return NextResponse.json(
      {
        error:
          'Admin login is not configured on this deployment — ADMIN_EMAIL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET must be set as environment variables.',
      },
      { status: 500 },
    )
  }

  if (!credentialsOk) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
  }

  try {
    await createSession(body.email.trim().toLowerCase())
  } catch (error) {
    // Same misconfiguration class as above, just reached only once the
    // credentials themselves already checked out (ADMIN_SESSION_SECRET
    // specifically missing, since checkCredentials doesn't touch it).
    console.error('[admin login] misconfigured:', error)
    return NextResponse.json(
      {
        error:
          'Admin login is not configured on this deployment — ADMIN_SESSION_SECRET must be set as an environment variable.',
      },
      { status: 500 },
    )
  }
  return NextResponse.json({ ok: true })
}
