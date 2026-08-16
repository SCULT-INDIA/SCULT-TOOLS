'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { SearchBox } from './SearchBox'

interface DrawerCategory {
  readonly slug: string
  readonly name: string
  readonly icon: string
  readonly count: number
}

/**
 * Mobile navigation, matching the reference: a 260px panel sliding in from the
 * right over a black/40 scrim.
 *
 * Dialog semantics are done properly because a drawer that traps nobody is worse
 * than no drawer: focus moves in on open, Tab cycles inside, Escape closes, the
 * body stops scrolling behind it, and focus returns to the trigger on close.
 *
 * Colors are deliberately the same in dark mode as light — brand/accent
 * colors (the violet wordmark, the violet-700 category icons) do not adapt
 * per theme, only the surfaces around them do.
 */
export function MobileDrawer({
  categories,
  toolCount,
  promptCount,
}: {
  /** Slim, server-computed per-category tool counts — see `Header.tsx`'s
   * `menuItems`, which this reuses rather than calling `getToolCount` again
   * here (that would pull the full `TOOLS` registry into this client
   * component just to read a length per category). */
  categories: readonly DrawerCategory[]
  /** Forwarded to the nested SearchBox for its placeholder text only. */
  toolCount: number
  promptCount: number
}) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const [firstSegment] = pathname.split('/').filter(Boolean)

  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus into the panel so the next Tab lands inside it.
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      )
    focusables()[0]?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex size-11 flex-col items-center justify-center gap-[7px] lg:hidden"
      >
        <span className="block h-0.5 w-6 bg-ink" />
        <span className="block h-0.5 w-6 bg-ink" />
        <span className="block h-0.5 w-6 bg-ink" />
      </button>

      {/* Scrim — matches the reference's bg-black/40 at 300ms. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed top-0 right-0 z-70 h-full w-[260px] bg-cream transition-transform duration-300 md:w-[300px] lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="flex items-center justify-between border-line border-b p-4 pr-3">
          <span className="font-display font-bold text-[22px] text-violet-600">
            Scult Tools
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded p-2"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Cmd/Ctrl+K has no equivalent on a touchscreen, and this drawer is
            the only nav surface visible below `lg` — without this, search
            was reachable only from a physical keyboard, i.e. never on
            mobile. `onNavigate` closes the drawer itself, since picking a
            search result (unlike clicking a link below) doesn't already run
            through this component's own `setOpen(false)` handlers. */}
        <div className="border-line border-b p-4">
          <SearchBox
            toolCount={toolCount}
            promptCount={promptCount}
            onNavigate={() => setOpen(false)}
          />
        </div>

        <nav aria-label="Categories" className="flex flex-col gap-1 overflow-y-auto p-4">
          <Link
            href="/all"
            onClick={() => setOpen(false)}
            aria-current={pathname === '/all' ? 'page' : undefined}
            className={`flex items-center justify-between rounded-sm px-2 py-2.5 font-medium text-[17px] hover:text-violet-600 ${
              pathname === '/all' ? 'text-violet-700' : ''
            }`}
          >
            All tools
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              onClick={() => setOpen(false)}
              aria-current={c.slug === firstSegment ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-sm px-2 py-2.5 text-[17px] hover:text-violet-600 ${
                c.slug === firstSegment ? 'bg-violet-50 text-violet-700' : ''
              }`}
            >
              <Icon name={c.icon} className="size-4 shrink-0 text-violet-700" />
              <span className="flex-1">{c.name}</span>
              <span className="text-[13px] text-ink-subtle">{c.count}</span>
            </Link>
          ))}
          <Link
            href="/prompts"
            onClick={() => setOpen(false)}
            aria-current={
              pathname === '/prompts' || pathname.startsWith('/prompts/') ? 'page' : undefined
            }
            className={`mt-1 flex items-center justify-between rounded-sm border-line border-t px-2 py-2.5 pt-3.5 font-medium text-[17px] hover:text-violet-600 ${
              pathname === '/prompts' || pathname.startsWith('/prompts/')
                ? 'text-violet-700'
                : ''
            }`}
          >
            Prompts
          </Link>
        </nav>
      </div>
    </>
  )
}
