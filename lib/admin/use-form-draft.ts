'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'admin-draft:'
const SAVE_DEBOUNCE_MS = 400

interface StoredDraft<T> {
  readonly value: T
  readonly savedAt: number
}

function storageKey(key: string): string {
  return `${PREFIX}${key}`
}

function readDraft<T>(key: string): StoredDraft<T> | null {
  try {
    const raw = window.localStorage.getItem(storageKey(key))
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredDraft<T>
    return typeof parsed?.savedAt === 'number' && 'value' in parsed ? parsed : null
  } catch {
    return null
  }
}

function writeDraft<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(
      storageKey(key),
      JSON.stringify({ value, savedAt: Date.now() } satisfies StoredDraft<T>),
    )
  } catch {
    // Quota exceeded or storage disabled — the form still works, it just
    // won't survive a refresh in this browser.
  }
}

function removeDraft(key: string): void {
  try {
    window.localStorage.removeItem(storageKey(key))
  } catch {
    // Same as above: best effort.
  }
}

/**
 * Keeps an admin form's state in the browser so a refresh, an accidental
 * back button, or a closed tab loses nothing (found live 2026-09-25: a
 * half-written prompt vanished on refresh). Everything the form holds is
 * plain JSON, so the whole snapshot is saved as one value under
 * `admin-draft:<key>`.
 *
 *   - Saves on every change, debounced, and flushes synchronously on
 *     `pagehide` so even "type then refresh within 400ms" is kept.
 *   - On the first render in the browser, if a saved draft exists and
 *     differs from `initial`, it is applied through `restore` and
 *     `restoredAt` is set so the form can show a "restored / discard" bar.
 *   - A value equal to `initial` removes the draft rather than storing an
 *     empty form.
 *   - `clear()` is for a successful create/save; `discard()` also resets
 *     the form back to `initial`.
 *
 * Files (a `.zip`, an image) cannot be stored this way — a form that has
 * one keeps everything else and tells the admin to re-select the file.
 */
export function useFormDraft<T>(
  key: string,
  value: T,
  options: { readonly initial: T; readonly restore: (draft: T) => void },
): {
  readonly restoredAt: number | null
  readonly dirty: boolean
  clear(): void
  discard(): void
} {
  const { initial, restore } = options
  const [restoredAt, setRestoredAt] = useState<number | null>(null)
  const serialized = JSON.stringify(value)
  const initialSerialized = JSON.stringify(initial)
  const dirty = serialized !== initialSerialized

  // Latest values for the unmount/pagehide flush, without re-subscribing.
  const latest = useRef({ serialized, dirty })
  latest.current = { serialized, dirty }
  // The restore callback is only ever needed on mount; keep the freshest.
  const restoreRef = useRef(restore)
  restoreRef.current = restore
  // Skip the first save effect — it would otherwise persist the just-
  // restored value with a new timestamp and hide the real "saved at".
  const mounted = useRef(false)
  // Set by clear(): a save already scheduled before the clear must not fire
  // and resurrect the draft the caller just removed.
  const cleared = useRef(false)

  useEffect(() => {
    const draft = readDraft<T>(key)
    if (draft && JSON.stringify(draft.value) !== initialSerialized) {
      restoreRef.current(draft.value)
      setRestoredAt(draft.savedAt)
    }
    mounted.current = true
  }, [key, initialSerialized])

  useEffect(() => {
    if (!mounted.current) return
    cleared.current = false
    const timer = setTimeout(() => {
      if (cleared.current) return
      if (dirty) writeDraft(key, JSON.parse(serialized))
      else removeDraft(key)
    }, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [key, serialized, dirty])

  useEffect(() => {
    function flush() {
      if (latest.current.dirty) writeDraft(key, JSON.parse(latest.current.serialized))
    }
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [key])

  const clear = useCallback(() => {
    removeDraft(key)
    setRestoredAt(null)
    // The caller is about to navigate away or reset: a pending debounced
    // save or the pagehide flush must not resurrect the draft just cleared.
    cleared.current = true
    latest.current = { serialized: initialSerialized, dirty: false }
  }, [key, initialSerialized])

  const discard = useCallback(() => {
    removeDraft(key)
    setRestoredAt(null)
    restoreRef.current(initial)
  }, [key, initial])

  return { restoredAt, dirty, clear, discard }
}
