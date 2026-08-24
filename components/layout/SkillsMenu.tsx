'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { SKILL_CATEGORIES } from '@/lib/skills/categories'
import { useDropdownMenu } from './useDropdownMenu'

/** First 8 of 24 categories, in the registry's own curated order — same
 * restraint as CategoryMenu/PromptsMenu not trying to list everything;
 * "Browse all skills" covers the rest. */
const FEATURED = SKILL_CATEGORIES.slice(0, 8)

/**
 * The "Skills" dropdown — a curated slice of the Skills Library's 24
 * categories plus a "Browse all skills" footer row. Same single-column
 * chrome as every other nav dropdown here.
 */
export function SkillsMenu() {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  const isActive = pathname === '/skills' || pathname.startsWith('/skills/')

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
        Skills
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[320px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {FEATURED.map((category) => (
                <Link
                  key={category.slug}
                  href={`/skills/${category.slug}`}
                  onClick={close}
                  className="group flex items-start gap-3 rounded-card px-2 py-2 transition-colors hover:bg-violet-50"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm bg-violet-100 transition-colors group-hover:bg-violet-200">
                    <Icon name={category.icon} className="size-4 text-violet-700" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[14px] text-ink tracking-normal">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-subtle leading-[16px] tracking-normal">
                      {category.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/skills"
              onClick={close}
              aria-current={isActive ? 'page' : undefined}
              className="flex items-center justify-center gap-1.5 border-line border-t px-3 py-3 font-semibold text-[12px] text-violet-700 uppercase tracking-wider transition-colors hover:bg-violet-50"
            >
              Browse all skills
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
