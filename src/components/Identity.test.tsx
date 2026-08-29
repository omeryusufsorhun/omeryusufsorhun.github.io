import { render, screen } from '@testing-library/react'
import { profile } from '../data/profile'
import Identity from './Identity'

describe('Identity', () => {
  it('renders the name as the level-one heading', () => {
    render(<Identity profile={profile} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ömer yusuf sorhun')
  })

  it('renders every profile link', () => {
    render(<Identity profile={profile} />)
    expect(screen.getByRole('link', { name: 'cv.pdf' })).toHaveAttribute('href', '/cv.pdf')
    expect(screen.getByRole('link', { name: 'github' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'linkedin' })).toBeInTheDocument()
  })

  it('does not name an employer in the identity block', () => {
    const { container } = render(<Identity profile={profile} />)
    expect(container.textContent?.toLowerCase()).not.toContain('insider')
  })
})
