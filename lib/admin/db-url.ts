/**
 * Static sanity check of `SUPABASE_DB_URL` — the one admin configuration
 * problem that is invisible until the first write: the value can be a
 * perfectly valid Postgres URL that this deployment simply cannot reach.
 *
 * Supabase offers two hosts for the same database. The direct one,
 * `db.<ref>.supabase.co`, is IPv6-only; Vercel's functions have no IPv6
 * egress, so from there every connection fails with ENETUNREACH/ETIMEDOUT
 * while the very same URL works from a developer's machine. The session
 * pooler, `aws-0-<region>.pooler.supabase.com:5432` with the user
 * `postgres.<ref>`, is reachable over IPv4. This check names that mistake
 * up front (on the /admin dashboard and in the API error) instead of
 * leaving "the database connection failed" to be debugged by hand.
 *
 * Only the host and user are inspected; the password never leaves the URL.
 */
export type DbUrlCheck =
  | { readonly ok: true; readonly host: string }
  | { readonly ok: false; readonly host: string | null; readonly message: string }

const DIRECT_HOST = /^db\.[a-z0-9]+\.supabase\.co$/i
const POOLER_HOST = /\.pooler\.supabase\.com$/i

export function checkDbUrl(value: string | undefined): DbUrlCheck {
  if (!value) return { ok: false, host: null, message: 'SUPABASE_DB_URL is not set.' }
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return {
      ok: false,
      host: null,
      message:
        'SUPABASE_DB_URL is not a valid URL (expected postgresql://user:password@host:port/db).',
    }
  }
  if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
    return {
      ok: false,
      host: url.hostname,
      message: `SUPABASE_DB_URL must start with postgresql:// (got ${url.protocol}).`,
    }
  }
  const host = url.hostname
  if (DIRECT_HOST.test(host)) {
    return {
      ok: false,
      host,
      message: `SUPABASE_DB_URL points at ${host}, Supabase's direct host, which is IPv6-only and unreachable from Vercel. Use the session pooler URL instead: postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres (Supabase dashboard → Connect → Session pooler).`,
    }
  }
  if (POOLER_HOST.test(host) && !/^postgres\./.test(decodeURIComponent(url.username))) {
    return {
      ok: false,
      host,
      message: `SUPABASE_DB_URL uses the session pooler host but the user is "${url.username}" — the pooler needs "postgres.<project-ref>".`,
    }
  }
  return { ok: true, host }
}

/** The host-only hint appended to connection failures from `adminRoute`. */
export function dbUrlHint(value: string | undefined): string {
  const check = checkDbUrl(value)
  if (!check.ok) return ` ${check.message}`
  return ` Host: ${check.host}.`
}
