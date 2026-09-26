import { Pool } from 'pg'
import { SUPABASE_ROOT_CA } from './supabase-ca'

/**
 * The admin system's one elevated database connection.
 *
 * Every other part of this app reads Supabase through the anon key,
 * gated by RLS to published/served rows only (see lib/skills/supabase.ts,
 * lib/prompts/db.ts) — that key structurally cannot write. Admin writes
 * instead go through `SUPABASE_DB_URL`, a direct Postgres connection
 * (via the session pooler) authenticated as the `postgres` role, which
 * bypasses RLS the same way the deleted sync worker's service_role REST
 * key used to. This is the one module in the app allowed to import it;
 * every `lib/admin/*` module goes through the pool here rather than
 * opening its own connection.
 *
 * SERVER-ONLY, same convention as lib/skills/supabase.ts and lib/search.ts:
 * documented here rather than enforced by the `server-only` package (not a
 * dependency of this project) — every caller lives under lib/admin/, and
 * every one of those is imported exclusively from Route Handlers and
 * Server Components, never from a `'use client'` file. `pg`'s own Node
 * built-ins (`net`, `tls`, `dns`) would fail loudly at bundle time if a
 * client component ever tried anyway.
 *
 * A module-level singleton `Pool`, not a `Client` per call: this runs
 * inside Vercel's serverless functions, where a fresh TCP+TLS handshake
 * per request is real, measurable latency, and the session pooler is
 * built to hold a modest number of persistent connections open per
 * function instance. `max: 3` keeps that modest — this is an admin tool
 * for a small trusted team, not a high-concurrency public API.
 */
const globalForPg = globalThis as unknown as { adminPgPool?: Pool }

export function adminPool(): Pool {
  if (!globalForPg.adminPgPool) {
    const connectionString = process.env.SUPABASE_DB_URL
    if (!connectionString) {
      throw new Error(
        'adminPool(): SUPABASE_DB_URL is not set — see .env.example for how to get it (the session pooler URL, not the IPv6-only direct host).',
      )
    }
    globalForPg.adminPgPool = new Pool({
      connectionString,
      // Verify the server: Supabase's chain ends in its own root CA (not a
      // public one), so it is pinned in supabase-ca.ts. `rejectUnauthorized:
      // false` would encrypt but never authenticate — the postgres role's
      // password could be handed to whoever answers on that host.
      ssl: {
        ca: process.env.SUPABASE_DB_SSL_CA || SUPABASE_ROOT_CA,
        rejectUnauthorized: true,
      },
      max: 3,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    })
    // A pooled connection can be dropped by the server side at any time
    // (the session pooler recycles idle connections); an unhandled 'error'
    // on the pool would otherwise crash the whole Node process on the next
    // idle-connection reset, which is exactly the kind of surprise a
    // small admin tool should never inflict on the rest of the app.
    globalForPg.adminPgPool.on('error', (err) => {
      console.error(
        '[admin-pg] idle client error (pool recovers automatically):',
        err.message,
      )
    })
  }
  return globalForPg.adminPgPool
}
