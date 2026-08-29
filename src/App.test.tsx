import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the owner name as the page heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /ömer yusuf sorhun/i }),
    ).toBeInTheDocument()
  })
})
