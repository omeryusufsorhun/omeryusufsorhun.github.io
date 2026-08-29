import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the identity heading and the section nav', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ömer yusuf sorhun')
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument()
  })
})
