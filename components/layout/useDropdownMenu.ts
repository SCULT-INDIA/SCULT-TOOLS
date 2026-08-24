'use client'

import { useEffect, useRef, useState } from 'react'

/** Long enough to survive a diagonal move or a momentary overshoot onto a
 * neighbouring element; short enough that it never reads as "stuck open". */
const CLOSE_DELAY_MS = 150

/**
 * Shared open/close behaviour for the nav's dropdown menus (CategoryMenu,
 * ExploreMenu, ResourcesMenu) — opens on hover *or* click (hover has no
 * touch equivalent, so click stays the authoritative path on touch and by
 * keyboard), closes on Escape, on an outside click, or after a short delay
 * once the pointer leaves both the trigger and the open panel.
 *
 * The delayed close relies on the panel being a DOM descendant of `rootRef`
 * even though it's positioned elsewhere via `position: absolute` —
 * `mouseleave` on `rootRef` only fires once the pointer is over something
 * outside that DOM subtree, so moving from the trigger down into the panel
 * never triggers it, gap or no gap.
 */
export function useDropdownMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function cancelClose() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function scheduleClose() {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  function onMouseEnter() {
    cancelClose()
    setOpen(true)
  }

  function onMouseLeave() {
    scheduleClose()
  }

  function onTriggerClick() {
    cancelClose()
    setOpen((v) => !v)
  }

  function close() {
    cancelClose()
    setOpen(false)
  }

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Belt-and-suspenders: clears a pending close timer if the component
  // unmounts mid-delay (e.g. a route change right as the pointer leaves).
  // Reads closeTimer directly rather than calling cancelClose so this
  // effect has no outer-function dependency to go stale.
  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current)
    }
  }, [])

  return { open, rootRef, triggerRef, onMouseEnter, onMouseLeave, onTriggerClick, close }
}
