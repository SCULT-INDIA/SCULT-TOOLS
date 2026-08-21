'use client'

import { MessageSquarePlus, ShieldCheck, Star, TriangleAlert, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { trackToolEvent } from '@/lib/analytics'
import {
  FEEDBACK_MESSAGE_MAX,
  FEEDBACK_MESSAGE_MIN,
  validateFeedback,
} from '@/lib/tools/feedback/logic'
import { getVisitorId } from '@/lib/visitor'

/**
 * A fixed top-left icon FAB — the fourth corner, completing the set
 * BookmarkButton (top-right), and FloatingActions' WhatsApp/Scult pair
 * (bottom-left/bottom-right) already claim. Same recipe as those three:
 * size-14 squircle (`rounded-[22.5%]`), `border-ink`, `shadow-card-raised`,
 * `hover:scale-110` — a visitor who's used any one of the other three FABs
 * already knows this one is clickable, without reading a label first.
 *
 * Top-left over the two remaining alternatives: stacking a fifth icon into
 * an already-two-icon bottom-right corner would crowd the one corner this
 * site treats as a dense cluster, and the header itself (sticky, z-50) owns
 * the top-center/right band on desktop. Top-left is the one quadrant with
 * no existing fixed element and no header content sharing its row once the
 * announcement bar scrolls away — an unclaimed corner, not a contested one.
 *
 * Opens a dialog styled after the site's own neo-brutalist card
 * (rounded-panel + border-ink + shadow-brutal, same recipe as
 * BusinessNameGenerator's/AiVisibilityChecker's result panels) rather than a
 * generic modal, so it reads as part of this product instead of a bolted-on
 * widget.
 *
 * Copy is deliberately internal-process-free: earlier drafts named the
 * destination inbox and led with "no signup required," which reads like
 * infrastructure trivia a visitor has no reason to care about. What a
 * visitor actually wants to know before typing into a box is who reads it
 * and whether anything happens next — so the copy leads with that instead.
 *
 * Dialog semantics follow the same contract as components/layout/MobileDrawer.tsx:
 * focus enters on open, Escape closes, focus returns to the trigger on close.
 *
 * The star rating is optional (SCULT Studio's feedback endpoint accepts
 * `rating: null`) — nothing forces a visitor to pick one before submitting
 * a message.
 */
export function FeedbackButton({
  toolSlug,
  toolTitle,
  category,
}: {
  toolSlug: string
  toolTitle: string
  category?: string
}) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorText, setErrorText] = useState('')

  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const messageId = useId()
  const emailId = useId()
  const errorId = useId()

  function reset(): void {
    setMessage('')
    setRating(undefined)
    setEmail('')
    setCompany('')
    setStatus('idle')
    setErrorText('')
  }

  function handleOpen(): void {
    if (status === 'sent') reset()
    setOpen(true)
    trackToolEvent(toolSlug, 'feedback_opened')
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

    const validated = validateFeedback({
      toolSlug,
      toolTitle,
      category,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      message,
      rating,
      email,
      visitorId: getVisitorId(),
      company,
    })
    if ('error' in validated) {
      setStatus('error')
      setErrorText(
        validated.error === 'message-too-short'
          ? `Say a little more — at least ${FEEDBACK_MESSAGE_MIN} characters.`
          : validated.error === 'message-too-long'
            ? `Keep it under ${FEEDBACK_MESSAGE_MAX} characters.`
            : validated.error === 'invalid-email'
              ? 'That email address does not look right.'
              : 'Could not submit that.',
      )
      return
    }

    setStatus('sending')
    setErrorText('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated.data),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setStatus('error')
        setErrorText(data.error ?? 'Could not send that feedback. Try again in a moment.')
        return
      }
      setStatus('sent')
      trackToolEvent(toolSlug, 'feedback_submitted')
    } catch {
      setStatus('error')
      setErrorText('Could not send that feedback. Check your connection and try again.')
    }
  }

  return (
    <>
      <span className="fixed top-5 left-5 z-40 block">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          aria-label="Send feedback"
          className="group flex size-14 items-center justify-center rounded-[22.5%] border border-ink bg-violet-700 shadow-card-raised transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-110 hover:bg-violet-600 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <MessageSquarePlus className="size-6 text-white" aria-hidden="true" />
        </button>
      </span>

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
              aria-label="Close feedback form"
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
                  Feedback received
                </p>
                <p className="max-w-[24ch] text-[14px] text-ink-muted leading-6">
                  Thanks for taking the time. Our team reviews every submission, and we'll
                  follow up if you left an email and need more detail.
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
                <span className="eyebrow">Feedback</span>
                <p
                  id={titleId}
                  className="mt-1 font-display font-semibold text-[22px] text-ink leading-tight"
                >
                  What's on your mind?
                </p>
                <p className="mt-2 text-[14px] text-ink-muted leading-6">
                  A bug, a wrong result, an idea — every message on{' '}
                  <span className="font-medium text-ink">{toolTitle}</span> is read by our
                  product team.
                </p>

                <label
                  htmlFor={messageId}
                  className="mt-5 block font-medium text-[13px] text-ink-muted"
                >
                  Your feedback
                </label>
                <textarea
                  id={messageId}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={FEEDBACK_MESSAGE_MIN}
                  maxLength={FEEDBACK_MESSAGE_MAX}
                  rows={4}
                  aria-describedby={status === 'error' ? errorId : undefined}
                  className="mt-1.5 w-full resize-none rounded-card border border-line-grey bg-offwhite px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-subtle focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  placeholder="Tell us what happened, or what you'd like to see."
                />

                <div
                  role="radiogroup"
                  aria-label="Rating"
                  className="mt-3.5 flex items-center gap-1"
                >
                  {([1, 2, 3, 4, 5] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} star${n === 1 ? '' : 's'}`}
                      onClick={() => setRating(rating === n ? undefined : n)}
                      className="p-0.5"
                    >
                      <Star
                        className={`size-5 ${
                          rating !== undefined && n <= rating
                            ? 'fill-cta text-cta'
                            : 'text-line-grey'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                  <span className="ml-1 text-[12px] text-ink-subtle">
                    {rating ? `${rating}/5` : 'optional'}
                  </span>
                </div>

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
                  <label htmlFor="feedback-company">Company</label>
                  <input
                    id="feedback-company"
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
                    {status === 'sending' ? 'Sending…' : 'Send feedback'}
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
