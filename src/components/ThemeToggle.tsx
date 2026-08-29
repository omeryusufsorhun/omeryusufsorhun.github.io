import { useState } from 'react'
import { applyTheme, readStoredTheme, type Theme } from '../theme'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme())

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-pressed={theme === 'light'}
      aria-label="Switch colour theme"
    >
      [<span className={theme === 'dark' ? 'on' : ''}>dark</span>|
      <span className={theme === 'light' ? 'on' : ''}>light</span>]
    </button>
  )
}
