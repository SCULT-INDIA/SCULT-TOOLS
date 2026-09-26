import { NextResponse } from 'next/server'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { hasValidSession } from './auth'

/**
 * The one wrapper every `/api/admin/*` Route Handler goes through. It
 * exists because on 2026-09-25 production admin returned a bare
 * "Request failed." for every prompt created: `SUPABASE_DB_URL` was
 * missing from the deployment, `adminPool()` threw, and the throw escaped
 * the handler as an opaque 500 with no message anywhere the admin could
 * see it. Nothing in the route code was wrong — the failure just had no
 * path to the person who could fix it.
 *
 * In order, for every request:
 *   1. Per-IP rate limit. The session cookie is the real gate; this only
 *      bounds what a stolen cookie or a runaway script can do per minute.
 *   2. Same-origin check on every mutation (anything but GET/HEAD). The
 *      session cookie is SameSite=Lax, which already stops a cross-site
 *      form POST from carrying it — this is the second lock: a mutation
 *      must arrive with an Origin (or Referer) on this deployment's own
 *      host. Browsers send Origin on every POST/PATCH/DELETE, so a real
 *      admin never trips it.
 *   3. Session check (skipped for `public` routes — login and logout).
 *   4. The handler, inside a try/catch that turns any throw into a JSON
 *      error the forms can display — a missing environment variable is
 *      named explicitly; anything else gets a generic message plus a
 *      reference id that matches the server log line.
 *   5. `Cache-Control: no-store` on every response, so authenticated
 *      admin data is never cached by a browser or an intermediary.
 *
 * Errors are returned in the same `{ errors: [{ field, message }] }`
 * shape the validation layer uses, so every form's existing error list
 * renders them without a second code path.
 */

type RouteContext<P> = { params: Promise<P> }
type Handler<P> = (
  request: Request,
  context: RouteContext<P>,
) => Promise<Response> | Response

const RATE_LIMIT_MAX = 240
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_BURST = 60

/** Environment variables the admin system cannot run without, and what
 * each one is for — used to name the missing one in an error. */
export const ADMIN_REQUIRED_ENV: readonly { name: string; purpose: string }[] = [
  { name: 'ADMIN_EMAIL', purpose: 'the admin login email' },
  { name: 'ADMIN_PASSWORD_HASH', purpose: 'the admin password (scrypt digest)' },
  { name: 'ADMIN_SESSION_SECRET', purpose: 'signing the login session cookie' },
  { name: 'SUPABASE_DB_URL', purpose: 'the database connection admin writes go through' },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    purpose: 'the public Supabase API the site reads from',
  },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', purpose: 'the public Supabase read key' },
]

export function errorJson(
  message: string,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { error: message, errors: [{ field: '(root)', message }], ...extra },
    { status, headers: { 'cache-control': 'no-store' } },
  )
}

/** Maps a thrown error to the message an admin should see. Configuration
 * problems are named (they are the admin's own to fix); everything else
 * stays generic with a reference id, since a raw database or stack
 * message belongs in the server log, not a browser. */
export function describeAdminError(
  error: unknown,
  ref: string,
): { message: string; code: string } {
  const text = error instanceof Error ? error.message : String(error)
  const missing = ADMIN_REQUIRED_ENV.find((v) => text.includes(v.name))
  if (missing) {
    return {
      code: 'not-configured',
      message: `This deployment is missing the ${missing.name} environment variable (${missing.purpose}). Add it in the hosting dashboard and redeploy.`,
    }
  }
  const pgCode = (error as { code?: unknown } | null)?.code
  if (
    typeof pgCode === 'string' &&
    /^(ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ECONNRESET|28P01|28000|3D000|57P01|08\d{3})$/.test(
      pgCode,
    )
  ) {
    return {
      code: 'database-unreachable',
      message: `The database connection failed (${pgCode}). Check SUPABASE_DB_URL and that the database is reachable from this deployment. Ref ${ref}.`,
    }
  }
  return {
    code: 'server-error',
    message: `Something went wrong on the server. Ref ${ref} — this id is in the server log.`,
  }
}

function sameOriginAsRequest(request: Request): boolean {
  const requestHost = new URL(request.url).host
  for (const header of ['origin', 'referer']) {
    const value = request.headers.get(header)
    if (!value) continue
    try {
      return new URL(value).host === requestHost
    } catch {
      return false
    }
  }
  return false
}

function withNoStore(response: Response): Response {
  if (!response.headers.has('cache-control')) {
    response.headers.set('cache-control', 'no-store')
  }
  return response
}

export function adminRoute<P = Record<string, never>>(
  handler: Handler<P>,
  options: { public?: boolean } = {},
): Handler<P> {
  return async (request, context) => {
    const ip = clientIpFromHeaders(request.headers)
    const gate = checkRateLimit(
      `admin-api:${ip}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_BURST,
    )
    if (!gate.allowed) {
      const res = errorJson('Too many requests — wait a moment and try again.', 429)
      res.headers.set('retry-after', String(gate.retryAfterSeconds))
      return res
    }

    if (
      request.method !== 'GET' &&
      request.method !== 'HEAD' &&
      !sameOriginAsRequest(request)
    ) {
      return errorJson('Cross-site request blocked.', 403)
    }

    const ref = Math.random().toString(36).slice(2, 10)
    try {
      if (!options.public && !(await hasValidSession())) {
        return errorJson('Not authenticated — log in again.', 401, {
          code: 'unauthenticated',
        })
      }
      return withNoStore(await handler(request, context))
    } catch (error) {
      const { message, code } = describeAdminError(error, ref)
      console.error(
        `[admin api] ${request.method} ${new URL(request.url).pathname} ref=${ref}:`,
        error,
      )
      return errorJson(message, 500, { code })
    }
  }
}
