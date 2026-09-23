import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PROMPT_COUNT, TOOL_COUNT } from '@/lib/search'
import { absoluteUrl } from '@/lib/site'
import { SearchResultsView } from './SearchResultsView'

const TITLE = 'Search — Scult Tools'
const DESCRIPTION = `Search ${TOOL_COUNT} free tools, ${PROMPT_COUNT} prompts and thousands of agent skills.`

/** `noindex, follow` — a query-dependent results page carries no unique
 * content of its own to rank for, and a crawler indexing every possible
 * `?q=` permutation would be pure noise; `follow` still lets it reach the
 * real destination pages linked from here. Pre-declared in app/robots.ts's
 * own docblock before this route existed. */
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/search'),
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResultsView />
    </Suspense>
  )
}
