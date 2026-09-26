import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PromptForm } from './PromptForm'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn(), replace: vi.fn() }),
}))

const fetchMock = vi.fn()
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/** Routes the form's requests: the custom-category lookup, then saves. */
function serve(saves: Response[]) {
  fetchMock.mockImplementation((url: string) => {
    if (url.startsWith('/api/admin/categories'))
      return Promise.resolve(json(200, { categories: [] }))
    const next = saves.shift()
    return next
      ? Promise.resolve(next)
      : Promise.reject(new Error(`unexpected request ${url}`))
  })
}
const saveCalls = () =>
  fetchMock.mock.calls.filter(([url]) => !String(url).startsWith('/api/admin/categories'))

async function settle() {
  for (let i = 0; i < 8; i++) await Promise.resolve()
}

describe('PromptForm — saving without a button', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false })
    window.localStorage.clear()
    fetchMock.mockReset()
    push.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    window.history.replaceState(null, '', '/admin/prompts/new')
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('creates a server draft on its own once a title is typed, then keeps it updated', async () => {
    serve([
      json(201, { id: 'd1', slug: 'my-idea' }),
      json(200, { id: 'd1', slug: 'my-idea' }),
    ])
    render(<PromptForm />)
    expect(screen.getByRole('status')).toHaveTextContent(/Add a title/)

    fireEvent.change(screen.getByLabelText('Prompt name'), {
      target: { value: 'My idea' },
    })
    await act(async () => {
      vi.advanceTimersByTime(2600)
      await settle()
    })
    const [first] = saveCalls()
    expect(first?.[0]).toBe('/api/admin/prompts')
    expect(first?.[1].method).toBe('POST')
    expect(JSON.parse(first?.[1].body)).toMatchObject({
      title: 'My idea',
      slug: 'my-idea',
    })
    expect(screen.getByRole('status')).toHaveTextContent(/Draft saved/)
    // A refresh now reopens this draft instead of a blank form.
    expect(window.location.pathname).toBe('/admin/prompts/d1')
    // The browser copy is dropped once the server has it.
    expect(window.localStorage.getItem('admin-draft:prompt:new')).toBeNull()

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Now with a description.' },
    })
    await act(async () => {
      vi.advanceTimersByTime(2600)
      await settle()
    })
    const second = saveCalls()[1]
    expect(second?.[0]).toBe('/api/admin/prompts/d1')
    expect(second?.[1].method).toBe('PATCH')
  })

  it('fills "Verified against" from the AI reply, dated today, replacing a blank row', async () => {
    serve([])
    render(<PromptForm />)
    fireEvent.click(screen.getByRole('button', { name: '+ Add' })) // a blank row
    fireEvent.change(
      screen.getByPlaceholderText('---TITLE--- … ---EXAMPLE_OUTPUT--- …'),
      {
        target: {
          value:
            '---TITLE---\nChase an invoice\n---PROMPT---\nYou are calm.\n---VERIFIED_AGAINST---\nClaude | Sonnet 5',
        },
      },
    )
    fireEvent.click(screen.getByRole('button', { name: 'Fill the form' }))

    const tools = screen.getAllByPlaceholderText('e.g. Claude') as HTMLInputElement[]
    const versions = screen.getAllByPlaceholderText('e.g. Sonnet 5') as HTMLInputElement[]
    expect(tools.map((t) => t.value)).toEqual(['Claude'])
    expect(versions.map((v) => v.value)).toEqual(['Sonnet 5'])
    const date = screen.getByDisplayValue(new Date().toISOString().slice(0, 10))
    expect(date).toBeInTheDocument()
    expect(screen.getByText(/Filled:.*verified against/)).toBeInTheDocument()
  })

  it('never auto-saves a published prompt — edits wait for "Save changes"', async () => {
    serve([])
    render(
      <PromptForm
        initial={{
          id: 'live1',
          status: 'published',
          slug: 'x',
          category: 'react',
          title: 'Live prompt',
          description: 'd',
          promptText: 'p',
          whyItWorks: 'w',
          variables: [],
          verifiedAgainst: [{ tool: 'Claude', version: 'Sonnet 5', date: '2026-09-01' }],
        }}
      />,
    )
    fireEvent.change(screen.getByLabelText('Prompt name'), {
      target: { value: 'Live, edited' },
    })
    await act(async () => {
      vi.advanceTimersByTime(10_000)
      await settle()
    })
    expect(saveCalls()).toHaveLength(0)
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument()
    expect(
      screen.getByText(/nothing changes on the site by accident/),
    ).toBeInTheDocument()
  })

  it('"Save & preview" saves immediately and opens the preview of that same draft', async () => {
    serve([json(201, { id: 'd9', slug: 'quick' })])
    render(<PromptForm />)
    fireEvent.change(screen.getByLabelText('Prompt name'), { target: { value: 'Quick' } })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save & preview' }))
      await settle()
    })
    expect(saveCalls()).toHaveLength(1)
    expect(push).toHaveBeenCalledWith('/admin-preview/prompts/d9')
    // The debounce that was also pending finds nothing new to send.
    await act(async () => {
      vi.advanceTimersByTime(5000)
      await settle()
    })
    expect(saveCalls()).toHaveLength(1)
  })
})
