import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { JsonFormatter } from './JsonFormatter'

/**
 * `userEvent.type` parses `{` and `}` as the start of special-key syntax
 * (`{enter}`, `{backspace}`, …), so typing raw JSON through it needs every
 * brace escaped by doubling. `fireEvent.change` sets the controlled input's
 * value directly in one dispatch — the right tool whenever the content under
 * test is data, not literal keystrokes a user is expected to press.
 */
function setJson(input: HTMLElement, value: string): void {
  fireEvent.change(input, { target: { value } })
}

/**
 * Interaction coverage for the bespoke 4-column workspace — see
 * docs/TOOL_REDESIGN_PLAN.md §8b for why `components/**` has a test glob at
 * all. Rewritten alongside the tool itself: the previous version of this
 * file tested a two-pane input/output layout (a "Load sample" action, a
 * Minify toggle with `aria-pressed`, a `CodePane` output) that this redesign
 * replaces with a rail + editor + tree + inspector, so the old assertions
 * describe a UI that no longer exists rather than a regression.
 *
 * Deliberately not exhaustive — logic.ts already has its own thorough test
 * suite. This file exists to catch what only rendering can: wiring mistakes
 * and whether a user can actually reach the result by typing and clicking
 * rather than by calling a function directly.
 */
describe('JsonFormatter', () => {
  it('renders seeded with valid sample JSON on first paint', () => {
    render(<JsonFormatter />)
    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    // The sample invoice payload has 6 own-properties across the object graph
    // (invoice, customer, name, gstin, items, paid) — asserting the exact
    // count would be brittle against a future sample change, so this checks
    // the stats row rendered the unit label rather than pinning the number.
    expect(screen.getByText('keys')).toBeInTheDocument()
    // The tree shows the root and its top-level keys expanded by default.
    expect(screen.getByRole('treeitem', { name: /\$/ })).toBeInTheDocument()
    expect(screen.getByText('invoice', { selector: 'span' })).toBeInTheDocument()
  })

  it('reformats live as the input changes, and the tree follows it', () => {
    render(<JsonFormatter />)

    setJson(screen.getByLabelText('Paste your JSON'), '{"a":1}')

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    expect(screen.getByText('a', { selector: 'span' })).toBeInTheDocument()
  })

  it('reports an invalid document with a line and column, not a stack trace', () => {
    render(<JsonFormatter />)

    setJson(screen.getByLabelText('Paste your JSON'), '{"a":1,}')

    expect(screen.getByText('Invalid JSON')).toBeInTheDocument()
    expect(screen.getByText(/Line \d+, column \d+/)).toBeInTheDocument()
  })

  it('clears the input and shows one empty-state explanation, not several', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByText('Waiting for input')).toBeInTheDocument()
    expect(screen.getByText(/see its structure here/i)).toBeInTheDocument()
  })

  it('restores the sample after clicking Sample in the input rail', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    const input = screen.getByLabelText('Paste your JSON') as HTMLTextAreaElement
    await user.clear(input)
    expect(input.value).toBe('')

    await user.click(screen.getByRole('button', { name: 'Sample' }))
    expect(input.value).toContain('INV-2026-0142')
  })

  it('minifies the editor content in place, and Format restores indentation', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    const input = screen.getByLabelText('Paste your JSON') as HTMLTextAreaElement
    setJson(input, '{"a": 1,\n  "b": 2\n}')

    await user.click(screen.getByRole('button', { name: 'Minify' }))
    expect(input.value).toBe('{"a":1,"b":2}')

    await user.click(screen.getByRole('button', { name: 'Format' }))
    expect(input.value).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })

  it('repairs a trailing comma via the Repair tool', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    const input = screen.getByLabelText('Paste your JSON') as HTMLTextAreaElement
    setJson(input, '{"a": 1,}')
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Repair' }))

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    expect(JSON.parse(input.value)).toEqual({ a: 1 })
  })

  it('selecting a tree node fills in the inspector', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    await user.click(screen.getByText('invoice', { selector: 'span' }))

    const inspector = screen.getByRole('region', { name: 'Inspector' })
    expect(within(inspector).getByText('invoice')).toBeInTheDocument()
    expect(within(inspector).getByText('$.invoice')).toBeInTheDocument()
  })

  it('exposes exactly one polite live region', () => {
    const { container } = render(<JsonFormatter />)
    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1)
  })
})
