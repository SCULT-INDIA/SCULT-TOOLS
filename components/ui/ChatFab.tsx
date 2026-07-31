'use client'

import { MessageCircleQuestion, X } from 'lucide-react'
import { useState } from 'react'
import { parentLink } from '@/lib/site'

/**
 * Reference: a fixed circular chat launcher in the bottom-right corner on
 * every page.
 *
 * Re-scoped from sales chat to tool help: there is no live-chat backend behind
 * this, so rather than fake a chat widget, the bubble expands into a small
 * honest panel — "stuck on something?" with a direct, real contact link. No
 * simulated typing, no fake agent.
 */
export function ChatFab() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed right-5 bottom-5 z-40">
      {open ? (
        <div
          role="dialog"
          aria-label="Get help"
          className="mb-3 w-72 rounded-panel border border-line bg-white p-5 shadow-card-raised"
        >
          <p className="font-display font-semibold text-[17px] tracking-normal">
            Stuck on something?
          </p>
          <p className="mt-1.5 text-[14px] text-ink-muted leading-5">
            Every tool page explains its own formula and limitations further down the
            page. If that doesn't answer it, reach the team directly.
          </p>
          <a
            href={parentLink('/contact', 'chat-fab')}
            className="btn-brutal btn-brutal-sm mt-4 w-full justify-center"
          >
            CONTACT SCULT
          </a>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close help' : 'Get help'}
        className="grid size-14 place-items-center rounded-pill border border-ink bg-ink text-white shadow-brutal transition-transform hover:scale-105"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <MessageCircleQuestion className="size-6" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
