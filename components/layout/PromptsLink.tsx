'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Same one-off active-state pattern as AllToolsLink — `/prompts` and its
 * subroutes aren't a tool category slug, so this needs its own pathname
 * check rather than sharing CategoryMenu's logic.
 */
export function PromptsLink() {
  const pathname = usePathname()
  const isActive = pathname === '/prompts' || pathname.startsWith('/prompts/')

  return (
    // prefetch={false}: same reasoning as AllToolsLink — header nav is
    // visible on every page load, so default prefetch fetched /prompts'
    // full RSC payload unconditionally.
    <Link
      href="/prompts"
      prefetch={false}
      aria-current={isActive ? 'page' : undefined}
      className={`hover:text-violet-600 ${isActive ? 'text-violet-700' : ''}`}
    >
      Prompts
    </Link>
  )
}
