'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { PROMPT_GROUPS } from '@/lib/prompts/categories'
import type { PromptGroupSlug } from '@/lib/prompts/types'
import { useDropdownMenu } from './useDropdownMenu'

/** `PromptGroup` (unlike `PromptCategory`) carries no icon of its own —
 * groups only exist for the hub page and this menu, so the mapping lives
 * here rather than growing the registry's own type for one caller. */
const GROUP_ICON: Record<PromptGroupSlug, string> = {
  'ai-models': 'Bot',
  development: 'Code',
  marketing: 'TrendingUp',
  design: 'Palette',
  business: 'Briefcase',
  content: 'PenTool',
  education: 'GraduationCap',
  'image-ai': 'ImageIcon',
  'video-ai': 'Video',
}

/**
 * The "Prompts" dropdown — the library's 9 top-level groups, each linking
 * to its real `#slug` section on `/prompts` (confirmed to exist there, not
 * invented for this menu), plus a "Browse all prompts" footer row. Same
 * single-column chrome as every other nav dropdown here.
 */
export function PromptsMenu() {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  const isActive = pathname === '/prompts' || pathname.startsWith('/prompts/')

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
        Prompts
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[320px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {PROMPT_GROUPS.map((group) => (
                <Link
                  key={group.slug}
                  href={`/prompts#${group.slug}`}
                  onClick={close}
                  className="group flex items-start gap-3 rounded-card px-2 py-2 transition-colors hover:bg-violet-50"
                >
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-sm bg-violet-100 transition-colors group-hover:bg-violet-200">
                    <Icon
                      name={GROUP_ICON[group.slug]}
                      className="size-4 text-violet-700"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[14px] text-ink tracking-normal">
                      {group.name}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink-subtle leading-[16px] tracking-normal">
                      {group.blurb}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/prompts"
              onClick={close}
              aria-current={isActive ? 'page' : undefined}
              className="flex items-center justify-center gap-1.5 border-line border-t px-3 py-3 font-semibold text-[12px] text-violet-700 uppercase tracking-wider transition-colors hover:bg-violet-50"
            >
              Browse all prompts
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  )
}
