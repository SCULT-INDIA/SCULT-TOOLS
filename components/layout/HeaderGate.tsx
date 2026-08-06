'use client'

import { usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/tools/categories'
import { Header } from './Header'

const CATEGORY_SLUGS: ReadonlySet<string> = new Set(CATEGORIES.map((c) => c.slug))

/**
 * Hides the site nav on tool pages (`/{category}/{slug}`) at the user's
 * explicit request: a tool page should be the task and nothing else, and the
 * floating pill nav — logo, category menu, search, two CTA buttons — is the
 * single biggest piece of non-task chrome above the fold.
 *
 * `usePathname` rather than a route-group restructure: Header/Footer are
 * rendered once in the root layout for every route, and Next's App
 * Router has no way for a nested route to remove ancestor layout UI. A
 * client pathname check is the standard escape hatch, and it costs no
 * flash-of-header — Next resolves the current route during the server render
 * pass, so the very first HTML byte already omits the header on a tool page.
 *
 * Matched against `CATEGORY_SLUGS` rather than "exactly two segments": the
 * only two-segment route today is the tool page, but matching the actual
 * category list (already the source of truth the tool route itself resolves
 * against) means this can't silently start hiding the nav on some unrelated
 * future two-segment route.
 */
export function HeaderGate() {
  const pathname = usePathname()
  const [first, second] = pathname.split('/').filter(Boolean)
  const isToolPage = Boolean(first && second && CATEGORY_SLUGS.has(first))

  if (isToolPage) return null
  return <Header />
}
