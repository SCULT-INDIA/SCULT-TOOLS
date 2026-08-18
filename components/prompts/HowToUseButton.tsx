'use client'

import { CircleHelp, Copy, SlidersHorizontal, Wand2, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { trackPromptEvent } from '@/lib/analytics'

/**
 * "How to use" — a small text-link trigger next to "Request a prompt" that
 * opens a purely informational dialog (no form, no API call) walking
 * through the three-step flow every prompt on this site follows. Content is
 * generated from the actual prompt's data (target tools, whether it has
 * customizable fields) rather than being fully generic boilerplate, so a
 * ChatGPT prompt with no variables and a Midjourney prompt with four both
 * get accurate steps, not the same paragraph.
 *
 * Same dialog a11y contract as RequestPromptButton/FeedbackButton (focus
 * trap, Escape, focus restore) — deliberately copied, not reinvented, for
 * the same reason those two match each other.
 */
export function HowToUseButton({
  category,
  promptSlug,
  targetTools,
  hasVariables,
}: {
  category: string
  promptSlug: string
  targetTools: readonly string[]
  hasVariables: boolean
}) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  function handleOpen(): void {
    setOpen(true)
    trackPromptEvent(category, promptSlug, 'how_to_use_opened')
  }

  function handleClose(): void {
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? [],
      )
    focusables()[0]?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  const targetLabel =
    targetTools.length === 0
      ? 'your AI tool'
      : targetTools.length === 1
        ? targetTools[0]
        : `${targetTools.slice(0, -1).join(', ')} or ${targetTools[targetTools.length - 1]}`

  const steps = [
    hasVariables
      ? {
          icon: SlidersHorizontal,
          title: 'Customize the details (optional)',
          body: `Fill in the fields on the right with your own specifics. Skip this entirely if you're in a hurry — the prompt already works with the example details shown.`,
        }
      : {
          icon: Wand2,
          title: 'Read it once',
          body: `This prompt has no fields to fill in — it's ready to use exactly as written.`,
        },
    {
      icon: Copy,
      title: 'Copy the prompt',
      body: `Click "Copy prompt" above the prompt text. Your customized version — or the example version, if you skipped step one — gets copied to your clipboard.`,
    },
    {
      icon: CircleHelp,
      title: `Paste it into ${targetLabel}`,
      body: `Paste directly into a new chat. No further setup — this prompt is written to work as a single message, not a multi-step conversation.`,
    },
  ]

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 text-[13px] font-medium text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600"
      >
        <CircleHelp className="size-3.5" aria-hidden="true" />
        How to use
      </button>

      {open ? (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div
            aria-hidden="true"
            onClick={handleClose}
            className="absolute inset-0 bg-black/50"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[27rem] rounded-panel border border-ink bg-cream p-6 text-left shadow-brutal sm:p-7"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-ink-subtle transition-colors hover:bg-violet-50 hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <span className="eyebrow">How to use this prompt</span>
            <p
              id={titleId}
              className="mt-1 font-display font-semibold text-[22px] text-ink leading-tight"
            >
              Three steps, no setup
            </p>

            <ol className="mt-5 flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-violet-700 font-display font-semibold text-[13px] text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-medium text-[14.5px] text-ink">
                      <step.icon
                        className="size-3.5 shrink-0 text-violet-700"
                        aria-hidden="true"
                      />
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13.5px] text-ink-muted leading-6">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={handleClose}
              className="btn-brutal btn-brutal-sm btn-violet mt-6 w-full justify-center"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
