'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { readApiFailure } from './client-errors'

export type AutosaveStatus =
  | { readonly kind: 'off' }
  /** Not saveable yet (e.g. no title) — `reason` says what's missing. */
  | { readonly kind: 'waiting'; readonly reason: string }
  | { readonly kind: 'pending' }
  | { readonly kind: 'saving' }
  | { readonly kind: 'saved'; readonly at: number }
  | {
      readonly kind: 'error'
      readonly message: string
      readonly unauthenticated: boolean
    }

export type FlushResult =
  | { readonly ok: true; readonly id: string }
  | {
      readonly ok: false
      readonly errors: readonly { field: string; message: string }[]
      readonly unauthenticated: boolean
    }

/** Browsers cap a keepalive request body at 64KB; stay under it. */
const KEEPALIVE_MAX_BYTES = 60_000

function urlFor(
  o: { readonly createUrl: string; readonly updateUrl: (id: string) => string },
  currentId: string | null,
): string {
  return currentId ? o.updateUrl(currentId) : o.createUrl
}

/**
 * Saves a form to the server on its own — the admin never has to click
 * "Create draft" for the work to exist as a draft. The first save POSTs
 * (creating the record, whose id is reported through `onCreated`); every
 * later save PATCHes that id.
 *
 *   - Saves `delayMs` after the last change, once `ready` is true (the
 *     server needs at least a title); unchanged content is never re-sent.
 *   - One request at a time: a change made while a save is in flight is
 *     sent right after it, so the first POST can never be doubled into two
 *     drafts.
 *   - On `pagehide` (tab closed, navigated away, refreshed) unsaved content
 *     goes out as a `keepalive` request, which the browser completes even
 *     as the page unloads — "if I do nothing, it's still saved".
 *   - `flush()` saves immediately and resolves with the id — the explicit
 *     "Save & preview" button uses it, so it never races an autosave.
 *
 * The browser-side draft (useFormDraft) stays underneath this: it covers
 * the moments the server can't be reached or the form isn't saveable yet.
 */
export function useServerAutosave(options: {
  readonly enabled: boolean
  readonly ready: boolean
  readonly notReadyReason: string
  readonly payload: unknown
  readonly id: string | null
  readonly createUrl: string
  readonly updateUrl: (id: string) => string
  readonly onCreated?: (id: string) => void
  readonly onSaved?: (savedBody: string) => void
  readonly delayMs?: number
}): { status: AutosaveStatus; id: string | null; flush: () => Promise<FlushResult> } {
  const { enabled, ready, notReadyReason, payload, delayMs = 2500 } = options
  const serialized = JSON.stringify(payload)

  const [id, setId] = useState<string | null>(options.id)
  const [status, setStatus] = useState<AutosaveStatus>({ kind: 'off' })

  const idRef = useRef<string | null>(options.id)
  // What the server holds. For an existing record that is its loaded
  // content, so merely opening the editor sends nothing.
  const lastSaved = useRef<string | null>(options.id ? serialized : null)
  const latest = useRef({ serialized, enabled, ready })
  latest.current = { serialized, enabled, ready }
  const inFlight = useRef<Promise<FlushResult> | null>(null)
  // Callers pass inline functions; keeping them in a ref means `send` and
  // the effects below never change identity, so a re-render can't reset
  // the save timer (or loop through setStatus).
  const callbacks = useRef(options)
  callbacks.current = options

  const send = useCallback(async (): Promise<FlushResult> => {
    // Serialize: wait out any save in progress, then re-check for changes.
    while (inFlight.current) await inFlight.current
    const body = latest.current.serialized
    const currentId = idRef.current
    if (currentId && body === lastSaved.current) return { ok: true, id: currentId }

    const run = (async (): Promise<FlushResult> => {
      setStatus({ kind: 'saving' })
      let res: Response
      try {
        res = await fetch(urlFor(callbacks.current, currentId), {
          method: currentId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
      } catch {
        const message = 'Offline — kept in this browser; will retry on the next change.'
        setStatus({ kind: 'error', message, unauthenticated: false })
        return {
          ok: false,
          errors: [{ field: '(root)', message }],
          unauthenticated: false,
        }
      }
      if (!res.ok) {
        const { errors, unauthenticated } = await readApiFailure(res)
        setStatus({
          kind: 'error',
          message: unauthenticated
            ? 'Session expired — log in again to keep saving (your work is kept in this browser).'
            : errors.map((e) => e.message).join(' '),
          unauthenticated,
        })
        return { ok: false, errors, unauthenticated }
      }
      const saved = (await res.json().catch(() => ({}))) as { id?: string }
      const savedId = currentId ?? saved.id ?? null
      if (!savedId) {
        const message = 'The server saved the draft but did not return its id.'
        setStatus({ kind: 'error', message, unauthenticated: false })
        return {
          ok: false,
          errors: [{ field: '(root)', message }],
          unauthenticated: false,
        }
      }
      lastSaved.current = body
      if (!currentId) {
        idRef.current = savedId
        setId(savedId)
        callbacks.current.onCreated?.(savedId)
      }
      callbacks.current.onSaved?.(body)
      setStatus({ kind: 'saved', at: Date.now() })
      return { ok: true, id: savedId }
    })()
    inFlight.current = run
    try {
      return await run
    } finally {
      inFlight.current = null
    }
  }, [])

  // Debounced save after each change.
  useEffect(() => {
    if (!enabled) {
      setStatus({ kind: 'off' })
      return
    }
    if (!ready) {
      setStatus({ kind: 'waiting', reason: notReadyReason })
      return
    }
    if (serialized === lastSaved.current) return
    setStatus((s) =>
      s.kind === 'saving' || s.kind === 'pending' ? s : { kind: 'pending' },
    )
    const timer = setTimeout(() => {
      void send()
    }, delayMs)
    return () => clearTimeout(timer)
  }, [enabled, ready, notReadyReason, serialized, delayMs, send])

  // Leaving the page: hand unsaved content to the browser to finish.
  useEffect(() => {
    function onPageHide() {
      const { serialized: body, enabled: on, ready: ok } = latest.current
      if (!on || !ok || body === lastSaved.current) return
      const currentId = idRef.current
      // A first POST still in flight will create the record; a second one
      // here would create a duplicate. The browser draft covers this gap.
      if (!currentId && inFlight.current) return
      if (new Blob([body]).size > KEEPALIVE_MAX_BYTES) return
      try {
        void fetch(urlFor(callbacks.current, currentId), {
          method: currentId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        })
      } catch {
        // Unload-time best effort; useFormDraft still holds the content.
      }
    }
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [])

  const flush = useCallback(async (): Promise<FlushResult> => {
    if (!latest.current.ready) {
      return {
        ok: false,
        errors: [{ field: 'title', message: notReadyReason }],
        unauthenticated: false,
      }
    }
    return send()
  }, [notReadyReason, send])

  return { status, id, flush }
}
