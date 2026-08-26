import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { currentClientIp, currentClientName } from './request-context'
import { enqueueMcpEvent } from './studio-report'

/**
 * Instrument-by-construction (tracking plan P5): wraps the MCP server's
 * `registerTool` so EVERY tool — the 26 today and any added later — is
 * timed, classified (ok / error / rate-limited), and reported to Studio,
 * with zero per-tool code. There is no un-instrumented path to register a
 * tool through, so the catalogue can't silently grow holes the way adding a
 * log line to each handler would.
 *
 * A tool's own rate-limit gate returns an error result whose text this
 * server formats as "Rate limited (<bucket> bucket: …)". The wrapper reads
 * that back so a block is recorded as a `rate_limited` event tagged with the
 * bucket — the rate-limit logs the plan's P6 asks for, from the data that
 * already flows through here.
 *
 * Never changes what a tool returns and never throws: a failure in the
 * instrumentation must not affect the tool call.
 */

const RATE_LIMIT_RE = /Rate limited \((general|heavy|external) bucket/i

type ToolResult = {
  content?: Array<{ type: string; text?: string }>
  isError?: boolean
}

// registerTool is overloaded (name, config, handler) and (name, handler);
// the handler is always the last function argument. We wrap that one.
// deno-lint / ts: the SDK's exact tuple types vary by version, so this
// intentionally works structurally over unknown[].
type AnyHandler = (...args: unknown[]) => ToolResult | Promise<ToolResult>

export function instrumentMcpServer(server: McpServer): McpServer {
  const original = server.registerTool.bind(server) as (...args: unknown[]) => unknown

  const patched = (...args: unknown[]): unknown => {
    const name = typeof args[0] === 'string' ? (args[0] as string) : 'unknown'
    const handlerIdx = args.length - 1
    const handler = args[handlerIdx]
    if (typeof handler !== 'function') return original(...args)

    const wrapped: AnyHandler = async (...handlerArgs: unknown[]) => {
      const start = Date.now()
      const clientName = currentClientName()
      const ip = currentClientIp()
      try {
        const result = (await (handler as AnyHandler)(...handlerArgs)) as ToolResult
        const duration = Date.now() - start
        const firstText = result?.content?.find((c) => c.type === 'text')?.text ?? ''
        const rl = result?.isError ? RATE_LIMIT_RE.exec(firstText) : null

        if (rl) {
          enqueueMcpEvent({
            type: 'rate_limited',
            tool: name,
            bucket: (rl[1] ?? 'unknown').toLowerCase(),
            client_name: clientName,
            status: 'rate_limited',
            ip,
            ts: Date.now(),
          })
        } else {
          enqueueMcpEvent({
            type: 'tool_call',
            tool: name,
            client_name: clientName,
            status: result?.isError ? 'error' : 'ok',
            error: result?.isError ? firstText.slice(0, 300) : undefined,
            duration_ms: duration,
            ip,
            ts: Date.now(),
          })
        }
        return result
      } catch (err) {
        // A throw from the tool itself — record it, then re-throw so the SDK
        // handles it exactly as it would have without instrumentation.
        enqueueMcpEvent({
          type: 'tool_call',
          tool: name,
          client_name: clientName,
          status: 'error',
          error: (err instanceof Error ? err.message : String(err)).slice(0, 300),
          duration_ms: Date.now() - start,
          ip,
          ts: Date.now(),
        })
        throw err
      }
    }

    const nextArgs = [...args]
    nextArgs[handlerIdx] = wrapped
    return original(...nextArgs)
  }

  // Only registerTool is intercepted; everything else passes through.
  ;(server as unknown as { registerTool: unknown }).registerTool = patched
  return server
}
