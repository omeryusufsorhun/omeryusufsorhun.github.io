import { render, screen } from '@testing-library/react'
import { stack } from '../data/stack'
import Stack from './Stack'

describe('Stack', () => {
  it('renders every group label', () => {
    render(<Stack groups={stack} />)
    for (const group of stack) {
      expect(screen.getByText(group.label)).toBeInTheDocument()
    }
  })

  it('renders each item as a list entry', () => {
    render(<Stack groups={stack} />)
    expect(screen.getByText('Selenium WebDriver')).toBeInTheDocument()
    expect(screen.getByText('Playwright')).toBeInTheDocument()
  })
})
