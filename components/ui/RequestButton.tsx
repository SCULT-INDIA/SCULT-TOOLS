'use client'

import { MessageSquarePlus, ShieldCheck, TriangleAlert, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import {
  REQUEST_DESCRIPTION_MAX,
  REQUEST_DESCRIPTION_MIN,
  REQUEST_TITLE_MAX,
  REQUEST_TITLE_MIN,
  type RequestKind,
  validateRequest,
} from '@/lib/requests/logic'
import { getVisitorId } from '@/lib/visitor'

/**
 * "Request a tool / prompt / skill" — one dialog covering all three request
 * types SCULT Studio (studio.scult.in) accepts via `POST /api/v1/tools/requests`
 * (the `kind` field), reused across every surface that wants it: tool pages
 * (near Feedback), prompt pages (where "Request a prompt" used to live
 * alone), and the footer (one sitewide entry point). A kind selector is
 * always visible so a visitor who opened it from the "wrong" context can
 * still ask for the other two — the trigger only decides the DEFAULT
 * selection, never a hard constraint.
 *
 * Replaces the earlier prompt-only `RequestPromptButton` (deleted): the
 * dialog structure, a11y contract, and visual language are carried over
 * unchanged from it and from `FeedbackButton` — focus enters on open,
 * Escape closes, focus returns to the trigger on close, same
 * rounded-panel/border-ink/shadow-brutal card, same honeypot pattern.
 */

const KIND_LABEL: Record<RequestKind, string> = {
  tool_request: 'Request a tool',
  prompt_request: 'Request a prompt',
  skill_request: 'Request a skill',
}

const KIND_TAB_LABEL: Record<RequestKind, string> = {
  tool_request: 'Tool',
  prompt_request: 'Prompt',
  skill_request: 'Skill',
}

const KIND_TITLE_PLACEHOLDER: Record<RequestKind, string> = {
  tool_request: 'e.g. A bulk QR code generator',
  prompt_request: 'e.g. A ChatGPT prompt for sales follow-ups',
  skill_request: 'e.g. A skill that auto-formats meeting notes',
}

const KIND_DESCRIPTION_PLACEHOLDER: Record<RequestKind, string> = {
  tool_request: "What should it do, and why isn't an existing tool enough?",
  prompt_request: "Tell us the job you're trying to do and which AI tool you use for it.",
  skill_request: 'What should it do, and where would you use it?',
}

const KIND_AFFECTED_LABEL: Record<RequestKind, string> = {
  tool_request: 'Closest existing tool',
  prompt_request: 'Category',
  skill_request: 'Related tool or workflow',
}

export function RequestButton({
  defaultKind,
  affectedTool,
  triggerLabel,
  triggerClassName,
  trackContext,
}: {
  defaultKind: RequestKind
  /** Prefilled "affected tool/category" value — still editable, never locked. */
  affectedTool?: string
  /** Overrides the kind-specific trigger copy, e.g. for a single sitewide entry point. */
  triggerLabel?: string
  /** Overrides the default violet text-link styling, e.g. for the dark footer. */
  triggerClassName?: string
  /** Extra analytics context (a tool slug, a prompt category) — not sent to Studio. */
  trackContext?: string
}) {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState<RequestKind>(defaultKind)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [affected, setAffected] = useState(affectedTool ?? '')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const requestTitleFieldId = useId()
  const descriptionId = useId()
  const affectedId = useId()
  const emailId = useId()
  const errorId = useId()

  function reset(): void {
    setKind(defaultKind)
    setTitle('')
    setDescription('')
    setAffected(affectedTool ?? '')
    setEmail('')
    setCompany('')
    setStatus('idle')
    setErrorText('')
  }

  function handleOpen(): void {
    if (status === 'sent') reset()
    setOpen(true)
    trackEvent('request_opened', {
      kind: defaultKind,
      context: trackContext ?? 'unknown',
    })
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
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'input, textarea, button:not([disabled])',
        ) ?? [],
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

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()

    const validated = validateRequest({
      kind,
      title,
      description,
      affectedTool: affected,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      email,
      visitorId: getVisitorId(),
      company,
    })
    if ('error' in validated) {
      setStatus('error')
      setErrorText(
        validated.error === 'title-too-short'
          ? `Give it a short title — at least ${REQUEST_TITLE_MIN} characters.`
          : validated.error === 'title-too-long'
            ? `Keep the title under ${REQUEST_TITLE_MAX} characters.`
            : validated.error === 'description-too-short'
              ? `Say a little more about what you need — at least ${REQUEST_DESCRIPTION_MIN} characters.`
              : validated.error === 'description-too-long'
                ? `Keep it under ${REQUEST_DESCRIPTION_MAX} characters.`
                : validated.error === 'invalid-email'
                  ? 'That email address does not look right.'
                  : 'Could not submit that.',
      )
      return
    }

    setStatus('sending')
    setErrorText('')
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated.data),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setErrorText(data.error ?? 'Could not send that request. Try again in a moment.')
        return
      }
      setStatus('sent')
      trackEvent('request_submitted', { kind, context: trackContext ?? 'unknown' })
    } catch {
      setStatus('error')
      setErrorText('Could not send that request. Check your connection and try again.')
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={
          triggerClassName ??
          'flex items-center gap-1.5 text-[13px] font-medium text-violet-700 underline decoration-1 underline-offset-4 hover:text-violet-600'
        }
      >
        <MessageSquarePlus className="size-3.5" aria-hidden="true" />
        {triggerLabel ?? KIND_LABEL[defaultKind]}
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
              aria-label="Close request form"
              onClick={handleClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-ink-subtle transition-colors hover:bg-violet-50 hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            {status === 'sent' ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-violet-100">
                  <ShieldCheck className="size-5 text-violet-700" aria-hidden="true" />
                </span>
                <p
                  id={titleId}
                  className="font-display font-semibold text-[20px] text-ink"
                >
                  Request received
                </p>
                <p className="max-w-[24ch] text-[14px] text-ink-muted leading-6">
                  Thanks — our team reviews every request, and we'll follow up if you left
                  an email and this one needs more detail.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-brutal btn-brutal-sm btn-violet mt-2 w-full justify-center"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <span className="eyebrow">{KIND_LABEL[kind]}</span>
                <p
                  id={titleId}
                  className="mt-1 font-display font-semibold text-[22px] text-ink leading-tight"
                >
                  What do you need?
                </p>

                {/* Kind selector — always shown, regardless of which surface
                    opened the dialog, so the trigger only sets a default. */}
                <div
                  role="radiogroup"
                  aria-label="Request type"
                  className="mt-4 flex gap-1.5 rounded-pill border border-line-grey bg-offwhite p-1"
                >
                  {(Object.keys(KIND_TAB_LABEL) as RequestKind[]).map((k) => (
                    // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA radiogroup pattern on buttons is deliberate — these are pill-styled segmented tabs, and restyling native radio inputs to match would trade real markup semantics for a heap of appearance-none CSS.
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={kind === k}
                      onClick={() => setKind(k)}
                      className={`flex-1 rounded-pill px-2 py-1.5 text-[13px] font-medium transition-colors ${
                        kind === k
                          ? 'bg-violet-700 text-white'
                          : 'text-ink-muted hover:bg-violet-50'
                      }`}
                    >
                      {KIND_TAB_LABEL[k]}
                    </button>
                  ))}
                </div>

                <label
                  htmlFor={requestTitleFieldId}
                  className="mt-5 block font-medium text-[13px] text-ink-muted"
                >
                  Title
                </label>
                <input
                  id={requestTitleFieldId}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={REQUEST_TITLE_MIN}
                  maxLength={REQUEST_TITLE_MAX}
                  aria-describedby={status === 'error' ? errorId : undefined}
                  className="mt-1.5 w-full rounded-card border border-line-grey bg-offwhite px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-subtle focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder={KIND_TITLE_PLACEHOLDER[kind]}
                />

                <label
                  htmlFor={descriptionId}
                  className="mt-3.5 block font-medium text-[13px] text-ink-muted"
                >
                  Details
                </label>
                <textarea
                  id={descriptionId}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  minLength={REQUEST_DESCRIPTION_MIN}
                  maxLength={REQUEST_DESCRIPTION_MAX}
                  rows={4}
                  className="mt-1.5 w-full resize-none rounded-card border border-line-grey bg-offwhite px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-subtle focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder={KIND_DESCRIPTION_PLACEHOLDER[kind]}
                />

                <label
                  htmlFor={affectedId}
                  className="mt-3.5 block font-medium text-[13px] text-ink-muted"
                >
                  {KIND_AFFECTED_LABEL[kind]}{' '}
                  <span className="font-normal text-ink-subtle">(optional)</span>
                </label>
                <input
                  id={affectedId}
                  type="text"
                  value={affected}
                  onChange={(e) => setAffected(e.target.value)}
                  className="mt-1.5 w-full rounded-card border border-line-grey bg-offwhite px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-subtle focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />

                <label
                  htmlFor={emailId}
                  className="mt-3.5 block font-medium text-[13px] text-ink-muted"
                >
                  Email{' '}
                  <span className="font-normal text-ink-subtle">
                    (optional — for a reply)
                  </span>
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-card border border-line-grey bg-offwhite px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-subtle focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="you@example.com"
                />

                {/* Honeypot — hidden from real users via CSS, not `type="hidden"`, so
                    a bot's naive "fill every field" script still catches it. */}
                <div className="absolute left-[-9999px] top-auto" aria-hidden="true">
                  <label htmlFor="request-company">Company</label>
                  <input
                    id="request-company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                {status === 'error' ? (
                  <p
                    id={errorId}
                    role="alert"
                    className="mt-3 flex items-start gap-1.5 text-[13px] text-red-600"
                  >
                    <TriangleAlert
                      className="mt-0.5 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {errorText}
                  </p>
                ) : null}

                <div className="mt-5 flex items-center gap-1.5 text-[12px] text-ink-subtle">
                  <ShieldCheck className="size-3.5 text-green" aria-hidden="true" />
                  Reviewed by our team — never shared with third parties.
                </div>

                <div className="mt-4 flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-brutal btn-brutal-sm btn-white flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-brutal btn-brutal-sm btn-violet flex-1 justify-center"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
