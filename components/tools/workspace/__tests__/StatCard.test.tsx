import { render, screen } from '@testing-library/react'
import { Zap } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { StatCard } from '../StatCard'

describe('StatCard', () => {
  it('renders without crashing and shows the passed value and label', () => {
    render(<StatCard icon={Zap} label="Load time" value="1.2s" />)
    expect(screen.getByText('1.2s')).toBeInTheDocument()
    expect(screen.getByText('Load time')).toBeInTheDocument()
  })

  it('renders the trend direction and value when provided', () => {
    render(
      <StatCard
        icon={Zap}
        label="Traffic"
        value={1024}
        trend={{ direction: 'up', value: '+12%' }}
      />,
    )
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  it('omits the trend indicator when no trend is passed', () => {
    render(<StatCard icon={Zap} label="Traffic" value={1024} />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })
})
