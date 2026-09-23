'use client'

import { ArrowUp, Sparkles, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { trackSearch } from '@/lib/analytics'
import {
  type AssistantIntent,
  CATALOGUE_LINKS,
  type ParsedMessage,
  parseMessage,
  replyText,
} from '@/lib/assistant-reply'
import {
  type PromptSearchEntry,
  rankSearch,
  type SearchHit,
  type ToolSearchEntry,
} from '@/lib/search-client'
import type { SkillHit } from '@/lib/skills/search-hit'
import { useSkillSearchHitsForTerms } from '@/lib/skills/use-skill-search'
import { useSearchIndex } from '@/lib/use-search-index'

const SUGGESTIONS = ['audit my resume', 'overdue invoice', 'react testing'] as const

const RESULT_LIMIT = 6

const TILE_BG: Record<PromptSearchEntry['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

interface Turn {
  readonly id: number
  readonly text: string
  readonly parsed: ParsedMessage
}

/**
 * The homepage's chat-style entry point: the same tools + prompts + skills
 * search the header box runs, answered as a sentence plus links to the
 * matching pages. Keyword-matched, not a language model — see
 * lib/assistant-reply.ts for why, and the reply text never claims otherwise.
 *
 * Kept minimal by request: one input pill (the hero's primary element, same
 * width the plain search box had) and, once asked, a quiet thread under it —
 * no chrome, avatars or speech bubbles. Speed: the tools/prompts index is
 * fetched as soon as the page is idle (not on first focus, as the header box
 * does), so the first answer is instant; the skills leg (a network call)
 * fills in a moment later without holding the rest of the answer back.
 */
export function HeroAssistant() {
  const [turns, setTurns] = useState<readonly Turn[]>([])
  const [draft, setDraft] = useState('')
  const [wantsIndex, setWantsIndex] = useState(false)
  const { toolEntries, promptEntries } = useSearchIndex(wantsIndex)
  const inputRef = useRef<HTMLInputElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  // Preload the index once the page is idle so the first answer never waits
  // on a fetch. Any earlier intent (hover, focus) still pulls it in sooner.
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback
    if (idle) {
      const handle = idle(() => setWantsIndex(true), { timeout: 1500 })
      return () => window.cancelIdleCallback?.(handle)
    }
    const timer = setTimeout(() => setWantsIndex(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Keep the newest answer in view as it (and its late skills) grows.
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  })

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setWantsIndex(true)
    setTurns((prev) => [
      ...prev,
      { id: nextId.current++, text: trimmed, parsed: parseMessage(trimmed) },
    ])
    setDraft('')
    inputRef.current?.focus()
  }

  return (
    <div className="w-full text-left">
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
      >
        <Sparkles
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-violet-700"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onPointerEnter={() => setWantsIndex(true)}
          onFocus={() => setWantsIndex(true)}
          aria-label="Ask for a tool, prompt or skill"
          placeholder="Ask for a tool, prompt or skill…"
          autoComplete="off"
          className="field rounded-pill py-6 pr-16 pl-12 text-[17px]"
        />
        <button
          type="submit"
          disabled={draft.trim() === ''}
          aria-label="Send"
          className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-violet-700 text-white transition-colors hover:bg-violet-600 disabled:bg-ink/15"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      </form>

      {turns.length === 0 ? (
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] text-ink-subtle">
          <span>Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              onPointerEnter={() => setWantsIndex(true)}
              className="rounded-pill border border-line-grey px-2.5 py-0.5 text-ink transition-colors hover:border-ink"
            >
              {s}
            </button>
          ))}
        </p>
      ) : (
        <div
          ref={threadRef}
          role="log"
          aria-live="polite"
          aria-label="Answers"
          className="relative mt-3 max-h-[22rem] overflow-y-auto overscroll-contain rounded-card border border-line bg-white px-5 py-4 shadow-card-raised"
        >
          <button
            type="button"
            onClick={() => setTurns([])}
            aria-label="Clear"
            className="absolute top-3 right-3 grid size-7 place-items-center rounded-full text-ink-subtle hover:bg-offwhite hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          {turns.map((turn, i) => (
            <div
              key={turn.id}
              className={i > 0 ? 'mt-4 border-line-grey border-t pt-4' : 'pr-8'}
            >
              <p className="font-medium text-[13px] text-ink-subtle">{turn.text}</p>
              <AssistantReply
                parsed={turn.parsed}
                toolEntries={toolEntries}
                promptEntries={promptEntries}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const GROUP_ORDER: readonly AssistantIntent[] = ['tool', 'prompt', 'skill']
const GROUP_LABEL: Record<AssistantIntent, string> = {
  tool: 'Tools',
  prompt: 'Prompts',
  skill: 'Skills',
}

/** One answer in the thread. Owns its own skills request so the answer is
 * stable once given — a later question never rewrites an earlier one. */
function AssistantReply({
  parsed,
  toolEntries,
  promptEntries,
}: {
  parsed: ParsedMessage
  toolEntries: readonly ToolSearchEntry[]
  promptEntries: readonly PromptSearchEntry[]
}) {
  const hits = useMemo(
    () => rankSearch(toolEntries, promptEntries, parsed.keywords, RESULT_LIMIT),
    [toolEntries, promptEntries, parsed.keywords],
  )
  const { hits: skillHits, loading: skillsLoading } = useSkillSearchHitsForTerms(
    parsed.terms,
  )

  const groups: Record<AssistantIntent, readonly (SearchHit | SkillHit)[]> = {
    tool: hits.filter((h) => h.kind === 'tool'),
    prompt: hits.filter((h) => h.kind === 'prompt' || h.kind === 'prompt-category'),
    skill: skillHits,
  }
  const counts = {
    tools: groups.tool.length,
    prompts: groups.prompt.length,
    skills: groups.skill.length,
  }
  const total = counts.tools + counts.prompts + counts.skills

  // Catalogues asked for by name come first; the rest keep the site's order.
  const order = [
    ...parsed.intents,
    ...GROUP_ORDER.filter((g) => !parsed.intents.includes(g)),
  ]

  // One analytics event per answer, once the skills leg has settled — the
  // same "did search find anything" signal the header box sends.
  const tracked = useRef(false)
  useEffect(() => {
    if (tracked.current || skillsLoading || !parsed.keywords) return
    tracked.current = true
    trackSearch(parsed.display, { has_results: total > 0, source: 'assistant' })
  }, [skillsLoading, parsed.keywords, parsed.display, total])

  const showCatalogue = !parsed.keywords
    ? parsed.intents.length > 0
    : total === 0 && !skillsLoading
  const catalogueLinks =
    parsed.intents.length > 0 && !parsed.keywords
      ? CATALOGUE_LINKS.filter((l) => parsed.intents.includes(l.intent))
      : CATALOGUE_LINKS

  return (
    <div className="mt-1.5 text-[15px] text-ink leading-6">
      <p>{replyText(parsed, counts, skillsLoading)}</p>

      {total > 0 ? (
        <div className="mt-2.5 flex flex-col gap-2.5">
          {order.map((group) =>
            groups[group].length > 0 ? (
              <div key={group}>
                <p className="mb-1 font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.12em]">
                  {GROUP_LABEL[group]}
                </p>
                <ul className="flex flex-col">
                  {groups[group].map((hit) => (
                    <li key={hit.href}>
                      <ResultLink hit={hit} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
          {parsed.keywords ? (
            <Link
              href={`/search?q=${encodeURIComponent(parsed.keywords)}`}
              className="font-semibold text-[13px] text-violet-700 hover:underline"
            >
              See every result for &ldquo;{parsed.display}&rdquo; →
            </Link>
          ) : null}
        </div>
      ) : null}

      {showCatalogue ? (
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
          {catalogueLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-violet-700 hover:underline">
              {l.label} →
            </Link>
          ))}
        </p>
      ) : null}
    </div>
  )
}

function ResultLink({ hit }: { hit: SearchHit | SkillHit }) {
  return (
    <Link
      href={hit.href}
      className="group -mx-2 flex items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors hover:bg-offwhite"
    >
      {hit.kind === 'tool' ? (
        <Image
          src={`/tool-icons/${hit.slug}.png`}
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className="size-[22px] shrink-0 rounded-full ring-1 ring-line"
        />
      ) : (
        <span
          className={`grid size-[22px] shrink-0 place-items-center rounded-full ring-1 ring-line ${TILE_BG[hit.tile]}`}
        >
          <Icon name={hit.icon} className="size-3 text-violet-700" />
        </span>
      )}
      <span className="min-w-0 truncate">
        <span className="font-medium text-[14px] text-ink group-hover:text-violet-700 group-hover:underline">
          {hit.name}
        </span>
        <span className="text-[13px] text-ink-subtle"> · {hit.categoryName}</span>
      </span>
    </Link>
  )
}
