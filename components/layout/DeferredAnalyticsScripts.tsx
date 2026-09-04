'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { isLikelyAutomatedBrowser, isLikelyBotUserAgent } from '@/lib/bot-detection'

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
 *
 * SCULT Studio's `track.js` (studio.scult.in) is mounted here too, same
 * deferred-until-interaction treatment as GA4/Clarity above — this is the
 * one place any third-party script gets loaded in this codebase, and
 * `track.js` is no different: an anonymous visitor id in `localStorage`, a
 * session id in `sessionStorage`, no cookies. It fires its own pageview on
 * load and on every client-side route change internally; nothing else in
 * this app has to drive that.
 *
 * OpenAI's Ads Measurement Pixel SDK (`oaiq.min.js`) is loaded here too,
 * same deferred trigger — but unlike the three above it does nothing on its
 * own until a conversion happens. `lib/analytics.ts`'s `trackCtaClick`
 * queues the `init`/`measure` calls itself (defensively, without waiting
 * for this component to mount), so this script tag's only job is to
 * eventually drain that queue.
 *
 * `isBot` gates ONLY the Studio script, never GA4/Clarity: both of those
 * already run their own always-on bot filtering server-side (Google's
 * "known bots and spiders" exclusion for GA4, Clarity's own equivalent) —
 * adding a client-side gate there would be redundant and risks disagreeing
 * with a real user Google/Clarity already correctly counted. Studio has no
 * such filtering visible from here, so `lib/bot-detection.ts`'s heuristic
 * (a known crawler User-Agent, or `navigator.webdriver` from a
 * Selenium/Puppeteer/Playwright-driven session) is the first pass — bots
 * still get the exact same HTML/robots.txt access as any other visitor,
 * this only keeps them out of Studio's pageview/analytics counts.
 */
export function DeferredAnalyticsScripts({
  gaId,
  clarityId,
  studioSiteId,
  openaiAdsPixelId,
}: {
  gaId: string
  clarityId: string
  studioSiteId: string
  openaiAdsPixelId: string
}) {
  const [active, setActive] = useState(false)
  // Lazy initializer, not a bare call: this component still renders during
  // SSR (as HTML shell, before `active` ever flips true), where `navigator`
  // does not exist — evaluating it eagerly as a prop/argument would throw
  // on every page. The lazy-initializer form only runs client-side, on
  // first mount.
  const [isBot] = useState(() => {
    if (typeof navigator === 'undefined') return false
    return isLikelyBotUserAgent(navigator.userAgent) || isLikelyAutomatedBrowser()
  })

  useEffect(() => {
    if (active || (!gaId && !clarityId && !studioSiteId && !openaiAdsPixelId)) return

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
  }, [active, gaId, clarityId, studioSiteId, openaiAdsPixelId])

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

      {studioSiteId && !isBot ? (
        <Script
          src="https://studio.scult.in/track.js"
          data-site={studioSiteId}
          strategy="afterInteractive"
        />
      ) : null}

      {openaiAdsPixelId ? (
        <Script
          src="https://bzrcdn.openai.com/sdk/oaiq.min.js"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  )
}
