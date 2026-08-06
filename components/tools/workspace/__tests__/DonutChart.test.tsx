import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DonutChart } from '../DonutChart'

describe('DonutChart', () => {
  const segments = [
    { label: 'Images', value: 30 },
    { label: 'Scripts', value: 50 },
    { label: 'Other', value: 20 },
  ]

  it('renders without crashing and lists every segment in the legend', () => {
    render(<DonutChart segments={segments} />)
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('Scripts')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('reflects each segment value correctly in the legend, matching the input sum', () => {
    render(<DonutChart segments={segments} />)
    const shown = segments.map((s) =>
      Number(screen.getByText(String(s.value)).textContent),
    )
    expect(shown.reduce((a, b) => a + b, 0)).toBe(
      segments.reduce((a, b) => a + b.value, 0),
    )
  })

  it('renders the center label and value when provided', () => {
    render(
      <DonutChart segments={segments} centerLabel="Total size" centerValue="2.4 MB" />,
    )
    expect(screen.getByText('2.4 MB')).toBeInTheDocument()
    expect(screen.getByText('Total size')).toBeInTheDocument()
  })
})
