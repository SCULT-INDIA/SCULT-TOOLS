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
export async function flushMcpEvents(): Promise<void> {
  const apiKey = process.env.SCULT_STUDIO_API_KEY
  if (!apiKey || buffer.length === 0) {
    buffer = []
    return
  }
  const events = buffer
  buffer = []
  // One IP per batch (single client per request) — used server-side for geo.
  const ip = events.find((e) => e.ip)?.ip
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FLUSH_TIMEOUT_MS)
    await fetch(STUDIO_ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ events, ip }),
    }).finally(() => clearTimeout(timeout))
  } catch {
    // Analytics must never break the MCP server. Dropped on any error.
  }
}
