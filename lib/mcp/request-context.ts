import { AsyncLocalStorage } from 'node:async_hooks'

/**
 * Carries the calling IP through to individual MCP tool handlers without
 * threading it through `mcp-handler`'s `registerTool` signature (which never
 * exposes the raw `Request`). `app/api/[transport]/route.ts` opens one
 * context per incoming request around the handler; any tool handler running
 * inside that call stack can read it back via `.getStore()`. Undefined
 * outside a request (e.g. in a test) — callers treat that as 'unknown', same
 * fallback `clientIpFromHeaders` itself uses.
 */
export interface McpRequestContext {
  readonly clientIp: string
}

export const mcpRequestContext = new AsyncLocalStorage<McpRequestContext>()

export function currentClientIp(): string {
  return mcpRequestContext.getStore()?.clientIp ?? 'unknown'
}
