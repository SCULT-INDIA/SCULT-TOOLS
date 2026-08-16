'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

/** Any of these counts as "the visitor is actually using the page" — the
 * bar deliberately stays low since the only cost of triggering early is
 * loading analytics a little sooner, not later. */
const INTERACTION_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'scroll'] as const

/** Loads even if nothing above ever fires — e.g. someone reading the page
 * without touching anything — so a real, engaged visit still gets tracked. */
const FALLBACK_DELAY_MS = 4000

/**
 * Mounts the GA4 + Clarity `<Script>` tags only once the visitor has
 * interacted with the page (or after a short fallback delay) — not the
 * `afterInteractive` strategy alone, which runs during/right after
 * hydration and still shows up as measured main-thread cost in a
 * synthetic Lighthouse run.
 *
 * This changes WHEN loading starts, not what loads or how: the script
 * `src`/inline content below is byte-for-byte what the root layout
 * rendered unconditionally before — see this component's only caller
 * (`app/layout.tsx`) for the GA4 bootstrap and Clarity ordering rationale,
 * both unchanged. `lib/analytics.ts`'s `trackEvent` already handles
 * `window.gtag` not existing yet by queueing a real Arguments object onto
 * `dataLayer`, so an event fired by the very interaction that triggers this
 * component (e.g. a tool's "copy" button) is not lost — it is exactly the
 * race that fix was built for, just made more likely instead of eliminated.
 *
 * Trade-off (user-confirmed): a visit that closes the tab in well under
 * `FALLBACK_DELAY_MS` without scrolling, clicking, touching, or pressing a
 * key no longer registers a GA4/Clarity pageview. Every other real visit —
 * which is to say, every visit that does anything at all — still does.
 */
export function DeferredAnalyticsScripts({
  gaId,
  clarityId,
}: {
  gaId: string
  clarityId: string
}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active || (!gaId && !clarityId)) return

    function trigger() {
      setActive(true)
    }

    const listenerOptions = { once: true, passive: true } as const
    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, trigger, listenerOptions)
    }
    const timer = window.setTimeout(trigger, FALLBACK_DELAY_MS)

    return () => {
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, trigger)
      }
      window.clearTimeout(timer)
    }
  }, [active, gaId, clarityId])

  if (!active) return null

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}',{cookie_domain:'.scult.in'});`}
          </Script>
        </>
      ) : null}

      {clarityId ? (
        <Script
          src={`https://www.clarity.ms/tag/${clarityId}`}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  )
}
