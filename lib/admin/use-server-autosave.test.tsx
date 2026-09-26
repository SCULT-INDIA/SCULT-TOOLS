import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useServerAutosave } from './use-server-autosave'

interface Props {
  readonly payload: { title: string; body?: string }
  readonly enabled?: boolean
  readonly id?: string | null
}

const fetchMock = vi.fn()

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function setup(initial: Props, onCreated = vi.fn()) {
  return renderHook(
    ({ payload, enabled = true, id = null }: Props) =>
      useServerAutosave({
        enabled,
        ready: payload.title.trim() !== '',
        notReadyReason: 'Add a title.',
        payload,
        id,
        createUrl: '/api/admin/prompts',
        // Inline on purpose: callers do this, and it must not reset timers.
        updateUrl: (x) => `/api/admin/prompts/${x}`,
        onCreated,
      }),
    { initialProps: initial },
  )
}

/** Lets pending promise callbacks (fetch → json → state) run. */
async function settle() {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

describe('useServerAutosave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('waits for a title, then creates the draft once and updates it after', async () => {
    const onCreated = vi.fn()
    const { result, rerender } = setup({ payload: { title: '' } }, onCreated)
    expect(result.current.status).toEqual({ kind: 'waiting', reason: 'Add a title.' })

    fetchMock.mockResolvedValueOnce(jsonResponse(201, { id: 'd1', slug: 'x' }))
    rerender({ payload: { title: 'Draft one' } })
    expect(result.current.status.kind).toBe('pending')
    await act(async () => {
      vi.advanceTimersByTime(2500)
      await settle()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/admin/prompts')
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: 'POST' })
    expect(onCreated).toHaveBeenCalledWith('d1')
    expect(result.current.id).toBe('d1')
    expect(result.current.status.kind).toBe('saved')

    fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 'd1', slug: 'x' }))
    rerender({ payload: { title: 'Draft one', body: 'more' } })
    await act(async () => {
      vi.advanceTimersByTime(2500)
      await settle()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/api/admin/prompts/d1')
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({ method: 'PATCH' })
  })

  it('debounces: typing within the delay sends one request with the latest content', async () => {
    const { rerender } = setup({ payload: { title: 'a' } })
    fetchMock.mockResolvedValue(jsonResponse(201, { id: 'd1' }))
    for (const title of ['ab', 'abc', 'abcd']) {
      rerender({ payload: { title } })
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
    }
    expect(fetchMock).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(2500)
      await settle()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1].body)).toEqual({ title: 'abcd' })
  })

  it('never creates a second draft when a change lands while the first POST is in flight', async () => {
    let resolveFirst: (r: Response) => void = () => {}
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((r) => {
          resolveFirst = r
        }),
    )
    const { rerender, result } = setup({ payload: { title: 'one' } })
    await act(async () => {
      vi.advanceTimersByTime(2500)
    })
    rerender({ payload: { title: 'one, edited' } })
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 'd1' }))
    await act(async () => {
      vi.advanceTimersByTime(2500)
      await settle()
    })
    // Second save is queued behind the POST, not sent as another POST.
    expect(fetchMock).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolveFirst(jsonResponse(201, { id: 'd1' }))
      await settle()
      await settle()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls.map((c) => c[1].method)).toEqual(['POST', 'PATCH'])
    expect(result.current.id).toBe('d1')
  })

  it('sends nothing for an existing record until it actually changes', async () => {
    const { rerender } = setup({ payload: { title: 'Loaded' }, id: 'p9' })
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })
    rerender({ payload: { title: 'Loaded' }, id: 'p9' })
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does nothing when disabled (a live prompt)', async () => {
    const { result, rerender } = setup({ payload: { title: 'Live' }, enabled: false })
    rerender({ payload: { title: 'Live, edited' }, enabled: false })
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.status).toEqual({ kind: 'off' })
  })

  it('hands unsaved content to the browser with keepalive when the page is left', async () => {
    const { rerender } = setup({ payload: { title: 'Saved' }, id: 'p1' })
    rerender({ payload: { title: 'Typed, then closed the tab' }, id: 'p1' })
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 'p1' }))
    act(() => {
      window.dispatchEvent(new Event('pagehide'))
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/admin/prompts/p1')
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: 'PATCH',
      keepalive: true,
    })
  })

  it('reports a server error and an expired session in plain words', async () => {
    const { result, rerender } = setup({ payload: { title: 'x' } })
    fetchMock.mockResolvedValueOnce(
      jsonResponse(422, {
        errors: [{ field: 'category', message: 'Unknown category "zz".' }],
      }),
    )
    rerender({ payload: { title: 'xy' } })
    await act(async () => {
      vi.advanceTimersByTime(2500)
      await settle()
    })
    expect(result.current.status).toMatchObject({
      kind: 'error',
      message: 'Unknown category "zz".',
    })

    fetchMock.mockResolvedValueOnce(jsonResponse(401, { error: 'Not authenticated.' }))
    rerender({ payload: { title: 'xyz' } })
    await act(async () => {
      vi.advanceTimersByTime(2500)
      await settle()
    })
    expect(result.current.status).toMatchObject({ kind: 'error', unauthenticated: true })
  })

  it('flush() saves immediately and returns the id; refuses without a title', async () => {
    const { result, rerender } = setup({ payload: { title: '' } })
    expect(await result.current.flush()).toMatchObject({ ok: false })
    expect(fetchMock).not.toHaveBeenCalled()

    rerender({ payload: { title: 'Now' } })
    fetchMock.mockResolvedValueOnce(jsonResponse(201, { id: 'd7' }))
    let flushed: Awaited<ReturnType<typeof result.current.flush>> | undefined
    await act(async () => {
      flushed = await result.current.flush()
    })
    expect(flushed).toEqual({ ok: true, id: 'd7' })
    // The debounce timer that was also pending finds nothing new to send.
    await act(async () => {
      vi.advanceTimersByTime(5000)
      await settle()
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
