'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { CATEGORIES } from '@/lib/tools/categories'
import { useDropdownMenu } from './useDropdownMenu'

type Item = { slug: string; name: string; blurb: string; icon: string; count: number }

/**
 * The "Tools" dropdown — structured after scult.in's own nav (a single
 * narrow column of icon-chip + title + one-line description rows, centred
 * under its own trigger, with a "View all" row closing it out), rebuilt in
 * this site's own tokens rather than scult.in's dark glass: `border-ink`/
 * `shadow-brutal-sm`/cream fill/violet-700 chips.
 *
 * The one intentional addition beyond a literal copy: the per-row tool
 * count (`c.count`), since a 15-tool catalogue can say something scult.in's
 * services list has no equivalent of — dropped only where a category is 0
 * for some other reason, e.g. reused with a placeholder list.
 *
 * Opens on hover *or* click — see `useDropdownMenu` for why both.
 */
export function CategoryMenu({ items }: { items?: readonly Item[] }) {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  // Active when the current route is a category or tool page — i.e. the
  // first path segment matches a known category slug. Gives the trigger a
  // visual "you are here" state the nav had no way to show before.
  const [firstSegment] = pathname.split('/').filter(Boolean)
  const isActive = CATEGORIES.some((c) => c.slug === firstSegment) || pathname === '/all'

  const list: readonly Item[] =
    items ??
    CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      blurb: c.blurb,
      icon: c.icon,
      count: 0,
    }))

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover here is a pure enhancement — the nested <button> is the real, fully accessible control.
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={isActive ? 'true' : undefined}
        onClick={onTriggerClick}
        className={`flex items-center gap-1 hover:text-violet-600 ${isActive ? 'text-violet-700' : ''}`}
      >
        Tools
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[320px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {list.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  onClick={close}
                  aria-current={c.slug === firstSegment ? 'page' : undefined}
                  className={`group flex items-start gap-3 rounded-card px-2 py-2 transition-colors hover:bg-violet-50 ${
                    c.slug === firstSegment ? 'bg-violet-50' : ''
                  }`}
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm bg-violet-100 transition-colors group-hover:bg-violet-200">
                    <Icon name={c.icon} className="size-4 text-violet-700" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2">
                      <span className="font-semibold text-[14px] text-ink tracking-normal">
                        {c.name}
                      </span>
                      {c.count > 0 ? (
                        <span className="text-[11px] text-ink-subtle">{c.count}</span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-subtle leading-[16px] tracking-normal">
                      {c.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/all"
              onClick={close}
              aria-current={pathname === '/all' ? 'page' : undefined}
              className="flex items-center justify-center gap-1.5 border-line border-t px-3 py-3 font-semibold text-[12px] text-violet-700 uppercase tracking-wider transition-colors hover:bg-violet-50"
            >
              View all tools
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
