'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import {
  PROMPT_COUNT,
  type PromptSearchEntry,
  type SearchHit,
  searchSite,
  TOOL_COUNT,
} from '@/lib/search'

/** SSR-safe: defaults to the non-Mac label so server and first client render
 * agree, then corrects itself post-mount if the platform is actually Mac. */
function useShortcutLabel(): string {
  const [label, setLabel] = useState('Ctrl K')
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setLabel('⌘K')
  }, [])
  return label
}

/** Same pastel-per-category mapping PromptCard uses, so a prompt's search row
 * previews the same disc colour as its card. */
const TILE_BG: Record<PromptSearchEntry['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/**
 * Site-wide search (tools + prompt library) with a full combobox keyboard
 * contract.
 *
 * Implements the ARIA 1.2 combobox pattern rather than a bare input: arrow keys
 * move a virtual cursor via aria-activedescendant, Enter navigates, Escape
 * closes, and the listbox is announced. `Cmd/Ctrl+K` focuses it from anywhere.
 * Results arrive from searchSite() with all tool hits before all prompt hits,
 * so the flat keyboard index maps 1:1 onto the two labelled groups below.
 */
export function SearchBox({
  size = 'default',
  onNavigate,
}: {
  size?: 'default' | 'large'
  /** Called right before navigating to a picked result — e.g. the mobile
   * drawer closes itself here, since it has no other way to know a search
   * selection (as opposed to a plain link click, which it already handles
   * inline) is about to leave the page. */
  onNavigate?: () => void
}) {
  const router = useRouter()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [hits, setHits] = useState<readonly SearchHit[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const next = searchSite(query)
    setHits(next)
    setActive(0)
    setOpen(next.length > 0)
  }, [query])

  // Cmd/Ctrl+K focuses search from anywhere on the page.
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

  // Close when focus or a click leaves the widget.
  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [])

  function go(hit: SearchHit | undefined) {
    if (!hit) return
    setOpen(false)
    setQuery('')
    onNavigate?.()
    router.push(hit.href)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!open || hits.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % hits.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + hits.length) % hits.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(hits[active])
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(hits.length - 1)
    }
  }

  const large = size === 'large'
  const shortcutLabel = useShortcutLabel()
  // Hidden once there's a query or the listbox is open — a shortcut hint
  // sitting behind live search results reads as a stray leftover, not a tip.
  const showShortcutHint = query === '' && !open

  // searchSite() returns tools-then-prompts, so these partitions preserve the
  // flat `hits` order and each option's id can stay `${listId}-${flat index}`.
  const toolHits = hits.filter((h) => h.kind === 'tool')
  const promptHits = hits.filter((h) => h.kind !== 'tool')

  /* Options are <div role="option"> rather than <li>, and are deliberately
     NOT focusable: under the ARIA 1.2 combobox pattern focus stays on the
     input and the active option is conveyed by aria-activedescendant. All
     key handling therefore lives on the input, not on each option. */
  function renderOption(hit: SearchHit, i: number) {
    return (
      <div
        key={hit.href}
        id={`${listId}-${i}`}
        role="option"
        tabIndex={-1}
        aria-selected={i === active}
        onMouseEnter={() => setActive(i)}
        onMouseDown={(e) => {
          // Prevent the input losing focus before the click resolves.
          e.preventDefault()
          go(hit)
        }}
        className={`flex cursor-pointer items-center gap-3 px-4 py-3 ${
          i === active ? 'bg-violet-50' : 'bg-cream'
        }`}
      >
        {hit.kind === 'tool' ? (
          /* The tool's own mark — same white-disc file as its favicon, so the
             result row previews exactly the tab you are about to open. */
          <Image
            src={`/tool-icons/${hit.slug}.png`}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full ring-1 ring-line"
          />
        ) : (
          /* Prompts have no per-item mark; their category's Lucide icon on its
             pastel tile (PromptCard's fallback treatment) stands in. */
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-line ${TILE_BG[hit.tile]}`}
          >
            <Icon name={hit.icon} className="size-4 text-violet-700" />
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate font-medium text-[15px] text-ink">
            {hit.name}
          </span>
          <span className="block truncate text-[13px] text-ink-subtle">
            {hit.categoryName}
          </span>
        </span>
      </div>
    )
  }

  function renderGroupHeading(id: string, label: string, withRule: boolean) {
    return (
      <div
        id={id}
        role="presentation"
        className={`px-4 pt-2.5 pb-1 font-semibold text-[11px] text-ink-subtle uppercase tracking-[0.12em] ${
          withRule ? 'border-line-grey border-t' : ''
        }`}
      >
        {label}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative">
        <Search
          className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-subtle ${large ? 'size-5' : 'size-4'}`}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && hits[active] ? `${listId}-${active}` : undefined}
          aria-label="Search tools and prompts"
          placeholder={
            large
              ? `Search ${TOOL_COUNT} free tools & ${PROMPT_COUNT} prompts…`
              : 'Search tools & prompts…'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => hits.length > 0 && setOpen(true)}
          className={`field rounded-pill ${large ? 'py-3.5 pl-12 pr-16 text-[17px]' : 'pl-11 pr-11'}`}
        />
        {showShortcutHint ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-sm border border-line-grey px-1.5 py-0.5 font-sans text-[11px] text-ink-subtle"
          >
            {shortcutLabel}
          </span>
        ) : null}
      </div>

      {open && hits.length > 0 ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-card border border-line bg-cream shadow-card-raised"
        >
          {toolHits.length > 0 ? (
            // biome-ignore lint/a11y/useSemanticElements: role="group" is how ARIA 1.2 labels a section of options INSIDE a listbox; <fieldset> is for form controls and is invalid here.
            <div role="group" aria-labelledby={`${listId}-group-tools`}>
              {renderGroupHeading(`${listId}-group-tools`, 'Tools', false)}
              {toolHits.map((hit, i) => renderOption(hit, i))}
            </div>
          ) : null}
          {promptHits.length > 0 ? (
            // biome-ignore lint/a11y/useSemanticElements: role="group" is how ARIA 1.2 labels a section of options INSIDE a listbox; <fieldset> is for form controls and is invalid here.
            <div role="group" aria-labelledby={`${listId}-group-prompts`}>
              {renderGroupHeading(
                `${listId}-group-prompts`,
                'Prompts',
                toolHits.length > 0,
              )}
              {promptHits.map((hit, i) => renderOption(hit, toolHits.length + i))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
