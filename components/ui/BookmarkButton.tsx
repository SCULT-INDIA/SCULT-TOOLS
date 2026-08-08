'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * "Bookmark this page" — a fixed top-right icon button on every tool page,
 * styled after the same fixed-corner convention FloatingActions already
 * uses for the WhatsApp/Scult launchers (bottom-5, size-14, hover:scale-110)
 * so it reads as the same family of UI, just claiming the one corner those
 * two don't use.
 *
 * Genuinely cross-browser, but not the way a first guess would build it: no
 * current browser exposes a JavaScript API that opens the native bookmark
 * dialog. `window.external.AddFavorite` was Internet Explorer only and IE
 * is dead; `window.sidebar.addPanel` was old Firefox only and was removed
 * years ago; Chrome/Edge/Safari/current Firefox never shipped an
 * equivalent — left out deliberately, the same reason no site can
 * auto-play audio or read the clipboard unprompted. A button that just
 * calls a nonexistent API and silently does nothing would be a broken
 * feature wearing a working one's icon.
 *
 * What IS universal across every current browser is the keyboard shortcut
 * itself — Ctrl+D (Cmd+D on macOS) opens that browser's own "Add bookmark"
 * dialog, unconditionally, on every platform these tools run on. So this
 * button's honest job is: try the two legacy APIs in case someone really
 * is on IE11 or a 20-year-old Firefox (harmless no-op everywhere else),
 * and otherwise surface the real shortcut rather than a fake one.
 */
export function BookmarkButton() {
  const [justShown, setJustShown] = useState(false)
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    // Read once on mount, not during render: navigator is undefined on the
    // server, and this only ever changes the label of a hint, never any
    // logic, so a slightly-late correction on first paint is unnoticeable.
    // navigator.platform is deprecated but still universally present and
    // typed everywhere — userAgentData (its replacement) is Chromium-only
    // and would defeat the point of a feature about working everywhere.
    setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform))
  }, [])

  useEffect(() => {
    if (!justShown) return
    const t = setTimeout(() => setJustShown(false), 4000)
    return () => clearTimeout(t)
  }, [justShown])

  function handleClick(): void {
    try {
      const w = window as Window & {
        external?: { AddFavorite?: (url: string, title: string) => void }
        sidebar?: { addPanel?: (title: string, url: string, customize: string) => void }
      }
      // Internet Explorer's own API — dead in every browser still
      // receiving updates, but a real, working call if it ever exists.
      if (typeof w.external?.AddFavorite === 'function') {
        w.external.AddFavorite(window.location.href, document.title)
        return
      }
      // Old Firefox's own API — same story, removed from current Firefox.
      if (typeof w.sidebar?.addPanel === 'function') {
        w.sidebar.addPanel(document.title, window.location.href, '')
        return
      }
    } catch {
      // Some browsers expose window.external as a restricted host object
      // that throws on property access rather than returning undefined —
      // fall through to the shortcut hint exactly as if neither API
      // existed, since that's the only thing guaranteed to work here.
    }
    // Every browser actually in use today: no API exists to open the
    // dialog, so show the shortcut that does the same thing directly.
    setJustShown(true)
  }

  return (
    <span className="fixed top-5 right-5 z-40 block">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Bookmark this page"
        aria-describedby={justShown ? 'bookmark-hint' : undefined}
        className="group flex size-14 items-center justify-center rounded-[22.5%] border border-ink bg-violet-700 shadow-card-raised transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-110 hover:bg-violet-600 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {justShown ? (
          <BookmarkCheck className="size-6 text-white" aria-hidden="true" />
        ) : (
          <Bookmark className="size-6 text-white" aria-hidden="true" />
        )}
      </button>
      {justShown ? (
        <span
          id="bookmark-hint"
          role="status"
          className="absolute top-full right-0 z-10 mt-2 w-max max-w-[15rem] rounded-sm border border-ink bg-ink px-3 py-2 text-[13px] text-offwhite shadow-card"
        >
          Press{' '}
          <kbd className="font-sans font-semibold">
            {isMac ? '⌘ Cmd + D' : 'Ctrl + D'}
          </kbd>{' '}
          to bookmark this page
        </span>
      ) : null}
    </span>
  )
}
