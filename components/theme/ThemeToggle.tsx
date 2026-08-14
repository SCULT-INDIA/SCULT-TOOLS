'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { type ThemeChoice, useTheme } from './ThemeProvider'

const CYCLE: Record<ThemeChoice, ThemeChoice> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

const LABEL: Record<ThemeChoice, string> = {
  light: 'Light theme',
  dark: 'Dark theme',
  system: 'System theme',
}

/**
 * Header theme control. Purpose: let a visitor override the site's
 * light/dark appearance and hand control back to the OS.
 *
 * Design decision — a three-state cycle (Light -> Dark -> System -> Light),
 * not a plain light/dark flip: this site's no-flash bootstrap script
 * (app/layout.tsx) treats 'system' as the real default for a first-time
 * visitor. A two-state toggle would force every visitor who touches it into
 * a permanent manual override, with no way back to "match my OS" short of
 * clearing localStorage. The three-state cycle makes 'system' a first-class,
 * reachable state instead of a one-way default you can only leave.
 *
 * Inputs: none (reads/writes theme via `useTheme()`).
 * Outputs: none (side-effects only, via `setTheme`).
 * Dependencies: `ThemeProvider` (must be an ancestor) and `lucide-react`.
 * Failure modes: throws (via `useTheme`) if rendered outside `ThemeProvider`.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // Gated on `mounted`, not on `theme`, so this component's first CLIENT
  // render (hydration) renders the exact same icon the server did. `theme`
  // is already resolved from localStorage by the time this component
  // mounts on the client (see ThemeProvider's lazy useState initializer),
  // which would otherwise disagree with the server's window-less 'system'
  // default and trigger a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const displayTheme: ThemeChoice = mounted ? theme : 'system'
  const next = CYCLE[displayTheme]
  const ThemeIcon =
    displayTheme === 'light' ? Sun : displayTheme === 'dark' ? Moon : Monitor

  return (
    <button
      type="button"
      onClick={() => {
        const to = CYCLE[theme]
        trackEvent('theme_change', { from: theme, to })
        setTheme(to)
      }}
      aria-label={`Theme: ${LABEL[displayTheme]}. Click to switch to ${LABEL[next]}.`}
      title={LABEL[displayTheme]}
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-violet-50 lg:size-11"
    >
      <ThemeIcon className="size-5" aria-hidden="true" />
    </button>
  )
}
