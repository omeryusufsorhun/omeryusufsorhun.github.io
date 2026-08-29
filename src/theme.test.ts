import { applyTheme, readStoredTheme, THEME_KEY } from './theme'

describe('theme module', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to dark when nothing is stored', () => {
    expect(readStoredTheme()).toBe('dark')
  })

  it('returns the stored light choice', () => {
    window.localStorage.setItem(THEME_KEY, 'light')
    expect(readStoredTheme()).toBe('light')
  })

  it('falls back to dark for an unrecognised stored value', () => {
    window.localStorage.setItem(THEME_KEY, 'sepia')
    expect(readStoredTheme()).toBe('dark')
  })

  it('applies the theme to the document element and persists it', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light')
  })
})
