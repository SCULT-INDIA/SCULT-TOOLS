import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

type DL = IArguments[]
function searchEvents(): unknown[][] {
  const dl = (window as Window & { dataLayer?: DL }).dataLayer ?? []
  return dl.map((a) => Array.from(a)).filter((a) => a[1] === 'search')
}

beforeEach(() => {
  ;(window as Window & { dataLayer?: unknown[] }).dataLayer = []
  vi.resetModules()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('adversarial probe', () => {
  it('P1 premise: pending fetch + typed query => false has_results:false event', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    )
    const { SearchBox } = await import('./SearchBox')
    render(<SearchBox toolCount={15} promptCount={1170} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'qr code' } })
    await vi.advanceTimersByTimeAsync(900)
    console.log('P1 EVENTS:', JSON.stringify(searchEvents()))
    expect(searchEvents().length).toBe(1)
  })

  it('P2 hole: typing with NO focus/pointerenter never starts the fetch', async () => {
    const f = vi.fn(() => new Promise(() => {}))
    vi.stubGlobal('fetch', f)
    const { SearchBox } = await import('./SearchBox')
    render(<SearchBox toolCount={15} promptCount={1170} />)
    const input = screen.getByRole('combobox')
    // deliberately NO fireEvent.focus / pointerEnter
    fireEvent.change(input, { target: { value: 'qr code' } })
    await vi.advanceTimersByTimeAsync(900)
    console.log('P2 fetch calls:', f.mock.calls.length)
    console.log('P2 EVENTS:', JSON.stringify(searchEvents()))
    expect(f.mock.calls.length).toBe(0)
  })

  it('P3: loadSearchIndex RESOLVES with EMPTY on a rejected fetch (cannot signal error)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('offline'))),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { loadSearchIndex } = await import('@/lib/use-search-index')
    const r = await loadSearchIndex()
    console.log('P3 resolved value:', JSON.stringify(r))
    expect(r.toolEntries).toEqual([])
  })

  it('P4: loadSearchIndex RESOLVES with EMPTY on HTTP 500 too', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 500 } as Response)),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { loadSearchIndex } = await import('@/lib/use-search-index')
    const r = await loadSearchIndex()
    console.log('P4 resolved value:', JSON.stringify(r))
    expect(r.promptEntries).toEqual([])
  })

  it('P5: after a failed load, further interaction on the SAME box does not retry', async () => {
    const f = vi.fn(() => Promise.reject(new Error('offline')))
    vi.stubGlobal('fetch', f)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { SearchBox } = await import('./SearchBox')
    render(<SearchBox toolCount={15} promptCount={1170} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    await vi.advanceTimersByTimeAsync(50)
    fireEvent.pointerEnter(input)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'qr' } })
    await vi.advanceTimersByTimeAsync(900)
    console.log('P5 fetch calls:', f.mock.calls.length)
    console.log('P5 EVENTS:', JSON.stringify(searchEvents()))
    expect(f.mock.calls.length).toBe(1)
  })

  it('P6: happy path still fires has_results:false for a genuinely unmatched query', async () => {
    const payload = {
      c: ['Utilities'],
      i: ['Wrench'],
      t: ['green'],
      tools: [
        [
          'qr-code-generator',
          'QR Code Generator',
          0,
          0,
          ' qr code generator qr',
          'utilities',
          'Make QR codes',
        ],
      ],
      prompts: [],
      toolCount: 1,
      promptCount: 0,
    }
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(payload),
        } as unknown as Response),
      ),
    )
    const { SearchBox } = await import('./SearchBox')
    render(<SearchBox toolCount={1} promptCount={0} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    await vi.advanceTimersByTimeAsync(50)
    fireEvent.change(input, { target: { value: 'zzzzz' } })
    await vi.advanceTimersByTimeAsync(900)
    console.log('P6 EVENTS:', JSON.stringify(searchEvents()))
    expect(searchEvents().length).toBe(1)
  })
})
