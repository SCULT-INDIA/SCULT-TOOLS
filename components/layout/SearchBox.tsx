'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { SEARCH_INDEX, type SearchHit, searchTools } from '@/lib/tools/search'

/**
 * Tool search with a full combobox keyboard contract.
 *
 * Implements the ARIA 1.2 combobox pattern rather than a bare input: arrow keys
 * move a virtual cursor via aria-activedescendant, Enter navigates, Escape
 * closes, and the listbox is announced. `Cmd/Ctrl+K` focuses it from anywhere.
 */
export function SearchBox({ size = 'default' }: { size?: 'default' | 'large' }) {
  const router = useRouter()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [hits, setHits] = useState<readonly SearchHit[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const next = searchTools(query)
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
          aria-label="Search tools"
          placeholder={
            large ? `Search ${SEARCH_INDEX.length} free tools…` : 'Search tools…'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => hits.length > 0 && setOpen(true)}
          className={`field rounded-pill ${large ? 'py-3.5 pl-12 text-[17px]' : 'pl-11'} pr-4`}
        />
      </div>

      {/* Options are <div role="option"> rather than <li>, and are deliberately
          NOT focusable: under the ARIA 1.2 combobox pattern focus stays on the
          input and the active option is conveyed by aria-activedescendant. All
          key handling therefore lives on the input, not on each option. */}
      {open && hits.length > 0 ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-card border border-line bg-white shadow-card-raised"
        >
          {hits.map((hit, i) => (
            <div
              key={hit.slug}
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
                i === active ? 'bg-violet-50' : 'bg-white'
              }`}
            >
              {/* The tool's own mark — same white-disc file as its favicon,
                  so the result row previews exactly the tab you are about to
                  open. */}
              <Image
                src={`/tool-icons/${hit.slug}.png`}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full ring-1 ring-line"
              />
              <span className="min-w-0">
                <span className="block truncate font-medium text-[15px] text-ink">
                  {hit.name}
                </span>
                <span className="block truncate text-[13px] text-ink-subtle">
                  {hit.categoryName}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
