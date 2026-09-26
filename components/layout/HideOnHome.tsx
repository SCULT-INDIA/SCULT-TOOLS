'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Renders nothing on the homepage. The header's search box is wrapped in
 * this: on `/` the hero's assistant IS the search, and a second box in the
 * nav directly above it read as a duplicate (explicit feedback,
 * 2026-09-25). Every other page keeps the header search.
 *
 * Same `children` pattern as HeaderGate — the wrapped element is created
 * by the Server Component parent, so nothing server-only is pulled into
 * this client bundle.
 */
export function HideOnHome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/') return null
  return <>{children}</>
}
