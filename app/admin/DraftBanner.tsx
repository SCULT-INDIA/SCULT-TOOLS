'use client'

/** The "your unsaved work came back" bar every admin form shows after
 * `useFormDraft` restores a draft. `note` is for the one thing a draft
 * can't hold — a file the admin has to pick again. */
export function DraftBanner({
  restoredAt,
  onDiscard,
  note,
}: {
  restoredAt: number | null
  onDiscard: () => void
  note?: string
}) {
  if (restoredAt === null) return null
  const when = new Date(restoredAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
      <span>
        Restored your unsaved draft from {when}.{note ? ` ${note}` : ''}
      </span>
      <button type="button" onClick={onDiscard} className="font-semibold underline">
        Discard draft
      </button>
    </div>
  )
}
