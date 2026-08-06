import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepTimeline } from '../StepTimeline'

describe('StepTimeline', () => {
  const steps = [
    { label: 'Upload', status: 'done' as const },
    { label: 'Parse', status: 'active' as const },
    { label: 'Export', status: 'pending' as const },
  ]

  it('renders without crashing and shows every step label', () => {
    render(<StepTimeline steps={steps} />)
    expect(screen.getByText('Upload')).toBeInTheDocument()
    expect(screen.getByText('Parse')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('marks the active step with aria-current="step" and no other step', () => {
    render(<StepTimeline steps={steps} />)
    const current = screen.getAllByText('Parse')[0]
    expect(current).toBeInTheDocument()
    expect(screen.getAllByRole('list', { hidden: true })).toBeDefined()

    const dots = document.querySelectorAll('[data-status]')
    expect(dots).toHaveLength(3)
    const [done, active, pending] = dots
    if (!done || !active || !pending) throw new Error('expected three step dots')
    expect(done.getAttribute('data-status')).toBe('done')
    expect(active.getAttribute('data-status')).toBe('active')
    expect(active.getAttribute('aria-current')).toBe('step')
    expect(pending.getAttribute('data-status')).toBe('pending')
    expect(pending.hasAttribute('aria-current')).toBe(false)
  })
})
