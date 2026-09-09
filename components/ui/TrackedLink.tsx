'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * A link (internal `next/link` or external `<a>`) that reports a named
 * event on click before navigating — the same "GA4/Studio can't see this
 * click on its own" gap `MailtoLink` closes for `mailto:` hrefs,
 * generalised for any destination this site wants visibility into (a
 * category picked, an external repo opened) rather than hand-rolling a
 * one-off client component per event name.
 */
export function TrackedLink({
  href,
  external = false,
  event,
  params,
  className,
  children,
}: {
  href: string
  /** True for a real external `<a>` (opens in a new tab); false for an
   * internal `next/link` navigation. */
  external?: boolean
  event: string
  params?: Record<string, string | number | boolean>
  className?: string
  children: ReactNode
}) {
  const onClick = () => trackEvent(event, params)
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
