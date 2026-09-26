import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFormDraft } from './use-form-draft'

interface Form {
  readonly title: string
  readonly body: string
}

const INITIAL: Form = { title: '', body: '' }
const KEY = 'admin-draft:test:new'

function stored(): { value: Form; savedAt: number } | null {
  const raw = window.localStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : null
}

describe('useFormDraft', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.localStorage.clear()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('saves a changed form after the debounce, not on mount', () => {
    const restore = vi.fn()
    const { rerender } = renderHook(
      ({ value }: { value: Form }) =>
        useFormDraft('test:new', value, { initial: INITIAL, restore }),
      { initialProps: { value: INITIAL } },
    )
    act(() => vi.advanceTimersByTime(1000))
    expect(stored()).toBeNull()

    rerender({ value: { title: 'Half-written', body: '' } })
    expect(stored()).toBeNull() // still inside the debounce window
    act(() => vi.advanceTimersByTime(400))
    expect(stored()?.value).toEqual({ title: 'Half-written', body: '' })
    expect(restore).not.toHaveBeenCalled()
  })

  it('restores a saved draft on mount and reports when it was saved', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        value: { title: 'From before', body: 'refresh' },
        savedAt: 1_700_000_000_000,
      }),
    )
    const restore = vi.fn()
    const { result } = renderHook(() =>
      useFormDraft('test:new', INITIAL, { initial: INITIAL, restore }),
    )
    expect(restore).toHaveBeenCalledWith({ title: 'From before', body: 'refresh' })
    expect(result.current.restoredAt).toBe(1_700_000_000_000)
  })

  it('ignores a saved draft equal to the initial value and garbage entries', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ value: INITIAL, savedAt: 1 }))
    const restore = vi.fn()
    const first = renderHook(() =>
      useFormDraft('test:new', INITIAL, { initial: INITIAL, restore }),
    )
    expect(restore).not.toHaveBeenCalled()
    expect(first.result.current.restoredAt).toBeNull()
    first.unmount()

    window.localStorage.setItem(KEY, '{not json')
    renderHook(() => useFormDraft('test:new', INITIAL, { initial: INITIAL, restore }))
    expect(restore).not.toHaveBeenCalled()
  })

  it('removes the draft when the form goes back to its initial value', () => {
    const { rerender } = renderHook(
      ({ value }: { value: Form }) =>
        useFormDraft('test:new', value, { initial: INITIAL, restore: vi.fn() }),
      { initialProps: { value: INITIAL } },
    )
    rerender({ value: { title: 'x', body: '' } })
    act(() => vi.advanceTimersByTime(400))
    expect(stored()).not.toBeNull()
    rerender({ value: INITIAL })
    act(() => vi.advanceTimersByTime(400))
    expect(stored()).toBeNull()
  })

  it('clear() drops the draft and stops a pending save from bringing it back', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: Form }) =>
        useFormDraft('test:new', value, { initial: INITIAL, restore: vi.fn() }),
      { initialProps: { value: INITIAL } },
    )
    rerender({ value: { title: 'about to submit', body: '' } })
    act(() => vi.advanceTimersByTime(400))
    expect(stored()).not.toBeNull()

    rerender({ value: { title: 'about to submit!', body: '' } }) // schedules another save
    act(() => result.current.clear())
    act(() => vi.advanceTimersByTime(1000))
    expect(stored()).toBeNull()
  })

  it('discard() removes the draft and resets the form through restore', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ value: { title: 'old', body: '' }, savedAt: 5 }),
    )
    const restore = vi.fn()
    const { result } = renderHook(() =>
      useFormDraft('test:new', INITIAL, { initial: INITIAL, restore }),
    )
    expect(result.current.restoredAt).toBe(5)
    act(() => result.current.discard())
    expect(restore).toHaveBeenLastCalledWith(INITIAL)
    expect(result.current.restoredAt).toBeNull()
    expect(stored()).toBeNull()
  })

  it('flushes a dirty form synchronously on pagehide', () => {
    const { rerender } = renderHook(
      ({ value }: { value: Form }) =>
        useFormDraft('test:new', value, { initial: INITIAL, restore: vi.fn() }),
      { initialProps: { value: INITIAL } },
    )
    rerender({ value: { title: 'typed then refreshed at once', body: '' } })
    expect(stored()).toBeNull()
    act(() => {
      window.dispatchEvent(new Event('pagehide'))
    })
    expect(stored()?.value.title).toBe('typed then refreshed at once')
  })

  it('keeps drafts for different keys apart', () => {
    const { rerender } = renderHook(
      ({ value }: { value: Form }) =>
        useFormDraft('test:edit:42', value, { initial: INITIAL, restore: vi.fn() }),
      { initialProps: { value: INITIAL } },
    )
    rerender({ value: { title: 'edit', body: '' } })
    act(() => vi.advanceTimersByTime(400))
    expect(window.localStorage.getItem('admin-draft:test:edit:42')).not.toBeNull()
    expect(stored()).toBeNull()
  })
})
