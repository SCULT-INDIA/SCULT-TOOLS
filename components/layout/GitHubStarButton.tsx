'use client'

import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const REPO = 'SCULT-INDIA/SCULT-TOOLS'

/**
 * Links out to the repo and shows its live star count — a real number from
 * GitHub's public API, not a static claim. No `Github` icon here: this
 * lucide-react build has no brand icons (same trademark-driven removal
 * already documented for the `X`/Twitter mark in Footer.tsx), so the
 * GitHub mark below is the standard octicon "mark-github" path instead —
 * MIT-licensed, and exactly the "link out to GitHub" use GitHub's own brand
 * guidelines permit, as opposed to using it to imply endorsement.
 *
 * The count is fetched client-side from the unauthenticated public API
 * (generous anonymous rate limits for a single repo lookup) and fails
 * silently to "no count shown" — a visitor should never see a broken nav
 * button just because the anonymous rate limit was hit or the network blipped.
 */
export function GitHubStarButton() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (!cancelled && typeof data?.stargazers_count === 'number') {
          setStars(data.stargazers_count)
        }
      })
      .catch(() => {
        // Best-effort only — see the component doc comment.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        stars === null
          ? 'Star tools.scult.in on GitHub'
          : `Star tools.scult.in on GitHub — ${stars} stars so far`
      }
      title="Star this project on GitHub"
      className="flex h-10 items-center gap-1.5 rounded-full border border-line-grey px-3 text-[13px] text-ink transition-colors hover:border-ink lg:h-11"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-4 shrink-0 fill-current"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      <span className="hidden sm:inline">Star</span>
      <span className="inline-flex items-center gap-0.5 border-line-grey pl-1.5 sm:border-l">
        <Star className="size-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
        {stars ?? ''}
      </span>
    </a>
  )
}
