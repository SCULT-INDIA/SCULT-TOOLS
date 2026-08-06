'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * The one-off active-state case `CategoryMenu` can't cover: `/all` is not a
 * category slug, so it needs its own pathname check rather than sharing that
 * component's logic.
 */
export function AllToolsLink() {
  const pathname = usePathname()
  const isActive = pathname === '/all'

  return (
    <Link
      href="/all"
      aria-current={isActive ? 'page' : undefined}
      className={`hover:text-violet-600 ${isActive ? 'text-violet-700' : ''}`}
    >
      All tools
    </Link>
  )
}
