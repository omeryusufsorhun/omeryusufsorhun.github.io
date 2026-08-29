export type Theme = 'dark' | 'light'

export const THEME_KEY = 'theme'

// Always go through window.localStorage: Node 25 exposes its own bare
// `localStorage` global, which shadows the DOM one under test.
export function readStoredTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    // storage unavailable (private mode, blocked cookies) — the attribute still applies
  }
}
