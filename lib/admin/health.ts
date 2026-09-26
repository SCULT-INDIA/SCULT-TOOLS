import { checkDbUrl, dbUrlHint } from './db-url'
import { adminPool } from './pg'
import { ADMIN_REQUIRED_ENV } from './route'

export interface AdminHealth {
  /** Required environment variables that are unset on this deployment. */
  readonly missingEnv: readonly { name: string; purpose: string }[]
  /** Whether the admin database connection answered a trivial query. */
  readonly database:
    | { readonly ok: true }
    | { readonly ok: false; readonly message: string }
}

const DB_CHECK_TIMEOUT_MS = 5_000

/**
 * What the admin dashboard shows at the top of the page — the answer to
 * "why is nothing working?" without reading a server log. Every check is
 * one that has actually failed silently in production: on 2026-09-25 the
 * admin system was deployed without SUPABASE_DB_URL, login worked (it
 * needs no database), and every write then failed with no explanation.
 */
export async function checkAdminHealth(): Promise<AdminHealth> {
  const missingEnv = ADMIN_REQUIRED_ENV.filter((v) => !process.env[v.name])
  // A URL that can never work from this host (Supabase's IPv6-only direct
  // host on Vercel, the wrong pooler user) is reported without waiting for
  // the connection to time out.
  const urlCheck = checkDbUrl(process.env.SUPABASE_DB_URL)
  if (!urlCheck.ok) {
    return { missingEnv, database: { ok: false, message: urlCheck.message } }
  }
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      adminPool().query('select 1'),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                `No answer from ${urlCheck.host} within ${DB_CHECK_TIMEOUT_MS / 1000}s.`,
              ),
            ),
          DB_CHECK_TIMEOUT_MS,
        )
      }),
    ])
    return { missingEnv, database: { ok: true } }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    return {
      missingEnv,
      database: {
        ok: false,
        message: `${detail}${dbUrlHint(process.env.SUPABASE_DB_URL)}`,
      },
    }
  } finally {
    if (timer) clearTimeout(timer)
  }
}
