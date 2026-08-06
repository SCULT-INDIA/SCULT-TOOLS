'use client'

import { Check, Copy, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * The shared result surface for every tool.
 *
 * Two accessibility details that are easy to miss and matter a lot here:
 *   - `aria-live="polite"` on the results region, so a screen-reader user learns
 *     the computation finished. Without it a sighted-only "the number changed"
 *     signal is the entire feedback mechanism.
 *   - The copy button reports success in text, not just by swapping an icon.
 */
export function ResultPanel({
  children,
  copyText,
  empty = false,
  emptyLabel = 'Fill in the fields to see a result.',
  title = 'Result',
}: {
  children: React.ReactNode
  copyText?: string
  empty?: boolean
  emptyLabel?: string
  title?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-panel border border-line bg-cream p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-semibold text-[20px]">{title}</h3>
        {copyText && !empty ? <CopyButton text={copyText} /> : null}
      </div>

      <div aria-live="polite" aria-atomic="false">
        {empty ? (
          <p className="py-6 text-[15px] text-ink-subtle">{emptyLabel}</p>
        ) : (
          <dl className="divide-y divide-line">{children}</dl>
        )}
      </div>
    </div>
  )
}

export function ResultRow({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className={`text-[15px] ${emphasis ? 'font-bold text-ink' : 'text-ink-muted'}`}>
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? 'font-display font-bold text-[24px] text-ink tabular-nums'
            : 'font-medium text-[16px] text-ink tabular-nums'
        }
      >
        {value}
      </dd>
    </div>
  )
}

export function CopyButton({
  text,
  label = 'Copy',
  ariaLabel,
}: {
  text: string
  label?: string
  /**
   * A distinct accessible name, for lists where the visible label repeats.
   * Ten per-line copy buttons all announcing "Copy" is useless to a screen-reader
   * user, and shortening the visible label per row would clutter the design — so
   * the visible text stays "Copy" and this carries the specifics.
   *
   * Must CONTAIN the visible label to satisfy WCAG 2.5.3 Label in Name, so write
   * it as `Copy “…”` rather than replacing the word outright.
   */
  ariaLabel?: string
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), state === 'failed' ? 4000 : 2000)
    return () => clearTimeout(t)
  }, [state])

  async function copy() {
    // The clipboard API is genuinely absent in some embedded WebViews, and
    // lib.dom types `navigator.clipboard` as always present — so it is widened
    // rather than trusted.
    const clipboard = (navigator as Navigator & { clipboard?: Clipboard }).clipboard
    if (clipboard === undefined) {
      setState('failed')
      return
    }
    try {
      await clipboard.writeText(text)
      setState('copied')
    } catch {
      // Blocked by permissions policy, an insecure origin, or a WebView that
      // stubs the API and rejects. Previously this reset to idle, so the button
      // did nothing at all and said nothing — the user had no way to know the
      // copy had failed. Failure is now stated.
      setState('failed')
    }
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={copy}
      // 44px tall on touch viewports, tighter from `sm` up — see the note in
      // workspace/ToolToolbar.tsx. Copy is the most-tapped control in most tools,
      // so it is the last one that should be hard to hit.
      className={`flex min-h-11 items-center gap-1.5 rounded-sm border bg-cream px-3 py-1.5 font-medium text-[14px] transition-colors sm:min-h-9 ${
        state === 'failed' ? 'border-ink' : 'border-line-grey hover:border-ink'
      }`}
    >
      {state === 'copied' ? (
        <Check className="size-4 text-green" aria-hidden="true" />
      ) : state === 'failed' ? (
        <TriangleAlert className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {/* Wording carries the state, not the icon alone. */}
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press Ctrl+C' : label}
      {state === 'failed' ? (
        <span className="sr-only">
          — the clipboard is blocked in this browser, so select the text and copy it
          manually
        </span>
      ) : null}
    </button>
  )
}
