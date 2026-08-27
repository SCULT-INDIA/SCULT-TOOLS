/**
 * Reports MCP events (tool calls, rate-limit blocks, errors) to SCULT
 * Studio's analytics — the server-side half of the tracking plan's §7.
 * MCP callers are AI agents with no browser, so this is the only way that
 * usage becomes visible. Never blocks or fails a tool call: buffered,
 * flushed opportunistically, and every failure is swallowed.
 *
 * Uses the same server-only SCULT_STUDIO_API_KEY as lib/studio.ts. When the
 * key is unset the reporter is inert (no throw) — MCP calls work exactly as
 * before, they just aren't recorded.
 */

const STUDIO_ENDPOINT = 'https://studio.scult.in/api/v1/mcp/events'
const FLUSH_AT = 20
const FLUSH_TIMEOUT_MS = 3000

export interface McpEvent {
  type: 'tool_call' | 'rate_limited' | 'error' | 'handshake'
  tool?: string
  client_name?: string
  client_version?: string
  status?: 'ok' | 'error' | 'rate_limited'
  error?: string
  duration_ms?: number
  bucket?: string
  ip?: string
  ts: number
}

let buffer: McpEvent[] = []

export function enqueueMcpEvent(ev: McpEvent): void {
  buffer.push(ev)
  if (buffer.length >= FLUSH_AT) void flushMcpEvents()
}

/**
 * Ship whatever's buffered. Called after each MCP HTTP request completes
 * (route.ts) so events actually leave before a serverless instance freezes;
 * flushing per-request means a batch is naturally one client / one IP, which
 * is what the Studio endpoint resolves geo from. Fire-and-forget: awaited
 * with a hard timeout so it can't add meaningful latency, and it never
 * throws.
 */
/** Cap on retained events. A Studio outage must not grow this buffer
 * without bound in a long-lived instance; past the cap the OLDEST events
 * are dropped, since recent activity is the more useful signal. */
const MAX_BUFFERED = 500

export async function flushMcpEvents(): Promise<void> {
  const apiKey = process.env.SCULT_STUDIO_API_KEY
  if (!apiKey || buffer.length === 0) {
    if (!apiKey) buffer = [] // nothing can ever send these; don't leak memory
    return
  }
  const events = buffer
  buffer = []

  // Group by caller IP and send one batch per distinct IP.
  //
  // Studio resolves geo ONCE per batch from a single `ip` field. This
  // buffer is module-scoped, so on a warm serverless instance two
  // different MCP clients' events interleave in it — previously the whole
  // mixed batch was stamped with whichever IP happened to appear first,
  // silently attributing one client's calls to another client's city and
  // country. Splitting per IP makes the per-batch geo assumption true
  // instead of merely usually-true.
  const byIp = new Map<string, McpEvent[]>()
  for (const ev of events) {
    const k = ev.ip ?? ''
    const list = byIp.get(k)
    if (list) list.push(ev)
    else byIp.set(k, [ev])
  }

  const failed: McpEvent[] = []
  await Promise.all(
    [...byIp.entries()].map(async ([ip, group]) => {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), FLUSH_TIMEOUT_MS)
        const res = await fetch(STUDIO_ENDPOINT, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ events: group, ip: ip || undefined }),
        }).finally(() => clearTimeout(timeout))

        // A 4xx means Studio will never accept this payload — retrying it
        // forever would block the buffer behind a poison batch. Only
        // transient failures (5xx, timeout, network) are worth keeping.
        if (!res.ok && res.status >= 500) failed.push(...group)
      } catch {
        failed.push(...group)
      }
    }),
  )

  // Put transient failures back so the next request retries them, rather
  // than discarding data the moment Studio blips.
  if (failed.length > 0) {
    buffer = [...failed, ...buffer].slice(-MAX_BUFFERED)
  }
}
