'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { RESOURCE_HREFS, RESOURCE_LINKS } from './resourceLinks'
import { useDropdownMenu } from './useDropdownMenu'

/**
 * The "Resources" dropdown — structured after scult.in's own nav (a single
 * narrow column of icon-chip + title + one-line description rows, centred
 * under its own trigger), rebuilt entirely in this site's own tokens:
 * `border-ink`/`shadow-brutal-sm`/cream fill/violet-700 icon chips, none of
 * scult.in's dark-glass styling carried over.
 *
 * Centred on this trigger specifically (`className="relative"` on the root
 * below), not the whole bar — an earlier version centred every dropdown on
 * `.nav-pill` instead so they'd all land in the same spot, but that reads
 * as the panel jumping sideways away from whichever trigger opened it,
 * which is exactly what was asked to stop. The nav's own `justify-center`
 * (see `Header.tsx`) does the "keep it centred" work at the row level now,
 * so no individual dropdown needs to re-centre itself.
 *
 * Opens on hover *or* click — see `useDropdownMenu` for why both.
 */
export function ResourcesMenu() {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  const isActive = RESOURCE_HREFS.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  )

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
        Resources
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[300px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {RESOURCE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className="group flex items-start gap-3 rounded-card px-2 py-2 transition-colors hover:bg-violet-50"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm bg-violet-100 transition-colors group-hover:bg-violet-200">
                    <Icon name={link.icon} className="size-4 text-violet-700" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[14px] text-ink tracking-normal">
                      {link.label}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-subtle leading-[16px] tracking-normal">
                      {link.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
