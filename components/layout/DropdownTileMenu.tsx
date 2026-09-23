'use client'

import { ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { useDropdownMenu } from './useDropdownMenu'

export interface DropdownTileItem {
  readonly slug: string
  readonly name: string
  readonly icon: string
  readonly tile: 'yellow' | 'blue' | 'lavender' | 'green'
  readonly href: string
  /** Opens in a new tab, same as any other external link on this site —
   * set for a destination that leaves tools.scult.in (e.g. scult.in). */
  readonly external?: boolean
}

const TILE_BG: Record<DropdownTileItem['tile'], string> = {
  yellow: 'bg-tile-yellow',
  blue: 'bg-tile-blue',
  lavender: 'bg-tile-lavender',
  green: 'bg-tile-green',
}

/**
 * Shared chrome for every nav dropdown (Tools, Prompts, Skills, MCP,
 * Blogs, Our Brands, Resources) — one consistent theme site-wide, not a
 * different look per menu. A 2-column tile grid (one pastel tile per
 * item, cycling the same four colors the category pages themselves use)
 * with an optional "Browse all" link promoted to a full-width filled CTA
 * at the TOP of the panel, not a small text row at the bottom.
 *
 * `browseAllHref`/`browseAllLabel` are optional together — omitted for a
 * menu whose items are already the complete, flat list (Our Brands,
 * Resources), where inventing a "browse all" destination beyond what's
 * already shown would be dishonest rather than useful. The panel's
 * chrome (border, shadow, tile treatment) stays identical either way, so
 * every dropdown still reads as the same menu.
 */
export function DropdownTileMenu({
  label,
  activeMatch,
  items,
  browseAllHref,
  browseAllLabel,
}: {
  label: string
  activeMatch: (pathname: string) => boolean
  items: readonly DropdownTileItem[]
  browseAllHref?: string
  browseAllLabel?: string
}) {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  const isActive = activeMatch(pathname ?? '')

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
        {label}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[560px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            {browseAllHref && browseAllLabel ? (
              <Link
                href={browseAllHref}
                onClick={close}
                aria-current={isActive ? 'page' : undefined}
                className="flex items-center justify-between gap-2 border-ink border-b-2 bg-violet-700 px-4 py-3 font-semibold text-[14px] text-white transition-colors hover:bg-violet-600"
              >
                {browseAllLabel}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
            <div className="grid grid-cols-2 gap-2 p-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={item.href}
                  onClick={close}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`group flex items-center gap-2.5 rounded-card border border-ink/10 px-3 py-2.5 transition-colors hover:border-ink/30 ${TILE_BG[item.tile]}`}
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-white/70">
                    <Icon name={item.icon} className="size-4 text-ink" />
                  </span>
                  <span className="min-w-0 truncate font-semibold text-[13px] text-ink">
                    {item.name}
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
