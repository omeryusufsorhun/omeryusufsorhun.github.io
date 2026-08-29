import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { THEME_KEY } from '../theme'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.dataset.theme = 'dark'
  })

  it('starts dark and reports it as not pressed', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches the document to light on click', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('persists the choice across a remount', async () => {
    const first = render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button'))
    first.unmount()
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light')

    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
})
