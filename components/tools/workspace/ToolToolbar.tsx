'use client'

import type { ReactNode } from 'react'

/**
 * The workspace's control row — see docs/TOOL_REDESIGN_PLAN.md §3.
 *
 * Controls belong above BOTH panes, not between them. Previously each tool put
 * its options underneath the input, so the eye travelled input → controls →
 * output; every competitor worth beating uses a single toolbar spanning the top.
 */
export function ToolToolbar({
  children,
  actions,
}: {
  children?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">{children}</div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

/** A labelled cluster inside the toolbar, e.g. "Indent · 2 / 4 / Tab". */
export function ToolbarGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-[12px] text-ink-subtle uppercase tracking-[0.08em]">
        {label}
      </span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  )
}

/**
 * Segmented control. `aria-pressed` rather than a radio group: these are
 * immediate-effect toggles, not a form submission, and pressed-state is the
 * accurate semantic.
 *
 * Selected state pairs colour with weight so it never depends on colour alone.
 */
export function SegmentButton({
  active,
  onClick,
  children,
  title,
  disabled = false,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  title?: string
  /**
   * For toggles that must lock while an operation is in flight — the speed test
   * needs the device switch frozen during a run, because changing it mid-request
   * would label the returned report with the wrong strategy.
   */
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      // 44px on touch-sized viewports, 36px from `sm` up. WCAG 2.2 SC 2.5.8 only
      // asks for 24px, but a 36px segmented control is genuinely fiddly with a
      // thumb, and the plan's own bar is 44. Pointer precision is better on
      // larger screens, so the tighter height is kept there for density.
      className={`min-h-11 rounded-sm border px-3 font-medium text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-9 ${
        active
          ? 'border-ink bg-violet-700 text-white'
          : 'border-line-grey bg-white text-ink-muted hover:border-ink hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

/** A compact toolbar action (Clear, Load sample, Download…). */
export function ToolbarAction({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-11 rounded-sm border border-line-grey bg-white px-3 font-medium text-[13px] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-9"
    >
      {children}
    </button>
  )
}
