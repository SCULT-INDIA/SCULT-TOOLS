import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * POST /api/revalidate — on-demand cache invalidation for the skills
 * registry, so content goes stale because the sync worker actually changed
 * something, not because an arbitrary timer expired (the `cacheLife`
 * windows in lib/skills/db.ts are the fallback for when this is never
 * called, not the primary freshness mechanism).
 *
 * Not wired up to anything yet: the sync worker is a separate Vercel
 * project (see memory: it isn't git-connected, deploys via its own CLI)
 * that this repo has no access to. This endpoint is the receiving half —
 * making it call `POST https://tools.scult.in/api/revalidate` with the
 * shared secret after each successful sync run is a change in that other
 * project, still to be made.
 *
 * Auth is a single shared secret compared in constant time, the same shape
 * as that project's own `CRON_SECRET` — a bearer token, not a session,
 * because the caller is a server-to-server webhook, not a browser.
 */
const MAX_PER_MINUTE = 10
const WINDOW_MS = 60_000

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  // Length must match before timingSafeEqual (it throws on unequal lengths),
  // but comparing lengths first leaks only the length, never byte content.
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function POST(request: Request): Promise<Response> {
  const ip = clientIpFromHeaders(request.headers)
  const gate = checkRateLimit(`revalidate:${ip}`, MAX_PER_MINUTE, WINDOW_MS)
  if (!gate.allowed) {
    return Response.json(
      { error: 'Rate limit exceeded.' },
      { status: 429, headers: { 'retry-after': String(gate.retryAfterSeconds) } },
    )
  }

  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    console.error('POST /api/revalidate: REVALIDATE_SECRET is not configured')
    return Response.json({ error: 'Not configured.' }, { status: 503 })
  }

  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!provided || !timingSafeEqualStrings(provided, secret)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as { tag?: unknown } | null
  const tag =
    typeof body?.tag === 'string' && body.tag.trim() !== '' ? body.tag.trim() : 'skills'

  revalidateTag(tag, 'max')

  return Response.json({ ok: true, tag, revalidatedAt: new Date().toISOString() })
}
