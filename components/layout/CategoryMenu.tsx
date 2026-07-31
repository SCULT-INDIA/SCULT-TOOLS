'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { CATEGORIES } from '@/lib/tools/categories'

type Item = { slug: string; name: string; blurb: string; icon: string; count: number }

/**
 * The "Tools" mega-menu.
 *
 * A plain dropdown of eight links would be a wasted surface — each row carries
 * an icon, the category name and a one-line description, which is what makes a
 * 46-tool catalogue navigable.
 *
 * Opens on click and on hover-intent, but the click path is authoritative so it
 * works on touch and by keyboard. Escape closes and returns focus to the trigger.
 */
export function CategoryMenu({ items }: { items?: readonly Item[] }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const list: readonly Item[] =
    items ??
    CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      blurb: c.blurb,
      icon: c.icon,
      count: 0,
    }))

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    /**
     * Click-to-open, deliberately not hover-to-open.
     *
     * Hover menus open by accident when the pointer crosses them, need a
     * grace-period hack to stay open on a diagonal path, and do not exist at all
     * on touch — where the majority of this site's visitors are. A single
     * interaction that behaves identically for mouse, keyboard and touch is both
     * simpler and more predictable.
     */
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 hover:text-violet-600"
      >
        Tools
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-0 z-50 w-[560px] pt-3">
          <div className="grid grid-cols-2 gap-1 rounded-panel border border-line bg-white p-3 shadow-card-raised">
            {list.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 rounded-card p-3 transition-colors hover:bg-violet-50"
              >
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm bg-violet-100">
                  <Icon name={c.icon} className="size-4 text-violet-700" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-semibold text-[15px] text-ink tracking-normal">
                      {c.name}
                    </span>
                    {c.count > 0 ? (
                      <span className="text-[12px] text-ink-subtle">{c.count}</span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-subtle leading-[18px] tracking-normal">
                    {c.blurb}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
