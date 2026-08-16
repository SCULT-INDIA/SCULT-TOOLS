'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// The version suffix is the announcement's identity: bumping it (v1 → v2 for
// the prompt-library launch) re-surfaces the bar for people who dismissed the
// previous message, while their new dismissal persists exactly as before.
const DISMISS_KEY = 'scult-tools:announcement-dismissed:v2'

/**
 * The reference site's yellow promo rail.
 *
 * Kept dismissible on purpose: a permanent yellow bar on a utility site people
 * revisit becomes banner blindness within a week. The dismissal persists in
 * localStorage so it does not reappear on every route change.
 *
 * Renders nothing until mounted, so the server HTML and first client render
 * agree (a dismissed bar would otherwise flash in before hydration removed it).
 */
export function AnnouncementBar() {
  const [state, setState] = useState<'pending' | 'shown' | 'hidden'>('pending')

  useEffect(() => {
    try {
      setState(localStorage.getItem(DISMISS_KEY) === '1' ? 'hidden' : 'shown')
    } catch {
      // Private mode or blocked storage: show the bar, just don't remember.
      setState('shown')
    }
  }, [])

  function dismiss() {
    setState('hidden')
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* nothing to do — dismissal is best-effort */
    }
  }

  // Reserve the height during 'pending' so dismissing later is the only layout
  // change, and the first paint never shifts.
  if (state === 'hidden') return null

  return (
    // z-10 is load-bearing: the hero aurora sits at top:-98px and bleeds upward
    // into this strip. Without a stacking order the gradient paints over the bar
    // and drops the black-on-yellow text from 13.06:1 to unreadable.
    <div
      className="relative z-10 w-full bg-cta text-ink"
      style={{ visibility: state === 'pending' ? 'hidden' : 'visible' }}
    >
      <div className="container-site flex min-h-9 items-center justify-center gap-3 py-1.5 pr-8 text-center">
        <p className="text-[13px] leading-5">
          {/* The count is hardcoded, unlike the server components that read
              PROMPTS.length: this is a client component in the sitewide
              header, and importing the registry for one number would ship
              every prompt body in the shared bundle. Update it when the
              library grows — same convention as the "15 free tools" line
              this bar carried before. */}
          New: 1,170 free AI prompts —{' '}
          {/* prefetch={false}: this bar is the first thing in the sticky
              header on every page, so it is always in the initial viewport —
              Next's viewport-prefetch was fetching the /prompts RSC payload on
              every single page load. It showed up in a PageSpeed trace as a
              221KB request; that page was heavy for the same reason every page
              was (see lib/search-payload.ts), and even now that the payload is
              small there is no reason to spend a round trip on a link most
              visitors never click. */}
          <Link
            href="/prompts"
            prefetch={false}
            className="font-semibold underline decoration-1 underline-offset-2 hover:opacity-70"
          >
            browse the library
          </Link>
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 transition-opacity hover:opacity-60 sm:right-5"
      >
        <X className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
      </button>
    </div>
  )
}
