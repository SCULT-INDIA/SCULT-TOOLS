'use client'

// TriangleAlert, not AlertTriangle — this lucide version dropped the old alias.
import { Check, ShieldCheck, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * The workspace's status strip — plan §3.
 *
 * Carries validity, counts and the privacy claim in one persistent row, so the
 * output pane never has to spend space on a "✓ Valid JSON" banner and the tool
 * always has somewhere to put live counters.
 *
 * The whole strip is a polite live region: state changes here (valid → invalid,
 * counts updating) are exactly what a screen-reader user needs announced, and
 * routing them through one region avoids the several-competing-announcements
 * problem you get when each stat announces itself.
 */
export function StatusBar({
  state = 'neutral',
  message,
  stats,
  privacyNote,
}: {
  /**
   * `warn` exists for the case the speed test surfaced: a run that completed
   * successfully but reports a failing result. Borrowing `invalid` there would
   * imply the request itself failed, which is a different and misleading thing.
   */
  state?: 'valid' | 'invalid' | 'warn' | 'neutral'
  message?: string
  stats?: readonly { label: string; value: string }[]
  privacyNote?: string
}) {
  return (
    <div
      aria-live="polite"
      className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 text-[13px]"
    >
      {message ? (
        <span className="inline-flex items-center gap-1.5 font-medium">
          {state === 'valid' ? (
            <Check className="size-4 text-green" aria-hidden="true" />
          ) : null}
          {state === 'invalid' || state === 'warn' ? (
            <TriangleAlert className="size-4 text-ink" aria-hidden="true" />
          ) : null}
          {/* Colour is never the sole signal — the icon and the wording both
              carry the state, per the project's accessibility rules. */}
          <span
            className={
              state === 'invalid' || state === 'warn' ? 'text-ink' : 'text-ink-muted'
            }
          >
            {message}
          </span>
        </span>
      ) : null}

      {stats?.map((s) => (
        <span key={s.label} className="inline-flex items-baseline gap-1.5">
          <span className="font-semibold text-ink tabular-nums">{s.value}</span>
          <span className="text-ink-subtle">{s.label}</span>
        </span>
      ))}

      {privacyNote ? (
        <span className="ml-auto inline-flex items-center gap-1.5 text-ink-subtle">
          <ShieldCheck className="size-3.5 text-green" aria-hidden="true" />
          {privacyNote}
        </span>
      ) : null}
    </div>
  )
}

/** Inline error detail with a jump-to-line affordance. */
export function ErrorDetail({
  line,
  column,
  message,
  snippet,
  action,
}: {
  line?: number | null
  column?: number | null
  message: string
  snippet?: string | null
  action?: ReactNode
}) {
  return (
    // print-paper-ctx: bg-peach is one of the "pastel accents — all light, black
    // text only" tokens (see globals.css §BRAND) and is never overridden for dark
    // mode. border-ink/text-ink below, left un-pinned, would invert to their
    // near-white dark-theme value while this peach fill stays fixed-light,
    // making the whole error box unreadable. Freezing ink/line here keeps it a
    // permanently light chip, matching the peach token's own contract.
    <div className="rounded-card border border-ink bg-peach p-4 print-paper-ctx">
      <p className="font-semibold text-[14px] text-ink">
        {line != null
          ? `Line ${line}${column != null ? `, column ${column}` : ''} — `
          : ''}
        {message}
      </p>
      {snippet ? (
        <pre className="mt-2 overflow-x-auto rounded-sm bg-white/70 p-2 font-mono text-[12px] text-ink">
          {snippet}
        </pre>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
