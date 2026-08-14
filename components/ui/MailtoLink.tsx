'use client'

import type { ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * A `mailto:` link that reports itself to GA4 on click.
 *
 * GA4 Enhanced Measurement's automatic "outbound click" detection compares
 * the link's hostname against the current page's — a `mailto:` href has no
 * comparable hostname, so it falls outside that automatic net entirely.
 * Without this, "did anyone actually click through to email us" is
 * invisible in Analytics no matter how many people do it.
 */
export function MailtoLink({
  email,
  context,
  className,
  children,
}: {
  email: string
  /** Where on the site this link lives, e.g. "contact-page" — lets more
   * than one mailto link on the site (support, sales, etc.) stay
   * distinguishable in the same report. */
  context: string
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() => trackEvent('mailto_click', { context })}
    >
      {children}
    </a>
  )
}
