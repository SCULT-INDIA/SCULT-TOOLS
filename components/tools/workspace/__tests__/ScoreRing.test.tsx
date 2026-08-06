import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreRing } from '../ScoreRing'

describe('ScoreRing', () => {
  it('renders without crashing and shows the numeric value', () => {
    render(<ScoreRing value={72} label="Visibility" />)
    expect(screen.getByText('72')).toBeInTheDocument()
    expect(screen.getByText('Visibility')).toBeInTheDocument()
  })

  it('derives the progress arc length from value/max', () => {
    render(<ScoreRing value={50} max={100} size="lg" />)
    const circles = screen.getByRole('img').querySelectorAll('circle')
    const progress = circles[1]
    if (!progress) throw new Error('expected a progress circle')
    const circumference = Number(progress.getAttribute('stroke-dasharray'))
    // Half of max should offset the arc by exactly half the circumference.
    expect(Number(progress.getAttribute('stroke-dashoffset'))).toBeCloseTo(
      circumference / 2,
      3,
    )
  })

  it('clamps a value above max to a full ring rather than overshooting', () => {
    render(<ScoreRing value={999} max={100} />)
    const circles = screen.getByRole('img').querySelectorAll('circle')
    const progress = circles[1]
    if (!progress) throw new Error('expected a progress circle')
    expect(Number(progress.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 3)
  })
})
