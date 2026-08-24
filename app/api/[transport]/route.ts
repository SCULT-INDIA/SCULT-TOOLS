/**
 * The MCP (Model Context Protocol) endpoint — Streamable HTTP, mounted at
 * `/api/mcp` by `mcp-handler`'s file-path convention (the `[transport]`
 * segment plus `basePath: '/api'` below). Exposes every tool registered in
 * `lib/mcp/register.ts`: the 15 tools' pure logic, the Prompt Library, and
 * the Skills Library — so an agent can call this site's functionality
 * directly instead of going through the browser UI.
 *
 * No auth, matching the rest of this app's public/rate-limited posture (see
 * the 4 existing `app/api/*` routes). Per-tool rate limiting lives in
 * `lib/mcp/register.ts` itself (two `mcp:`-prefixed buckets, distinct from
 * the website's own limits) — this file's only job is resolving the calling
 * IP once per request and threading it through `AsyncLocalStorage`
 * (`lib/mcp/request-context.ts`) so tool handlers can read it back, since
 * `registerTool`'s handler signature never exposes the raw `Request`.
 */

import { createMcpHandler } from 'mcp-handler'
import { registerTools } from '@/lib/mcp/register'
import { mcpRequestContext } from '@/lib/mcp/request-context'
import { clientIpFromHeaders } from '@/lib/rate-limit'

/** Matches website-speed-test's own PSI budget — test_website_speed can take 15-40s. */
export const maxDuration = 60

const baseHandler = createMcpHandler(
  registerTools,
  {},
  { basePath: '/api', maxDuration: 60 },
)

async function handler(request: Request): Promise<Response> {
  const clientIp = clientIpFromHeaders(request.headers)
  return mcpRequestContext.run({ clientIp }, () => baseHandler(request))
}

export { handler as GET, handler as POST }
