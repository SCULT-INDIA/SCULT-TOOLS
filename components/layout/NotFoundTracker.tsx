'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Fires a `page_not_found` GA4 event with the path that missed, once per
 * mount. GA4's Enhanced Measurement has no built-in 404 signal — it only
 * knows a page loaded, not that the page was the not-found route — so
 * without this, a broken/renamed link is invisible in Analytics no matter
 * how many people hit it. Split into its own tiny client component rather
 * than making `app/not-found.tsx` itself a client component: the 404 page
 * is otherwise fully static, and this is the one piece of it that needs a
 * browser to know the current path.
 */
export function NotFoundTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackEvent('page_not_found', { path: pathname })
    // Only ever re-fire if the actual missed path changes (e.g. a client-side
    // navigation lands on a second, different 404 without a full reload).
  }, [pathname])

  return null
}
