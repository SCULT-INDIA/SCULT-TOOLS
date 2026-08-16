'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { CATEGORIES } from '@/lib/tools/categories'

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
 * Takes the header as `children` rather than importing and rendering
 * `<Header/>` itself: `Header` is a Server Component that reads the full
 * tools/prompts registries (via `lib/search.ts`) to build the nav's search
 * index. A client component that imports and instantiates a server one pulls
 * that whole module graph into the client bundle regardless of the server
 * module having no `'use client'` of its own — this file did exactly that
 * for a while, and it was the actual source of a ~7.5MB client chunk (every
 * prompt's full template body, shipped on every page, just to gate one nav
 * bar on pathname). Rendering `<Header/>` from the real Server Component
 * ancestor (`app/layout.tsx`) and handing the already-resolved element down
 * through `children` keeps the registry read where it belongs: server-only,
 * never serialized to the client.
 *
 * Matched against `CATEGORY_SLUGS` rather than "exactly two segments": the
 * only two-segment route today is the tool page, but matching the actual
 * category list (already the source of truth the tool route itself resolves
 * against) means this can't silently start hiding the nav on some unrelated
 * future two-segment route.
 */
export function HeaderGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [first, second] = pathname.split('/').filter(Boolean)
  const isToolPage = Boolean(first && second && CATEGORY_SLUGS.has(first))

  if (isToolPage) return null
  return <>{children}</>
}
