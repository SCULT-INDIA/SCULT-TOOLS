'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { useDropdownMenu } from './useDropdownMenu'

interface McpLink {
  readonly href: string
  readonly label: string
  readonly blurb: string
  readonly icon: string
}

/** Each row is a real, existing anchor on `/mcp` (see the `id=` attributes
 * on that page's own `<section>`s), not an invented sub-page. */
const MCP_LINKS: readonly McpLink[] = [
  {
    href: '/mcp#endpoint',
    label: 'The Endpoint',
    blurb: 'One Streamable HTTP URL, no separate SSE config',
    icon: 'Network',
  },
  {
    href: '/mcp#connect',
    label: 'Connect',
    blurb: 'Claude Code, Claude Desktop, Cursor, ChatGPT',
    icon: 'Rocket',
  },
  {
    href: '/mcp#tools',
    label: "What's Callable",
    blurb: '25 tools across every library on this site',
    icon: 'Bot',
  },
  {
    href: '/mcp#rate-limits',
    label: 'Rate Limits',
    blurb: 'Two limits, tracked per connection',
    icon: 'Gauge',
  },
]

/**
 * The "MCP" dropdown — sections of the single `/mcp` page, not separate
 * destinations (there's only one MCP page on this site). Same single-column
 * chrome as every other nav dropdown here.
 */
export function McpMenu() {
  const { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close } =
    useDropdownMenu()
  const pathname = usePathname()
  const isActive = pathname === '/mcp'

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
        MCP
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute top-full left-1/2 z-50 w-[280px] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-panel border-2 border-ink bg-cream shadow-brutal-sm">
            <div className="p-2">
              {MCP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
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
