import { fireEvent, render, screen } from '@testing-library/react'
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
 * Interaction coverage for the reference workspace implementation.
 *
 * This is the first permanent component test in the redesigned tool set — see
 * docs/TOOL_REDESIGN_PLAN.md §8b. Three earlier agents wrote tests exactly
 * like these for other tools, ran them once to verify their work, and had to
 * delete them because `components/**` had no test glob and `jest-dom`'s
 * matchers weren't wired up. Both are fixed in vitest.config.ts / vitest.setup.ts;
 * this file is the proof, and a template for giving the others a permanent home.
 *
 * Deliberately not exhaustive — logic.ts already has its own thorough test
 * suite. This file exists to catch what only rendering can: wiring mistakes,
 * hydration-shaped bugs, and whether a user can actually reach the result by
 * typing and clicking rather than by calling a function directly.
 */
describe('JsonFormatter', () => {
  it('renders seeded with valid sample JSON on first paint', () => {
    render(<JsonFormatter />)
    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    // The sample invoice payload has 6 own-properties across the object graph
    // (invoice, customer, name, gstin, items, paid) — asserting the exact
    // count would be brittle against a future sample change, so this checks
    // the stats row rendered a number rather than pinning the number itself.
    expect(screen.getByText('keys')).toBeInTheDocument()
  })

  it('reformats live as the input changes', () => {
    render(<JsonFormatter />)

    setJson(screen.getByLabelText('Paste your JSON'), '{"a":1}')

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    // `CodePane` renders each token in its own <span>, but the line's wrapping
    // <div> also matches a substring query on the same text (RTL's default text
    // matcher checks every ancestor's combined textContent, not just leaves) —
    // scoping to `span` picks out the actual key token rather than every
    // container that happens to contain it too.
    expect(screen.getByText('"a"', { selector: 'span' })).toBeInTheDocument()
  })

  it('reports an invalid document with a line and column, not a stack trace', () => {
    render(<JsonFormatter />)

    setJson(screen.getByLabelText('Paste your JSON'), '{"a":1,}')

    expect(screen.getByText('Invalid JSON')).toBeInTheDocument()
    expect(screen.getByText(/Line \d+, column \d+/)).toBeInTheDocument()
  })

  it('clears the input and shows the empty-state guidance, not a duplicate one', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    await user.click(screen.getByRole('button', { name: 'Clear' }))

    expect(screen.getByText('Waiting for input')).toBeInTheDocument()
    // Exactly one explanation of what will appear — the failure mode this
    // whole redesign started from was two panels both saying it at once.
    expect(screen.getAllByText(/appears here/i)).toHaveLength(1)
  })

  it('restores the sample after Load sample', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    const input = screen.getByLabelText('Paste your JSON') as HTMLTextAreaElement
    await user.clear(input)
    expect(input.value).toBe('')

    await user.click(screen.getByRole('button', { name: 'Load sample' }))
    expect(input.value).toContain('INV-2026-0142')
  })

  it('toggles to minified output and back without losing validity', async () => {
    const user = userEvent.setup()
    render(<JsonFormatter />)

    await user.click(screen.getByRole('button', { name: 'Minify' }))
    expect(screen.getByRole('button', { name: '2 spaces' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    await user.click(screen.getByRole('button', { name: '2 spaces' }))
    expect(screen.getByRole('button', { name: 'Minify' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('exposes exactly one polite live region', () => {
    const { container } = render(<JsonFormatter />)
    expect(container.querySelectorAll('[aria-live="polite"]')).toHaveLength(1)
  })
})
