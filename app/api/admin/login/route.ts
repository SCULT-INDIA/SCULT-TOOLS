import { NextResponse } from 'next/server'
import { checkCredentials, createSession } from '@/lib/admin/auth'
import { adminRoute, errorJson } from '@/lib/admin/route'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * POST /api/admin/login — the only unauthenticated admin endpoint, by
 * necessity. Body: `{ email: string, password: string }`. On a correct
 * pair, issues the signed session cookie (lib/admin/auth.ts) and returns
 * 200; on a wrong one, 401 with no detail beyond "incorrect" — never
 * distinguishing "wrong password" from "no such email", which would leak
 * information a brute-force attempt could use.
 *
 * Two rate limits apply: `adminRoute`'s general per-IP one, and this
 * much tighter one — a login endpoint gated by a single shared credential
 * is exactly what a brute-force script targets. A missing ADMIN_* env var
 * makes `checkCredentials`/`createSession` throw; `adminRoute` turns that
 * into a response that names the variable (found live 2026-09-23, when
 * production had none of them and answered every attempt with a bare 500).
 */

const MAX_ATTEMPTS_PER_WINDOW = 10
const WINDOW_MS = 60_000

export const POST = adminRoute(
  async (request) => {
    const ip = clientIpFromHeaders(request.headers)
    const gate = checkRateLimit(`admin-login:${ip}`, MAX_ATTEMPTS_PER_WINDOW, WINDOW_MS)
    if (!gate.allowed) {
      const res = errorJson('Too many attempts. Try again shortly.', 429)
      res.headers.set('retry-after', String(gate.retryAfterSeconds))
      return res
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
      return errorJson('Email and password are required.', 400)
    }

    if (!checkCredentials(body.email, body.password)) {
      return errorJson('Incorrect email or password.', 401)
    }

    await createSession(body.email.trim().toLowerCase())
    return NextResponse.json({ ok: true })
  },
  { public: true },
)
