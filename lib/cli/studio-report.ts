/**
 * Reports CLI events (commands served by /api/cli/v1/*, install pings) to
 * SCULT Studio's analytics — the CLI sibling of lib/mcp/studio-report.ts,
 * same contract: buffered, flushed opportunistically after a response,
 * never blocks or fails the request being measured, every failure
 * swallowed.
 *
 * CLI users' machines never talk to Studio directly (an npm package can't
 * hold the API key) — the tools server is the only reporter, using the same
 * server-only SCULT_STUDIO_API_KEY as the MCP reporter. When the key is
 * unset the reporter is inert (no throw): CLI requests work exactly the
 * same, they just aren't recorded.
 */

const DEFAULT_ENDPOINT = 'https://studio.scult.in/api/v1/cli/events'
const FLUSH_AT = 20
const FLUSH_TIMEOUT_MS = 3000

export interface CliEvent {
  type: 'install' | 'command'
  command?: string
  cli_version?: string
  node_version?: string
  os?: string
  arch?: string
  /** Anonymous random client id from the CLI's local config — absent when
   * the user opted out of telemetry. Never derived from anything
   * identifying. */
  cid?: string
  status?: 'ok' | 'error' | 'rate_limited'
  error?: string
  duration_ms?: number
  ip?: string
  ts: number
}

let buffer: CliEvent[] = []

export function enqueueCliEvent(ev: CliEvent): void {
  buffer.push(ev)
  if (buffer.length >= FLUSH_AT) void flushCliEvents()
}

/**
 * Ship whatever's buffered. Called after each /api/cli request completes so
 * events actually leave before a serverless instance freezes; flushing
 * per-request means a batch is naturally one client / one IP, which is what
 * the Studio endpoint resolves geo from. Awaited with a hard timeout so it
 * can't add meaningful latency, and it never throws.
 */
export async function flushCliEvents(): Promise<void> {
  const apiKey = process.env.SCULT_STUDIO_API_KEY
  if (!apiKey || buffer.length === 0) {
    buffer = []
    return
  }
  const events = buffer
  buffer = []
  const ip = events.find((e) => e.ip)?.ip
  const endpoint = process.env.SCULT_STUDIO_CLI_EVENTS_URL || DEFAULT_ENDPOINT
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FLUSH_TIMEOUT_MS)
    await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ events, ip }),
    }).finally(() => clearTimeout(timeout))
  } catch {
    // Analytics must never break the CLI API. Dropped on any error.
  }
}
