'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { BRAND_LINKS } from './brandLinks'
import { useDropdownMenu } from './useDropdownMenu'

/**
 * The "Our Brands" dropdown — the two sibling Scult properties. Both links
 * leave this site, so every row opens in a new tab. Same single-column
 * chrome as every other nav dropdown here.
 */
export function OurBrandsMenu() {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()

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
        onClick={onTriggerClick}
        className="flex items-center gap-1 hover:text-violet-600"
      >
        Our Brands
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[280px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {BRAND_LINKS.map((brand) => (
                <Link
                  key={brand.href}
                  href={brand.href}
                  onClick={close}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-card px-2 py-2 transition-colors hover:bg-violet-50"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm bg-violet-100 transition-colors group-hover:bg-violet-200">
                    <Icon name={brand.icon} className="size-4 text-violet-700" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[14px] text-ink tracking-normal">
                      {brand.label}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-subtle leading-[16px] tracking-normal">
                      {brand.blurb}
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
