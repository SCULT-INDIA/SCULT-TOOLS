'use client'

import { useEffect } from 'react'
import { parseParentCtaHref, trackCtaClick } from '@/lib/analytics'

/**
 * Fires a `cta_click` GA4 event whenever anyone follows one of our outbound
 * conversion links to the parent site.
 *
 * ONE delegated listener rather than an onClick on each link, because those
 * links are not written in one place: `parentLink()` is called from ~150 sites
 * — components, but also the footer's service array, the pricing page's plan
 * objects, and a `BOOK_MEETING` constant in every one of the blog `meta.ts`
 * files. Many of those are plain data, rendered by a shared component from an
 * href string, with no handler to hang an onClick on. Wiring each one would
 * mean touching every blog meta file and would still miss the next CTA someone
 * adds; a listener at the document root covers all of them, including ones
 * that do not exist yet.
 *
 * This is NOT the fragile "match the button text" pattern that makes GTM click
 * triggers rot. It keys on the destination URL — parent host plus the
 * `utm_source` our own `parentLink()` stamps on every conversion link. That is
 * a contract this codebase controls and already depends on for attribution: if
 * it ever changed, UTM attribution would break loudly long before this
 * tracker did.
 *
 * Capture phase, so the event is recorded even if something downstream stops
 * propagation. Surviving the navigation that follows is gtag.js's problem and
 * it already solves it — GA4 transmits via `navigator.sendBeacon`, which the
 * browser completes after the page starts unloading.
 */
export function CtaClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      // `closest`, not the target itself: these CTAs wrap icons and spans, so
      // the click almost always lands on a child node, not the anchor.
      const anchor = target.closest('a')
      const href = anchor?.getAttribute('href')
      if (!href) return

      const cta = parseParentCtaHref(href, window.location.href)
      if (!cta) return

      trackCtaClick(cta.campaign, {
        destination: cta.destination,
        // Which page produced the click. `campaign` says which CTA was
        // pressed; this says where the person was standing when they pressed
        // it, which is what turns "the pricing CTA works" into "the pricing
        // CTA works ON THE QR CODE TOOL" — the difference that decides where
        // content investment goes.
        from_path: window.location.pathname,
      })
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
