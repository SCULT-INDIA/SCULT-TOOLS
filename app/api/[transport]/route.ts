/**
 * The MCP (Model Context Protocol) endpoint — Streamable HTTP, mounted at
 * `/api/mcp` by `mcp-handler`'s file-path convention (the `[transport]`
 * segment plus `basePath: '/api'` below). Exposes every tool registered in
 * `lib/mcp/register.ts`: the site's tools' pure logic, the Prompt Library,
 * and the Skills Library — so an agent can call this site's functionality
 * directly instead of going through the browser UI.
 *
 * No auth, matching the rest of this app's public/rate-limited posture (see
 * the other `app/api/*` routes). Defence here is layered:
 *
 *  1. THIS FILE gates the whole protocol surface per client IP — including
 *     `initialize`, `tools/list`, and malformed traffic that never reaches a
 *     tool handler. Without it, everything that wasn't a tool call ran
 *     unlimited on a route with a 60s duration budget.
 *  2. THIS FILE rejects oversized bodies before JSON parsing. The largest
 *     legitimate request is a favicon upload (~2.8MB of base64 inside JSON);
 *     4MB covers it with headroom while stopping memory-pressure payloads.
 *  3. `lib/mcp/register.ts` then applies per-tool budgets (general 30/min,
 *     heavy 6/min, external 3/min) and zod schemas with hard caps on every
 *     string/array/number.
 *
 * The per-IP key is resolved once per request and threaded through
 * `AsyncLocalStorage` (`lib/mcp/request-context.ts`) so tool handlers can
 * read it back — `registerTool`'s handler signature never exposes the raw
 * `Request`.
 */

import { createMcpHandler } from 'mcp-handler'
import { instrumentMcpServer } from '@/lib/mcp/instrument'
import { registerTools } from '@/lib/mcp/register'
import { clientNameFromUserAgent, mcpRequestContext } from '@/lib/mcp/request-context'
import { flushMcpEvents } from '@/lib/mcp/studio-report'
import { checkRateLimit, clientIpFromHeaders } from '@/lib/rate-limit'

/** Matches website-speed-test's own PSI budget — test_website_speed can take 15-40s. */
export const maxDuration = 60

/** Protocol-level budget: every HTTP request to this route counts, whatever
 * JSON-RPC method it carries. Deliberately looser than any per-tool bucket —
 * its job is stopping connection floods and list-spam, not policing tool
 * usage, so a well-behaved agent burst (initialize + tools/list + a dozen
 * calls) never brushes against it. */
const ROUTE_MAX_PER_MINUTE = 120
const ROUTE_WINDOW_MS = 60_000

/** 4MB: the favicon tool's ~2.8MB base64 cap plus JSON-RPC envelope headroom. */
const MAX_BODY_BYTES = 4 * 1024 * 1024

const baseHandler = createMcpHandler(
  // instrumentMcpServer wraps registerTool so every tool call, error and
  // rate-limit block is timed and reported to Studio by construction — see
  // lib/mcp/instrument.ts. It changes nothing a tool returns.
  (server) => registerTools(instrumentMcpServer(server)),
  {
    serverInfo: { name: 'scult-tools', version: '1.1.0' },
    instructions: [
      'Every free tool on tools.scult.in, callable directly: SEO utilities (schema markup, FAQ schema, UTM builder), business tools (invoice totals, marketing ROI, name/slogan generators), developer utilities (JSON formatter, word counter, QR codes, favicons, colour palettes), live site audits (check_ai_visibility, test_website_speed), and keyword search over the 1,170-prompt Prompt Library, the 50,000-skill Skills Library, the blog, and the guides.',
      'Start with list_site_tools to see the full catalogue. Search tools return compact results — follow up with the matching get_* tool for full content.',
      'Rate limits per client: 30 calls/min for lookups and pure computation, 6/min for favicon rendering, 3/min for the two live-audit tools (they hit external APIs). Rate-limit errors state the bucket and when to retry.',
    ].join('\n'),
  },
  { basePath: '/api', maxDuration: 60 },
)

function jsonRpcError(
  status: number,
  code: number,
  message: string,
  headers?: HeadersInit,
): Response {
  return new Response(
    JSON.stringify({ jsonrpc: '2.0', id: null, error: { code, message } }),
    { status, headers: { 'content-type': 'application/json', ...headers } },
  )
}

async function handler(request: Request): Promise<Response> {
  const clientIp = clientIpFromHeaders(request.headers)

  const gate = checkRateLimit(
    `mcp:route:${clientIp}`,
    ROUTE_MAX_PER_MINUTE,
    ROUTE_WINDOW_MS,
  )
  if (!gate.allowed) {
    return jsonRpcError(429, -32000, 'Too many requests — slow down.', {
      'retry-after': String(gate.retryAfterSeconds),
      'x-ratelimit-limit': String(ROUTE_MAX_PER_MINUTE),
      'x-ratelimit-remaining': '0',
    })
  }

  // Content-Length is trustworthy here: the platform proxy enforces that
  // the declared length matches the delivered body, and SDK clients always
  // send it. A missing header on a POST (chunked encoding) gets the same
  // rejection — no legitimate MCP client streams its requests.
  if (request.method === 'POST') {
    const declared = Number(request.headers.get('content-length'))
    if (!Number.isFinite(declared) || declared <= 0 || declared > MAX_BODY_BYTES) {
      return jsonRpcError(
        413,
        -32600,
        `Request body must declare a Content-Length of at most ${MAX_BODY_BYTES} bytes.`,
      )
    }
  }

  const clientName = clientNameFromUserAgent(request.headers.get('user-agent'))
  const response = await mcpRequestContext.run({ clientIp, clientName }, () =>
    baseHandler(request),
  )

  // Deliberately NOT awaited. Awaiting put Studio's whole round trip
  // (network + geo lookup + insert) in front of the AI client's response,
  // so analytics latency became tool latency — the opposite of the point.
  // `waitUntil` hands the flush to the platform, which keeps the instance
  // alive until it finishes without holding up the reply; where it is
  // unavailable we fall back to fire-and-forget, and anything still
  // buffered is retried on the next request (see studio-report.ts).
  const ctx = (globalThis as { waitUntil?: (p: Promise<unknown>) => void }).waitUntil
  const flush = flushMcpEvents()
  if (typeof ctx === 'function') ctx(flush)
  else void flush

  return response
}

export { handler as GET, handler as POST }
