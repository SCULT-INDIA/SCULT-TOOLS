'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { BLOG_NAV_LINKS } from './blogNavLinks'
import { useDropdownMenu } from './useDropdownMenu'

/**
 * The "Blogs" dropdown — this site's editorial content plus a link out to
 * scult.in's own case-study portfolio. Same single-column chrome as every
 * other nav dropdown here.
 */
export function BlogsMenu() {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  const isActive = pathname === '/blog'

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
        Blogs
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[300px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {BLOG_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
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
