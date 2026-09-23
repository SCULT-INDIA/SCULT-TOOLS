import { createClient } from '@supabase/supabase-js'

/**
 * Hard ceiling on any single Supabase request. supabase-js's default fetch
 * has no timeout at all, so a request the gateway accepts but never answers
 * simply never resolves — and inside a `'use cache'` function during
 * static generation that is invisible: the page just never finishes. That
 * is the most likely shape of the 2026-09-18 production build that made
 * ~20,000 such requests, completed pages at full speed for seven minutes,
 * then completed none and logged nothing for the next 38. Every caller —
 * a request-time render for a slug that isn't pre-rendered, the MCP
 * tools, the CLI API, search — gets a bounded wait instead: fail in 15
 * seconds with a real error rather than hang.
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
 * The one anon-key Supabase client for this app — read-only by Row Level
 * Security on every table it touches (`skills`, `prompts`,
 * `custom_categories`; see supabase/migrations/), because the public site
 * never writes through it. Writes (admin-published Prompts/Skills) go
 * through the entirely separate, server-only connection in
 * lib/admin/pg.ts, which authenticates as a privileged Postgres role
 * instead of this anon key — the same separation `skills`'s original
 * sync worker had via its own service_role key, before this app had any
 * write path of its own at all.
 *
 * Originally lib/skills/supabase.ts, exported as `supabaseSkills`, back
 * when the Skills Library was the only table this app read from Supabase.
 * That file now re-exports this one under the same name, so none of its
 * existing callers needed to change.
 *
 * `persistSession: false` / `autoRefreshToken: false`: a server-side anon
 * client has no user session to store or refresh, and saying so stops
 * supabase-js from reaching for browser storage it doesn't have.
 */
export const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  {
    global: { fetch: fetchWithTimeout },
    auth: { persistSession: false, autoRefreshToken: false },
  },
)
