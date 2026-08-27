import { enqueueCliEvent, flushCliEvents } from '@/lib/cli/studio-report'
import { cliJson, parseCliClient } from '@/lib/cli/track'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/**
 * POST /api/cli/v1/events
 *
 * The one telemetry event the server can't observe on its own: the CLI's
 * first-run `install` ping. Command usage is measured server-side on the
 * content routes (lib/cli/track.ts), so this endpoint accepts ONLY
 * `{ type: 'install' }` — nothing else, no free-form payloads. The CLI
 * sends it once, fire-and-forget, and never when telemetry is off.
 *
 * The client identity story is deliberately thin: an anonymous random cid
 * header (optional), the CLI/node/OS versions from the User-Agent, and the
 * request IP which Studio resolves to country/region/city at ingest — the
 * same geo treatment as browser and MCP analytics. No usernames, no machine
 * names, no persistent identifiers beyond the random cid.
 */

/** Tighter than the content routes: a machine installs once, not 60x/min. */
const MAX_PER_MINUTE = 6
const WINDOW_MS = 60_000

export async function POST(request: Request): Promise<Response> {
  const ip = clientIpFromHeaders(request.headers)
  const gate = checkRateLimit(`cli:events:${ip}`, MAX_PER_MINUTE, WINDOW_MS)
  if (!gate.allowed) {
    return cliJson({ error: 'Rate limit exceeded.' }, 429, {
      'retry-after': String(gate.retryAfterSeconds),
    })
  }

  const body = (await request.json().catch(() => null)) as { type?: unknown } | null
  if (!body || body.type !== 'install') {
    return cliJson({ error: "Body must be { type: 'install' }." }, 400)
  }

  const client = parseCliClient(request.headers)
  enqueueCliEvent({
    type: 'install',
    cli_version: client.cliVersion,
    node_version: client.nodeVersion,
    os: client.os,
    arch: client.arch,
    cid: client.cid,
    status: 'ok',
    ip,
    ts: Date.now(),
  })
  await flushCliEvents()

  // 202: accepted for processing — the CLI never waits on or retries this.
  return cliJson({ ok: true }, 202)
}
