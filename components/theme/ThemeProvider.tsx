'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

/**
 * The user's THEME CHOICE, as stored in localStorage. 'system' means "track
 * the OS preference" rather than being a resolved value itself — see
 * `ResolvedTheme` for what actually gets painted.
 */
export type ThemeChoice = 'light' | 'dark' | 'system'

/** What `data-theme` on <html> is actually set to. Never 'system'. */
type ResolvedTheme = 'light' | 'dark'

/**
 * Must match the key read by the blocking inline script in app/layout.tsx
 * byte-for-byte — that script runs before this module ever executes and is
 * what prevents a flash of the wrong theme on load. If this key changes, the
 * script's copy has to change with it.
 */
const STORAGE_KEY = 'theme'

type ThemeContextValue = {
  /** The user's stored choice — 'light' | 'dark' | 'system'. */
  theme: ThemeChoice
  /** What's actually applied to the page right now — 'system' resolved. */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeChoice) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredTheme(): ThemeChoice {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isThemeChoice(stored) ? stored : 'system'
  } catch {
    // localStorage can throw in private-mode/disabled-storage browsers —
    // fall back to the same 'system' default the blocking script uses.
    return 'system'
  }
}

/**
 * Site-wide theme context. Purpose: keep the user's theme CHOICE ('light' |
 * 'dark' | 'system') and the currently RESOLVED theme in sync with
 * `document.documentElement`'s `data-theme` attribute, which is what every
 * dark-mode override in globals.css actually keys off.
 *
 * Inputs: none (reads its initial state from localStorage/matchMedia).
 * Outputs: `theme`, `resolvedTheme`, `setTheme` via `useTheme()`.
 * Dependencies: `window.localStorage`, `window.matchMedia`. No network, no
 * external ports.
 * Failure modes: a disabled/throwing localStorage degrades to in-memory-only
 * state (theme choice won't persist across reloads) rather than crashing.
 *
 * Deliberately does NOT re-derive its initial state from the DOM attribute
 * the blocking script already set. Both read the same localStorage key by
 * the same rule, so they agree without one needing to ask the other — and
 * this component never renders theme-dependent DOM itself (only exposes
 * values via context), so there is no hydration-mismatch risk in having the
 * server-rendered pass and the first client render disagree on `theme`.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(() => readStoredTheme())
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    theme === 'system' ? getSystemTheme() : theme,
  )

  useEffect(() => {
    const apply = (next: ResolvedTheme) => {
      setResolvedTheme(next)
      document.documentElement.setAttribute('data-theme', next)
    }

    apply(theme === 'system' ? getSystemTheme() : theme)

    if (theme !== 'system') return undefined

    // Only in 'system' mode do we need to react to the OS preference
    // changing while the page is open — an explicit light/dark choice is
    // pinned and should ignore the OS.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => apply(getSystemTheme())
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback((next: ThemeChoice) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Soft degradation, not a failure worth surfacing to the user — see
      // readStoredTheme's matching catch above.
    }
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Reads the current theme context. Throws if used outside `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
