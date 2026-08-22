'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Same one-off active-state pattern as PromptsLink — `/skills` and its
 * subroutes aren't a tool category slug, so this needs its own pathname
 * check rather than sharing CategoryMenu's logic. */
export function SkillsLink() {
  const pathname = usePathname()
  const isActive = pathname === '/skills' || pathname.startsWith('/skills/')

  return (
    <Link
      href="/skills"
      prefetch={false}
      aria-current={isActive ? 'page' : undefined}
      className={`hover:text-violet-600 ${isActive ? 'text-violet-700' : ''}`}
    >
      Skills
    </Link>
  )
}
