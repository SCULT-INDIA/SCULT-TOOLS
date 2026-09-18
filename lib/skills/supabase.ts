import { createClient } from '@supabase/supabase-js'

/**
 * Hard ceiling on any single Supabase request. supabase-js's default fetch
 * has no timeout at all, so a request the gateway accepts but never answers
 * simply never resolves — and inside a `'use cache'` function during
 * static generation that is invisible: the page just never finishes. That
 * is the most likely shape of the 2026-09-18 production build that made
 * ~20,000 such requests, completed pages at full speed for seven minutes,
 * then completed none and logged nothing for the next 38. The build no
 * longer makes those requests (see ./snapshot.ts), but every remaining
 * caller — a request-time render for a slug that isn't pre-rendered, the
 * MCP `get_skill` tool, the CLI API, search — gets a bounded wait: fail in
 * 15 seconds with a real error rather than hang.
 */
const REQUEST_TIMEOUT_MS = 15_000

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const signal =
    init?.signal && typeof AbortSignal.any === 'function'
      ? AbortSignal.any([init.signal, timeout])
      : (init?.signal ?? timeout)
  return fetch(input, { ...init, signal })
}

/**
 * The Skills Library's only database client. Uses the anon key exclusively
 * — read-only by Row Level Security (see supabase/migrations/0001_create_skills.sql)
 * — because this app never writes to `skills`. Writes came only from the
 * separate sync worker's service_role key, which lived in that project's
 * own environment, never this one (and that worker has since been deleted;
 * see ./db.ts's header).
 *
 * `persistSession: false` / `autoRefreshToken: false`: a server-side anon
 * client has no user session to store or refresh, and saying so stops
 * supabase-js from reaching for browser storage it doesn't have.
 */
export const supabaseSkills = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  {
    global: { fetch: fetchWithTimeout },
    auth: { persistSession: false, autoRefreshToken: false },
  },
)
