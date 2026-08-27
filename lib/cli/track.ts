import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'
import { type CliEvent, enqueueCliEvent, flushCliEvents } from './studio-report'

/**
 * Cross-cutting instrumentation for every /api/cli/v1 route —
 * instrument-by-construction, same principle as lib/mcp/instrument.ts:
 * a route built with `withCliTracking()` is rate-limited, timed, and
 * reported to Studio with zero per-route code, so the CLI surface can't
 * silently grow un-measured endpoints.
 *
 * What is recorded per request: the command name (a fixed string per route,
 * never user input), CLI version / node / os / arch parsed from the
 * User-Agent the CLI sends, the anonymous cid header (absent when the user
 * opted out of telemetry), outcome, and duration. Never the query text or
 * any argument values — Studio's CLI report is usage shape, not content.
 */

/** `scult-cli/0.1.0 (win32; x64) node/20.11.0` — the UA shape cli/src/api.ts sends. */
const UA_RE =
  /^scult-cli\/([\w.+-]{1,32})(?: \(([\w-]{1,20}); ([\w-]{1,20})\))?(?: node\/([\w.]{1,20}))?/

export interface CliClientInfo {
  readonly cliVersion?: string
  readonly os?: string
  readonly arch?: string
  readonly nodeVersion?: string
  readonly cid?: string
}

export function parseCliClient(headers: Headers): CliClientInfo {
  const ua = headers.get('user-agent') ?? ''
  const m = UA_RE.exec(ua)
  const cidRaw = headers.get('x-scult-cid') ?? undefined
  // A cid is a self-reported opaque token — length-capped and
  // charset-restricted here so nothing hostile rides it into the pipeline.
  const cid = cidRaw && /^[a-zA-Z0-9-]{8,64}$/.test(cidRaw) ? cidRaw : undefined
  if (!m) return { cid }
  return {
    cliVersion: m[1],
    os: m[2],
    arch: m[3],
    nodeVersion: m[4],
    cid,
  }
}

/** Route budget per client IP — generous for a human at a terminal, tight
 * enough to stop a script hammering the endpoints. Same in-memory token
 * bucket the MCP route uses, same documented single-instance limitation. */
const MAX_PER_MINUTE = 60
const WINDOW_MS = 60_000

function json(value: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })
}

/**
 * Wraps a CLI route handler with rate limiting + Studio reporting. The
 * handler returns the response; this measures it, enqueues one `command`
 * event, and flushes after the response is built (mirroring the MCP route's
 * flush-before-freeze pattern). Instrumentation failures never affect the
 * response.
 */
export function withCliTracking(
  command: string,
  handler: (request: Request) => Promise<Response> | Response,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const started = Date.now()
    const ip = clientIpFromHeaders(request.headers)
    const client = parseCliClient(request.headers)

    const base: Omit<CliEvent, 'status' | 'ts'> = {
      type: 'command',
      command,
      cli_version: client.cliVersion,
      node_version: client.nodeVersion,
      os: client.os,
      arch: client.arch,
      cid: client.cid,
      ip,
    }

    const gate = checkRateLimit(`cli:route:${ip}`, MAX_PER_MINUTE, WINDOW_MS)
    if (!gate.allowed) {
      enqueueCliEvent({ ...base, status: 'rate_limited', ts: Date.now() })
      await flushCliEvents()
      return json({ error: 'Rate limit exceeded — try again shortly.' }, 429, {
        'retry-after': String(gate.retryAfterSeconds),
        'x-ratelimit-limit': String(MAX_PER_MINUTE),
        'x-ratelimit-remaining': '0',
      })
    }

    try {
      const response = await handler(request)
      enqueueCliEvent({
        ...base,
        status: response.status < 400 ? 'ok' : 'error',
        error: response.status >= 400 ? `http_${response.status}` : undefined,
        duration_ms: Date.now() - started,
        ts: Date.now(),
      })
      await flushCliEvents()
      return response
    } catch (err) {
      enqueueCliEvent({
        ...base,
        status: 'error',
        error: (err instanceof Error ? err.message : String(err)).slice(0, 300),
        duration_ms: Date.now() - started,
        ts: Date.now(),
      })
      await flushCliEvents()
      return json({ error: 'Internal error — try again shortly.' }, 500)
    }
  }
}

export { json as cliJson }
