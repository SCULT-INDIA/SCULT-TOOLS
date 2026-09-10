import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Production incident guard: `app/api/[transport]/route.ts` must always pass
 * `disableSse: true` to `createMcpHandler`.
 *
 * What happens without it, reproduced locally against a real dev server:
 * `mcp-handler`'s SSE transport (`/api/sse`, `/api/message`) unconditionally
 * calls its own `initializeRedis`, which throws `Error: redisUrl is
 * required` whenever `REDIS_URL`/`KV_URL` is unset — true of every
 * environment this app runs in; this codebase has no Redis anywhere. The
 * library never attaches a `.catch()` to the call that reaches that throw
 * (`void fn(fakeServerResponse)` inside its `createServerResponseAdapter`),
 * so the failure surfaced as an **unhandled promise rejection on every
 * single request to `/api/sse`** — logged verbatim as
 * `⨯ unhandledRejection: Error: redisUrl is required`, each hit hanging for
 * ~20 seconds before resolving. On `next start`'s one long-lived process
 * (this app's real deployment, not the per-request isolation of a
 * serverless platform), a recurring unhandled rejection on a publicly
 * reachable, crawlable endpoint is exactly the kind of standing liability
 * that turns into an unexplained production crash loop over hours of
 * traffic — the mechanism this test exists to make impossible to
 * reintroduce silently.
 *
 * `disableSse: true` makes both paths 404 before the library ever reaches
 * Redis (verified locally: 65ms/21ms 404s, zero unhandled rejections,
 * versus the ~20s hang before). It costs nothing this app was using —
 * `/mcp`'s own page already states "Streamable HTTP, the current MCP
 * transport — one URL, no separate SSE endpoint", and no code in this repo
 * ever points a client at `/api/sse`.
 *
 * A source-text check rather than an import-and-invoke test: importing the
 * route module pulls in `lib/skills/db.ts`'s module-scope Supabase client
 * construction, which throws in a bare `vitest` environment with no
 * `.env.local` loaded (`supabaseUrl is required`) — a real gap in this
 * project's test env setup, but fixing that is out of scope for guarding
 * one config flag. Same spirit as `lib/no-hardcoded-booking-url.test.ts`:
 * assert against what the file actually says.
 */
/**
 * Comments explaining `disableSse: true` inevitably contain that exact
 * phrase in prose, so matching against the raw file text is checking that
 * the comment exists, not that the code does — this survived exactly that:
 * flipping the real config to `disableSse: false` while the explanatory
 * comment above it still said "true" left the naive regex passing. Block
 * and line comments are stripped first so the match can only land on code.
 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

describe('MCP route: SSE transport stays disabled', () => {
  it('passes disableSse: true to createMcpHandler, in code, not just in a comment', () => {
    const source = readFileSync(
      join(process.cwd(), 'app', 'api', '[transport]', 'route.ts'),
      'utf8',
    )
    const code = stripComments(source)
    // Anchored to the real call, not just "the string true appears
    // somewhere" — a config that later renamed or restructured this option
    // without keeping it `true` should fail loudly here, not pass by luck.
    expect(code).toMatch(/createMcpHandler\(/)
    expect(code).toMatch(/disableSse:\s*true/)
  })

  it('sanity check: the comment-stripper actually strips, so the test above cannot pass on prose alone', () => {
    const source = readFileSync(
      join(process.cwd(), 'app', 'api', '[transport]', 'route.ts'),
      'utf8',
    )
    expect(stripComments(source)).not.toMatch(/deployment sets no REDIS_URL/)
  })
})
