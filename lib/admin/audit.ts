import { adminPool } from './pg'

/**
 * The append-only audit trail (migration 0007's `admin_audit_log`) — the
 * actual answer to "who published what, when" given v1's auth is one
 * shared email+password login rather than per-person accounts (see
 * lib/admin/auth.ts's docblock). `actor` is the logged-in session's email
 * (`getSessionEmail()`), threaded in by every `app/api/admin/*` route —
 * a real identity, not the free-text field this used to fall back to
 * before the passcode scheme was replaced. Every mutating `lib/admin/*`
 * function calls this once its write has actually committed.
 *
 * Deliberately a normal, awaited insert — not the fire-and-forget pattern
 * lib/cli/track.ts and the MCP reporter use for their own event logs. This
 * IS the record, not best-effort telemetry about one; a lost audit entry
 * would be a real gap, not a shrug.
 */
export interface AuditEntry {
  readonly actor?: string
  readonly action: 'create' | 'update' | 'publish' | 'unpublish' | 'archive' | 'delete'
  readonly contentType: 'prompt' | 'skill' | 'category'
  readonly contentId: string
  readonly contentSlug?: string
  readonly details?: Record<string, unknown>
}

export async function logAdminAction(entry: AuditEntry): Promise<void> {
  await adminPool().query(
    `insert into admin_audit_log (actor, action, content_type, content_id, content_slug, details)
     values ($1, $2, $3, $4, $5, $6)`,
    [
      entry.actor ?? 'admin',
      entry.action,
      entry.contentType,
      entry.contentId,
      entry.contentSlug ?? null,
      JSON.stringify(entry.details ?? {}),
    ],
  )
}
