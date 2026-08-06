'use client'

import { type RefObject, useEffect } from 'react'

/**
 * Shared open/close behaviour for tool drawers/modals (Schema Markup
 * Generator's Schema Types drawer and Rich Result Preview modal, FAQ Schema
 * Generator's Preview modal, and any future one): locks body scroll, closes
 * on Escape, traps Tab inside the panel, and returns focus to whatever
 * opened it on close — the same contract `MobileDrawer.tsx` already
 * establishes for exactly this pattern elsewhere in the codebase.
 *
 * Takes the raw `setOpen` state setter (not a wrapped `onClose` closure)
 * because setState setters are referentially stable across renders — an
 * inline closure in the dependency array would tear the effect down and
 * re-run it (re-focusing the first element) on every render while open, not
 * just when `open` itself changes.
 */
export function useDialogBehavior(
  open: boolean,
  setOpen: (open: boolean) => void,
  panelRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea',
        ) ?? [],
      )
    focusables()[0]?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [open, setOpen, panelRef, triggerRef])
}
