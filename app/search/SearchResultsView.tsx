'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { trackSearch } from '@/lib/analytics'
import { type PromptSearchEntry, rankSearch, type SearchHit } from '@/lib/search-client'
import type { SkillHit } from '@/lib/skills/search-hit'
import { useSkillSearchHits } from '@/lib/skills/use-skill-search'
import { useSearchIndex } from '@/lib/use-search-index'

/** Same pastel-per-category mapping SearchBox/PromptCard use, so a result
 * row's disc matches the card it links to. */
const TILE_BG: Record<PromptSearchEntry['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/** Far higher than the dropdown's 8 — this page exists specifically for
 * "show me everything", not a type-ahead preview. */
const RESULT_LIMIT = 60

function ResultRow({ hit, query }: { hit: SearchHit | SkillHit; query: string }) {
  return (
    <Link
      href={hit.href}
      onClick={() => trackSearch(query, { has_results: true, result_kind: hit.kind })}
      className="flex items-center gap-4 rounded-card border border-line bg-cream px-4 py-3 transition-colors hover:border-violet-300 hover:bg-violet-50"
    >
      {hit.kind === 'tool' ? (
        <Image
          src={`/tool-icons/${hit.slug}.png`}
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full ring-1 ring-line"
        />
      ) : (
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-line ${TILE_BG[hit.tile]}`}
        >
          <Icon name={hit.icon} className="size-5 text-violet-700" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate font-medium text-[16px] text-ink">
          {hit.name}
        </span>
        <span className="block truncate text-[13.5px] text-ink-subtle">
          {hit.categoryName}
        </span>
      </span>
    </Link>
  )
}

function ResultGroup({
  heading,
  hits,
  query,
}: {
  heading: string
  hits: readonly (SearchHit | SkillHit)[]
  query: string
}) {
  if (hits.length === 0) return null
  return (
    <section className="mb-8">
      <h2 className="mb-3 font-semibold text-[13px] text-ink-subtle uppercase tracking-[0.1em]">
        {heading} ({hits.length})
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {hits.map((hit) => (
          <ResultRow key={hit.href} hit={hit} query={query} />
        ))}
      </div>
    </section>
  )
}

/**
 * The full-page counterpart to `SearchBox`'s dropdown — same ranking, same
 * data sources (the lazy tool/prompt index, the live Skills Library search
 * endpoint), just a lot more room and a shareable `?q=` URL. The dropdown
 * stays capped at 8 rows for a type-ahead feel; this page exists
 * specifically for "show me everything that matches."
 */
export function SearchResultsView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)

  const { toolEntries, promptEntries, ready: indexReady } = useSearchIndex(true)
  const { hits: skillHits, loading: skillsLoading } = useSkillSearchHits(query)

  const hits = useMemo(
    () => rankSearch(toolEntries, promptEntries, query, RESULT_LIMIT),
    [toolEntries, promptEntries, query],
  )
  const toolHits = hits.filter((h) => h.kind === 'tool')
  const promptHits = hits.filter(
    (h) => h.kind === 'prompt' || h.kind === 'prompt-category',
  )

  const trimmed = query.trim()
  const totalCount = toolHits.length + promptHits.length + skillHits.length
  const searching = trimmed.length > 0
  // Nothing has matched yet only because nothing has arrived yet — the
  // server render and the first client paint always land here.
  const pending = !indexReady || skillsLoading

  // Keeps the URL in sync so a search here is bookmarkable/shareable —
  // debounced so every keystroke doesn't push a new history entry. `/search`
  // has no query params besides `q`, so this builds the URL directly rather
  // than reading `searchParams` — reading it here would add it to this
  // effect's own dependencies, re-running the effect off of a URL change
  // this same effect just caused.
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search', {
        scroll: false,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [trimmed, router])

  useEffect(() => {
    if (trimmed.length < 2) return
    const timer = setTimeout(() => {
      if (totalCount === 0 && !pending) {
        trackSearch(trimmed, { has_results: false })
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [trimmed, totalCount, pending])

  return (
    <div className="container-site py-10">
      <h1 className="text-[32px] leading-[1.1] tracking-[-0.5px] md:text-[40px]">
        Search
      </h1>
      <p className="mt-2 text-[15px] text-ink-subtle">
        Search every tool, prompt, and skill on Scult Tools.
      </p>

      <div className="relative mt-6 max-w-[38rem]">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 size-5 text-ink-subtle"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, prompts & skills…"
          aria-label="Search tools, prompts and skills"
          className="field rounded-pill py-4 pl-12 text-[16px]"
        />
      </div>

      <div className="mt-8 max-w-[48rem]">
        {!searching ? (
          <p className="text-[14px] text-ink-subtle">Start typing to search.</p>
        ) : totalCount === 0 && pending ? (
          <p className="text-[14px] text-ink-subtle" aria-live="polite">
            Searching for &ldquo;{trimmed}&rdquo;…
          </p>
        ) : totalCount === 0 ? (
          <div className="rounded-card border border-line bg-cream p-6 text-center">
            <p className="font-medium text-[16px] text-ink">No results for "{trimmed}"</p>
            <p className="mt-2 text-[14px] text-ink-subtle">
              Try a different term, or browse{' '}
              <Link href="/all" className="text-violet-700 underline">
                all tools
              </Link>
              ,{' '}
              <Link href="/prompts" className="text-violet-700 underline">
                prompts
              </Link>
              , or{' '}
              <Link href="/skills" className="text-violet-700 underline">
                skills
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <ResultGroup heading="Tools" hits={toolHits} query={trimmed} />
            <ResultGroup heading="Prompts" hits={promptHits} query={trimmed} />
            <ResultGroup heading="Skills" hits={skillHits} query={trimmed} />
            {skillsLoading && skillHits.length === 0 && (
              <p className="text-[13px] text-ink-subtle">Searching skills…</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
