import { AsyncLocalStorage } from 'node:async_hooks'

/**
 * Carries per-request info through to individual MCP tool handlers without
 * threading it through `mcp-handler`'s `registerTool` signature (which never
 * exposes the raw `Request`). `app/api/[transport]/route.ts` opens one
 * context per incoming request around the handler; any tool handler running
 * inside that call stack can read it back via `.getStore()`. Undefined
 * outside a request (e.g. in a test) — callers treat that as 'unknown', same
 * fallback `clientIpFromHeaders` itself uses.
 *
 * Carries the caller IP (for rate-limit keys) and a coarse client label
 * derived from the request User-Agent (for MCP usage analytics — which AI
 * client is calling: Claude, Cursor, ChatGPT, …).
 */
export interface McpRequestContext {
  readonly clientIp: string
  readonly clientName: string
}

export const mcpRequestContext = new AsyncLocalStorage<McpRequestContext>()

export function currentClientIp(): string {
  return mcpRequestContext.getStore()?.clientIp ?? 'unknown'
}

export function currentClientName(): string {
  return mcpRequestContext.getStore()?.clientName ?? 'Unknown client'
}

/**
 * Coarse client label from the request User-Agent. MCP-over-HTTP clients
 * send an identifying UA (Claude's connector, Cursor, the ChatGPT connector,
 * SDK defaults); the exact `initialize` clientInfo would be marginally more
 * precise but isn't reliably reachable from a tool handler across SDK
 * versions, whereas the UA always is. Normalises the common ones to a clean
 * name, else keeps a trimmed UA so an unrecognised client is still visible.
 */
export function clientNameFromUserAgent(ua: string | null): string {
  if (!ua) return 'Unknown client'
  const s = ua.toLowerCase()
  if (s.includes('claude') || s.includes('anthropic')) return 'Claude'
  if (s.includes('cursor')) return 'Cursor'
  if (s.includes('chatgpt') || s.includes('openai')) return 'ChatGPT'
  if (s.includes('cline')) return 'Cline'
  if (s.includes('windsurf')) return 'Windsurf'
  if (s.includes('vscode') || s.includes('vs code')) return 'VS Code'
  if (s.includes('python')) return 'Python client'
  if (s.includes('node') || s.includes('undici')) return 'Node client'
  return ua.slice(0, 60)
}
