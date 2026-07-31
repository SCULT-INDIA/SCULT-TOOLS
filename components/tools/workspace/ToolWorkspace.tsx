'use client'

import type { ReactNode } from 'react'

/**
 * The shared two-pane tool workspace — see docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * Every tool adopts this. It exists because each of the 15 tools previously
 * invented its own arrangement, which produced the failure the redesign is
 * fixing: a narrow input on the left, the result rendered in a separate panel
 * far below it, and two empty states saying the same thing.
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ toolbar                                      │
 *   ├───────────────────────┬──────────────────────┤
 *   │ input pane            │ output pane          │
 *   ├───────────────────────┴──────────────────────┤
 *   │ status bar                                   │
 *   └──────────────────────────────────────────────┘
 *
 * Layout contract:
 *   - Full container width; panes are equal height and scroll independently.
 *   - `minHeight` defaults to a value that keeps the whole workspace usable
 *     without scrolling on a 1366x768 laptop.
 *   - On mobile the panes stack. `outputFirstOnMobile` flips the order so the
 *     result — the thing the visitor came for — is what they land on.
 */
export function ToolWorkspace({
  toolbar,
  input,
  output,
  status,
  inputLabel = 'Input',
  outputLabel = 'Result',
  minHeight = 'min-h-[26rem]',
  outputFirstOnMobile = false,
}: {
  toolbar?: ReactNode
  input: ReactNode
  output: ReactNode
  status?: ReactNode
  inputLabel?: string
  outputLabel?: string
  /**
   * A free class slot applied to BOTH pane sections, not strictly a minimum.
   *
   * Named for its common case but deliberately not validated, because a minimum
   * alone is not always enough: the grid row is auto-sized, so the taller pane
   * wins and a very long form (the invoice generator's runs ~1,600px) stretches
   * the row and strands ~900px of blank space beside a 750px preview. Tools in
   * that situation pass a fixed height too — e.g.
   * `"min-h-[34rem] lg:h-[40rem]"` — which caps the row and lets each pane
   * scroll independently.
   *
   * Kept as one slot rather than split into `minHeight` + `paneHeight` because
   * renaming would touch all 15 call sites for no behavioural gain; if a third
   * distinct need appears, split it then.
   */
  minHeight?: string
  outputFirstOnMobile?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-panel border border-line bg-white">
      {toolbar ? <div className="border-line border-b bg-offwhite">{toolbar}</div> : null}

      <div className="grid lg:grid-cols-2">
        <section
          aria-label={inputLabel}
          className={`flex flex-col ${minHeight} border-line lg:border-r ${
            outputFirstOnMobile ? 'order-2 lg:order-1' : 'order-1'
          }`}
        >
          {input}
        </section>

        <section
          aria-label={outputLabel}
          className={`flex flex-col ${minHeight} border-line border-t lg:border-t-0 ${
            outputFirstOnMobile ? 'order-1 lg:order-2' : 'order-2'
          }`}
        >
          {output}
        </section>
      </div>

      {status ? <div className="border-line border-t bg-offwhite">{status}</div> : null}
    </div>
  )
}

/**
 * A titled region inside a pane. Keeps the two panes visually symmetric —
 * same header height, same padding — without each tool re-deriving it.
 */
export function Pane({
  title,
  actions,
  children,
  scroll = true,
  padded = true,
}: {
  title?: string
  actions?: ReactNode
  children: ReactNode
  scroll?: boolean
  padded?: boolean
}) {
  return (
    <>
      {title || actions ? (
        <header className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-line border-b px-4 py-2">
          {title ? (
            <h3 className="font-sans font-bold text-[12px] text-ink-subtle uppercase tracking-[0.1em]">
              {title}
            </h3>
          ) : (
            <span />
          )}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={`flex-1 ${scroll ? 'overflow-auto' : ''} ${padded ? 'p-4' : ''}`}>
        {children}
      </div>
    </>
  )
}
