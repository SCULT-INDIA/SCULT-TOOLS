import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSkillSearchHits } from './use-skill-search'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/** Advances fake time AND drains the microtask queue in between — plain
 * `advanceTimersByTime` only fires the macrotask (the debounce's
 * `setTimeout`); the `fetch().then()` chain it kicks off is a chain of
 * microtasks that need their own turn to run before assertions can see the
 * hook's post-fetch state. */
async function tick(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

describe('useSkillSearchHits', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('does not call the endpoint below the 2-character floor', async () => {
    const { result } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'a' },
    })
    await tick(1_000)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(result.current.hits).toEqual([])
  })

  it('debounces: only the last query in a fast-typing burst is fetched', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ results: [] }))
    const { rerender } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'te' },
    })
    rerender({ q: 'tes' })
    rerender({ q: 'test' })
    await tick(299)
    expect(fetchMock).not.toHaveBeenCalled()
    await tick(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toContain('q=test')
  })

  it('maps a successful response to SkillHit[], deriving icon/tile from the real category registry', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        results: [
          {
            slug: 'webapp-testing',
            name: 'webapp-testing',
            description: 'Run and debug a web app end to end.',
            category: 'testing',
          },
        ],
      }),
    )
    const { result } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'testing' },
    })
    await tick(300)
    expect(result.current.loading).toBe(false)
    expect(result.current.hits).toEqual([
      {
        kind: 'skill',
        slug: 'webapp-testing',
        category: 'testing',
        href: '/skills/testing/webapp-testing',
        name: 'webapp-testing',
        description: 'Run and debug a web app end to end.',
        categoryName: 'Testing',
        icon: 'TestTube',
        tile: 'green',
      },
    ])
  })

  it('drops a row whose category no longer exists rather than crashing', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        results: [
          { slug: 'x', name: 'x', description: 'd', category: 'not-a-real-category' },
        ],
      }),
    )
    const { result } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'xyz' },
    })
    await tick(300)
    expect(result.current.loading).toBe(false)
    expect(result.current.hits).toEqual([])
  })

  it('drops a malformed row (missing/wrong-typed fields) instead of crashing', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ results: [{ slug: 'x', name: 'x' }, 'not even an object', 42] }),
    )
    const { result } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'xyz' },
    })
    await tick(300)
    expect(result.current.loading).toBe(false)
    expect(result.current.hits).toEqual([])
  })

  it('resolves to empty, not a throw, on a network failure', async () => {
    fetchMock.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'testing' },
    })
    await tick(300)
    expect(result.current.loading).toBe(false)
    expect(result.current.hits).toEqual([])
  })

  it('resolves to empty on a non-OK response instead of throwing', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'rate limited' }, 429))
    const { result } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'testing' },
    })
    await tick(300)
    expect(result.current.loading).toBe(false)
    expect(result.current.hits).toEqual([])
  })

  it('clears hits immediately when the query drops back below the floor', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        results: [{ slug: 'x', name: 'x', description: 'd', category: 'testing' }],
      }),
    )
    const { result, rerender } = renderHook(({ q }) => useSkillSearchHits(q), {
      initialProps: { q: 'testing' },
    })
    await tick(300)
    expect(result.current.hits).toHaveLength(1)

    rerender({ q: '' })
    expect(result.current.hits).toEqual([])
    expect(result.current.loading).toBe(false)
  })
})
