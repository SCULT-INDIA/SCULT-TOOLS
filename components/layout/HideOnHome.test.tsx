import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HideOnHome } from './HideOnHome'

const pathname = vi.hoisted(() => ({ current: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))

describe('HideOnHome', () => {
  it('renders nothing on the homepage, where the hero assistant is the search', () => {
    pathname.current = '/'
    render(
      <HideOnHome>
        <input aria-label="Search" />
      </HideOnHome>,
    )
    expect(screen.queryByLabelText('Search')).toBeNull()
  })

  it.each(['/prompts', '/skills', '/seo/keyword-density', '/all'])(
    'renders its children on %s',
    (path) => {
      pathname.current = path
      render(
        <HideOnHome>
          <input aria-label="Search" />
        </HideOnHome>,
      )
      expect(screen.getByLabelText('Search')).toBeTruthy()
    },
  )
})
