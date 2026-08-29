# Terminal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scraped Bootstrap template at `omeryusufsorhun.github.io` with a purpose-built single-page React site in a neo-brutalist terminal idiom, deployed from `main` via GitHub Actions.

**Architecture:** One Vite-built React page, no router. All display copy lives in typed data modules under `src/data/`; notes come from `content/notes/*.md` read at build time via `import.meta.glob`. Theme is a `data-theme` attribute on `<html>` driven by CSS custom properties, applied by a synchronous `<head>` script before first paint so reloads never flash. Components are presentational and take data as props, which is what makes them testable without touching the glob or the network.

**Tech Stack:** React 19, Vite, TypeScript, Vitest + Testing Library + jsdom, Playwright (one smoke test), `marked` for markdown, `@emailjs/browser` for the contact form, GitHub Actions + `actions/deploy-pages`.

**Spec:** `docs/superpowers/specs/2026-08-29-portfolio-redesign-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Branch:** all work happens on `feat/terminal-redesign`. Never commit to `main`.
- **Language:** all site copy is English. No Turkish strings ship in the UI.
- **Dark is the default unconditionally.** `prefers-color-scheme` is never read.
- **Accent budget:** at most three accent-coloured elements per viewport. The accent is never a background fill, never a box, never a button face.
- **Zero border-radius, no box-shadow, no gradient** anywhere in the stylesheet.
- **One font family:** `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`. No webfont is downloaded.
- **Colour literals appear only in `src/styles/tokens.css`.** Every other file reads a CSS custom property.
- **Dark palette:** bg `#0B0B0B`, text `#C9C9C9`, heading `#FFFFFF`, rule `#232323`, muted `#5A5A5A`, accent `#00FF9C`.
- **Light palette:** bg `#FBFAF6`, text `#1A1A1A`, heading `#000000`, rule `#DEDCD2`, muted `#8A8A82`, accent `#1A47FF`.
- **Vite `base` is `/`** — this is a GitHub Pages *user site* served from the domain root.
- **No display copy inlined in JSX.** Text comes from `src/data/*`.
- **Badiworks is never listed** as an employer. The 2022 row is `sarjagi.com` only.
- **The phone number and the hotmail address never appear** in shipped markup.
- Proofread every string copied out of the CV: PDF extraction dropped `fi`/`ffi` ligatures, so "Conuence" → "Confluence", "notications" → "notifications", "trac" → "traffic", "kick-o" → "kick-off", "ows" → "flows", "x verication" → "fix verification".

---

### Task 1: Scaffold the Vite project and remove the old site

Replaces the HTTrack template with a working, tested, buildable React app. Vite requires `index.html` at the project root, which is exactly where the old site's `index.html` sits, so the removal and the scaffold are one indivisible change.

**Files:**
- Delete: `index.html` (old scraped page), `app/` (entire directory), `README.md` (rewritten below)
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vitest.setup.ts`, `public/.nojekyll`, `public/cv.pdf`, `README.md`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `App` — default export, `() => JSX.Element`, rendered into `#root`. Test command `npm test`. Build command `npm run build` emitting to `dist/`.

- [ ] **Step 1: Remove the old site and initialise the package**

The old files are recoverable from git history on `main`; deleting them is what frees the root `index.html` path for Vite.

```bash
cd ~/Documents/omeryusufsorhun.github.io
git rm -r -q index.html app README.md
npm init -y
```

- [ ] **Step 2: Install dependencies**

Install at `@latest` rather than pinning invented version numbers; record whatever npm resolves in the commit.

```bash
npm install react@latest react-dom@latest marked@latest @emailjs/browser@latest
npm install -D vite@latest @vitejs/plugin-react@latest typescript@latest \
  @types/react@latest @types/react-dom@latest \
  vitest@latest jsdom@latest \
  @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest
```

- [ ] **Step 3: Write the config files**

`package.json` — replace the `scripts` and `type` fields npm generated, leave `dependencies`/`devDependencies` as installed:

```json
{
  "name": "omeryusufsorhun-github-io",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/vitest.setup.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["vite.config.ts"]
}
```

`src/vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Write the root HTML**

`index.html` — the inline script is what prevents the wrong-theme flash; it must stay synchronous and must stay above the app bundle.

```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ömer Yusuf Sorhun — Software QA Engineer</title>
    <script>
      (function () {
        try {
          var stored = localStorage.getItem('theme')
          document.documentElement.dataset.theme = stored === 'light' ? 'light' : 'dark'
        } catch (e) {
          document.documentElement.dataset.theme = 'dark'
        }
      })()
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write the failing test**

`src/App.test.tsx`:

```tsx
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
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./App`.

- [ ] **Step 7: Write the minimal implementation**

`src/App.tsx`:

```tsx
export default function App() {
  return <h1>Ömer Yusuf Sorhun</h1>
}
```

`src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 1 test.

- [ ] **Step 9: Add the static assets**

`.nojekyll` stops GitHub Pages running the output through Jekyll, which would drop any path starting with an underscore.

```bash
touch public/.nojekyll
cp ~/Downloads/cv_omeryusufsorhun.pdf public/cv.pdf
```

- [ ] **Step 10: Write the README**

`README.md`:

```markdown
# omeryusufsorhun.github.io

Personal site of Ömer Yusuf Sorhun — Software QA Engineer.

React + Vite + TypeScript, deployed to GitHub Pages from `main` by GitHub Actions.

## Commands

    npm install     install dependencies
    npm run dev     local dev server
    npm test        unit tests (Vitest)
    npm run build   production build into dist/
    npm run preview serve the production build locally

## Editing content

- Experience, stack and profile data: `src/data/`
- Notes: drop a markdown file into `content/notes/`
- CV: replace `public/cv.pdf`
```

- [ ] **Step 11: Verify the build works**

Run: `npm run build`
Expected: exit 0, `dist/index.html` exists.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Replace scraped template with Vite + React scaffold"
```

---

### Task 2: Design tokens and base stylesheet

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`
- Modify: `src/main.tsx`
- Test: `src/styles/tokens.test.ts`

**Interfaces:**
- Consumes: `App` from Task 1.
- Produces: CSS custom properties `--bg`, `--text`, `--heading`, `--rule`, `--muted`, `--accent`, `--font-mono`, resolved per `html[data-theme]`. Every later component reads these and never a colour literal.

- [ ] **Step 1: Write the failing test**

This test guards the Global Constraints palette as data — it is what stops a future edit from silently drifting the colours.

`src/styles/tokens.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8')

const DARK = {
  '--bg': '#0B0B0B',
  '--text': '#C9C9C9',
  '--heading': '#FFFFFF',
  '--rule': '#232323',
  '--muted': '#5A5A5A',
  '--accent': '#00FF9C',
}

const LIGHT = {
  '--bg': '#FBFAF6',
  '--text': '#1A1A1A',
  '--heading': '#000000',
  '--rule': '#DEDCD2',
  '--muted': '#8A8A82',
  '--accent': '#1A47FF',
}

function block(selector: string): string {
  const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))
  if (!match) throw new Error(`missing block: ${selector}`)
  return match[1]
}

describe('design tokens', () => {
  it('defines the dark palette on the default root', () => {
    const dark = block('html\\[data-theme=.dark.\\]')
    for (const [name, value] of Object.entries(DARK)) {
      expect(dark).toContain(`${name}: ${value}`)
    }
  })

  it('defines the light palette', () => {
    const light = block('html\\[data-theme=.light.\\]')
    for (const [name, value] of Object.entries(LIGHT)) {
      expect(light).toContain(`${name}: ${value}`)
    }
  })

  it('never reads prefers-color-scheme', () => {
    expect(css).not.toContain('prefers-color-scheme')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tokens`
Expected: FAIL — `tokens.css` does not exist.

- [ ] **Step 3: Write the token stylesheet**

`src/styles/tokens.css`:

```css
html[data-theme='dark'] {
  --bg: #0B0B0B;
  --text: #C9C9C9;
  --heading: #FFFFFF;
  --rule: #232323;
  --muted: #5A5A5A;
  --accent: #00FF9C;
}

html[data-theme='light'] {
  --bg: #FBFAF6;
  --text: #1A1A1A;
  --heading: #000000;
  --rule: #DEDCD2;
  --muted: #8A8A82;
  --accent: #1A47FF;
}

:root {
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
  --measure: 760px;
  --step: 8px;
}
```

- [ ] **Step 4: Write the base stylesheet**

`src/styles/base.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  border-radius: 0;
}

html {
  background: var(--bg);
}

body {
  margin: 0;
  padding: 0 calc(var(--step) * 3);
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

main {
  max-width: var(--measure);
  margin: 0 auto;
  padding-bottom: calc(var(--step) * 10);
}

h1, h2, h3 {
  color: var(--heading);
  font-weight: 400;
  letter-spacing: -0.025em;
}

a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
}

a:hover {
  border-bottom-color: var(--accent);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

hr {
  border: 0;
  border-top: 1px solid var(--rule);
  margin: calc(var(--step) * 4) 0 0;
}

.label {
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Import the stylesheets**

`src/main.tsx` — add above the `App` import:

```tsx
import './styles/tokens.css'
import './styles/base.css'
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 4 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add design tokens and base stylesheet"
```

---

### Task 3: Theme switch

**Files:**
- Create: `src/theme.ts`, `src/theme.test.ts`, `src/components/ThemeToggle.tsx`, `src/components/ThemeToggle.test.tsx`, `src/components/ThemeToggle.css`

**Interfaces:**
- Consumes: tokens from Task 2.
- Produces:
  - `type Theme = 'dark' | 'light'`
  - `THEME_KEY: 'theme'`
  - `readStoredTheme(): Theme` — returns `'dark'` when storage is empty, unreadable, or holds anything other than `'light'`
  - `applyTheme(theme: Theme): void` — sets `document.documentElement.dataset.theme` and writes storage, swallowing storage errors
  - `ThemeToggle` — default export, `() => JSX.Element`, a `<button>` with `aria-pressed` true when light is active

- [ ] **Step 1: Write the failing test for the theme module**

`src/theme.test.ts`:

```ts
import { applyTheme, readStoredTheme, THEME_KEY } from './theme'

describe('theme module', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to dark when nothing is stored', () => {
    expect(readStoredTheme()).toBe('dark')
  })

  it('returns the stored light choice', () => {
    localStorage.setItem(THEME_KEY, 'light')
    expect(readStoredTheme()).toBe('light')
  })

  it('falls back to dark for an unrecognised stored value', () => {
    localStorage.setItem(THEME_KEY, 'sepia')
    expect(readStoredTheme()).toBe('dark')
  })

  it('applies the theme to the document element and persists it', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_KEY)).toBe('light')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- theme`
Expected: FAIL — cannot resolve `./theme`.

- [ ] **Step 3: Write the theme module**

`src/theme.ts`:

```ts
export type Theme = 'dark' | 'light'

export const THEME_KEY = 'theme'

export function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // storage unavailable (private mode, blocked cookies) — the attribute still applies
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- theme`
Expected: PASS — 4 tests.

- [ ] **Step 5: Write the failing test for the toggle**

`src/components/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { THEME_KEY } from '../theme'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
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
    expect(localStorage.getItem(THEME_KEY)).toBe('light')

    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- ThemeToggle`
Expected: FAIL — cannot resolve `./ThemeToggle`.

- [ ] **Step 7: Write the toggle component**

`src/components/ThemeToggle.tsx`:

```tsx
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
```

`src/components/ThemeToggle.css`:

```css
.theme-toggle {
  background: none;
  border: 0;
  padding: 0;
  color: var(--muted);
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.theme-toggle .on {
  color: var(--accent);
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add theme switch with dark default and persistence"
```

---

### Task 4: Profile data, top bar and identity block

**Files:**
- Create: `src/data/profile.ts`, `src/components/TopBar.tsx`, `src/components/TopBar.css`, `src/components/Identity.tsx`, `src/components/Identity.css`, `src/components/Identity.test.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` from Task 3.
- Produces:
  - `profile: { name: string; role: string; location: string; summary: string; links: { label: string; href: string }[] }`
  - `TopBar` — default export, `() => JSX.Element`, renders `<nav>` plus `ThemeToggle`
  - `Identity` — default export, `({ profile }: { profile: Profile }) => JSX.Element`, renders the `<h1>`

- [ ] **Step 1: Write the profile data**

`src/data/profile.ts` — the summary is a compressed rewrite of the CV's professional summary; the employer name is deliberately absent here and appears only in the experience table.

```ts
export interface ProfileLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  role: string
  location: string
  summary: string
  links: ProfileLink[]
}

export const profile: Profile = {
  name: 'ömer yusuf sorhun',
  role: 'software qa engineer',
  location: 'istanbul',
  summary:
    'I test software. My job is finding what is broken, proving it is broken, and pinning it down with a test so it stays fixed.',
  links: [
    { label: 'cv.pdf', href: '/cv.pdf' },
    { label: 'github', href: 'https://github.com/omeryusufsorhun' },
    { label: 'linkedin', href: 'https://linkedin.com/in/omeryusufsorhun' },
  ],
}
```

- [ ] **Step 2: Write the failing test**

`src/components/Identity.test.tsx`:

```tsx
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- Identity`
Expected: FAIL — cannot resolve `./Identity`.

- [ ] **Step 4: Write the identity component**

`src/components/Identity.tsx`:

```tsx
import type { Profile } from '../data/profile'
import './Identity.css'

export default function Identity({ profile }: { profile: Profile }) {
  return (
    <header className="identity">
      <h1>
        {profile.name}
        <span className="caret" aria-hidden="true" />
      </h1>
      <p className="identity-role">
        {profile.role} · {profile.location}
      </p>
      <p className="identity-summary">{profile.summary}</p>
      <p className="identity-links">
        {profile.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </p>
    </header>
  )
}
```

`src/components/Identity.css`:

```css
.identity {
  padding: calc(var(--step) * 6) 0 calc(var(--step) * 2);
}

.identity h1 {
  margin: 0;
  font-size: 31px;
  line-height: 1.05;
}

.caret {
  display: inline-block;
  width: 12px;
  height: 22px;
  margin-left: 4px;
  vertical-align: -4px;
  background: var(--accent);
}

.identity-role {
  margin: calc(var(--step)) 0 0;
  color: var(--muted);
}

.identity-summary {
  max-width: 62ch;
  margin: calc(var(--step) * 2) 0 0;
}

.identity-links {
  margin: calc(var(--step) * 2) 0 0;
}

.identity-links a {
  margin-right: calc(var(--step) * 2);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- Identity`
Expected: PASS — 3 tests.

- [ ] **Step 6: Write the top bar**

`src/components/TopBar.tsx`:

```tsx
import ThemeToggle from './ThemeToggle'
import './TopBar.css'

const SECTIONS = ['experience', 'stack', 'notes', 'contact']

export default function TopBar() {
  return (
    <div className="topbar">
      <span className="topbar-host">omeryusufsorhun.github.io</span>
      <nav aria-label="Sections">
        {SECTIONS.map((id) => (
          <a key={id} href={`#${id}`}>
            {id}
          </a>
        ))}
      </nav>
      <ThemeToggle />
    </div>
  )
}
```

`src/components/TopBar.css`:

```css
.topbar {
  display: flex;
  gap: calc(var(--step) * 2);
  align-items: center;
  max-width: var(--measure);
  margin: 0 auto;
  padding: calc(var(--step) * 1.5) 0;
  border-bottom: 1px solid var(--rule);
  font-size: 10px;
}

.topbar-host {
  color: var(--muted);
}

.topbar nav {
  display: flex;
  gap: calc(var(--step) * 2);
  margin-left: auto;
}

.topbar nav a {
  border-bottom: 0;
  color: var(--muted);
}

.topbar nav a:hover {
  color: var(--text);
}
```

- [ ] **Step 7: Wire both into the app**

`src/App.tsx`:

```tsx
import Identity from './components/Identity'
import TopBar from './components/TopBar'
import { profile } from './data/profile'

export default function App() {
  return (
    <>
      <TopBar />
      <main>
        <Identity profile={profile} />
      </main>
    </>
  )
}
```

`src/App.test.tsx` — replace the file so the app-level test asserts composition rather than duplicating Identity's assertions:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the identity heading and the section nav', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ömer yusuf sorhun')
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add profile data, top bar and identity block"
```

---

### Task 5: Experience table

**Files:**
- Create: `src/data/experience.ts`, `src/data/experience.test.ts`, `src/components/Experience.tsx`, `src/components/Experience.css`, `src/components/Experience.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `App` from Task 4.
- Produces:
  - `interface Role { org: string; role: string; start: string; end: string | null; detail: string; tech: string }` where `start`/`end` are `'YYYY-MM'` and `end: null` means present
  - `roles: Role[]`
  - `sortRoles(input: Role[]): Role[]` — returns a new array, most recent `start` first
  - `education: { school: string; degree: string; start: string; end: string; note: string }`
  - `Experience` — default export, `({ roles, education }: { roles: Role[]; education: Education }) => JSX.Element`

- [ ] **Step 1: Write the failing test for the data module**

`src/data/experience.test.ts`:

```ts
import { education, roles, sortRoles } from './experience'

describe('experience data', () => {
  it('sorts roles most recent first', () => {
    const sorted = sortRoles([
      { org: 'old', role: 'r', start: '2022-08', end: '2022-12', detail: '', tech: '' },
      { org: 'new', role: 'r', start: '2026-03', end: null, detail: '', tech: '' },
      { org: 'mid', role: 'r', start: '2023-07', end: '2026-02', detail: '', tech: '' },
    ])
    expect(sorted.map((r) => r.org)).toEqual(['new', 'mid', 'old'])
  })

  it('does not mutate its input', () => {
    const input = [
      { org: 'a', role: 'r', start: '2022-01', end: null, detail: '', tech: '' },
      { org: 'b', role: 'r', start: '2026-01', end: null, detail: '', tech: '' },
    ]
    sortRoles(input)
    expect(input.map((r) => r.org)).toEqual(['a', 'b'])
  })

  it('lists the current role first with no end date', () => {
    const [current] = sortRoles(roles)
    expect(current.org).toBe('Insider')
    expect(current.end).toBeNull()
  })

  it('never lists badiworks as an employer', () => {
    const orgs = roles.map((r) => r.org.toLowerCase()).join(' ')
    expect(orgs).not.toContain('badiworks')
  })

  it('records the education entry', () => {
    expect(education.school).toContain('Istanbul University')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- experience`
Expected: FAIL — cannot resolve `./experience`.

- [ ] **Step 3: Write the experience data**

`src/data/experience.ts` — copy verbatim; the ligature repairs from Global Constraints are already applied here.

```ts
export interface Role {
  org: string
  role: string
  start: string
  end: string | null
  detail: string
  tech: string
}

export interface Education {
  school: string
  degree: string
  start: string
  end: string
  note: string
}

export const roles: Role[] = [
  {
    org: 'Insider',
    role: 'Software QA Engineer',
    start: '2026-03',
    end: null,
    detail:
      'Automated test suites for a multi-tenant B2B SaaS engagement platform in Python and Selenium WebDriver, covering onsite analytics, web push and campaign management. End-to-end testing of attribution and conversion flows across event-driven data pipelines, on isolated staging environments with namespace-based routing.',
    tech: 'Python, Selenium WebDriver, BrowserStack, Git, GitLab, JIRA, Confluence',
  },
  {
    org: 'Trendyol',
    role: 'Software Developer in Test',
    start: '2023-07',
    end: '2026-02',
    detail:
      'Automated tests across every level of the testing pyramid in Java, JavaScript and Python, wired into CI/CD. BDD with Cucumber and Gherkin, contract tests for .NET and Go services, and load testing for high-traffic campaign periods.',
    tech: 'Java, JavaScript, Python, Cucumber, Cypress, Selenium, Playwright, JMeter, Pact, TestNG, Grafana, Allure',
  },
  {
    org: 'kolayfirsat.com',
    role: 'Manual Tester',
    start: '2023-01',
    end: '2023-06',
    detail:
      'Functional and API testing for a cross-platform Flutter application on iOS, Android and web; UAT across platforms.',
    tech: 'Flutter, Dart, Postman, JIRA',
  },
  {
    org: 'sarjagi.com',
    role: 'Front-End Developer',
    start: '2022-08',
    end: '2022-12',
    detail:
      'Frontend pages in JavaScript and Svelte.js with a Node.js backend and Mongoose schemas; web scraping, bug fixing and UX work in an Agile team.',
    tech: 'JavaScript, Svelte.js, Node.js, MongoDB',
  },
]

export const education: Education = {
  school: 'Istanbul University-Cerrahpaşa',
  degree: 'BSc Computer Engineering',
  start: '2019',
  end: '2023',
  note: 'Cyber-security internship at istecenter; member of the cyber-security and computer clubs.',
}

export function sortRoles(input: Role[]): Role[] {
  return [...input].sort((a, b) => b.start.localeCompare(a.start))
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- experience`
Expected: PASS — 5 tests.

- [ ] **Step 5: Write the failing test for the component**

`src/components/Experience.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { education, roles } from '../data/experience'
import Experience from './Experience'

describe('Experience', () => {
  it('renders one row per role, most recent first', () => {
    render(<Experience roles={roles} education={education} />)
    const table = screen.getByRole('table', { name: /experience/i })
    const rows = within(table).getAllByRole('row')
    expect(within(rows[0]).getByText('Insider')).toBeInTheDocument()
  })

  it('renders the current role with a present marker instead of an end date', () => {
    render(<Experience roles={roles} education={education} />)
    expect(screen.getByText('2026.03 —')).toBeInTheDocument()
  })

  it('closes the table with the education row', () => {
    render(<Experience roles={roles} education={education} />)
    expect(screen.getByText(/BSc Computer Engineering/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- Experience`
Expected: FAIL — cannot resolve `./Experience`.

- [ ] **Step 7: Write the component**

`src/components/Experience.tsx`:

```tsx
import type { Education, Role } from '../data/experience'
import { sortRoles } from '../data/experience'
import './Experience.css'

function period(role: Role): string {
  const start = role.start.replace('-', '.')
  if (role.end === null) return `${start} —`
  return `${start} – ${role.end.replace('-', '.')}`
}

export default function Experience({
  roles,
  education,
}: {
  roles: Role[]
  education: Education
}) {
  return (
    <section id="experience" className="section">
      <h2 className="label">experience</h2>
      <table className="experience">
        <caption className="visually-hidden">Experience</caption>
        <tbody>
          {sortRoles(roles).map((role) => (
            <tr key={role.org}>
              <td className="period">{period(role)}</td>
              <td className="org">
                {role.org}
                <span className="role">{role.role}</span>
              </td>
              <td className="detail">
                {role.detail}
                <span className="tech">{role.tech}</span>
              </td>
            </tr>
          ))}
          <tr>
            <td className="period">
              {education.start} – {education.end}
            </td>
            <td className="org">
              {education.school}
              <span className="role">{education.degree}</span>
            </td>
            <td className="detail">{education.note}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
```

`src/components/Experience.css`:

```css
.section {
  padding-top: calc(var(--step) * 4);
}

.section > .label {
  margin: 0 0 calc(var(--step));
  padding-top: calc(var(--step) * 2);
  border-top: 1px solid var(--rule);
}

.experience {
  width: 100%;
  border-collapse: collapse;
}

.experience td {
  padding: calc(var(--step)) 0;
  border-top: 1px solid var(--rule);
  vertical-align: top;
}

.experience tr:first-child td {
  border-top: 0;
}

.period {
  width: 96px;
  color: var(--muted);
}

.org {
  width: 140px;
  color: var(--heading);
}

.role,
.tech {
  display: block;
  color: var(--muted);
  font-size: 10px;
}

.tech {
  margin-top: calc(var(--step) * 0.5);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 640px) {
  .experience td {
    display: block;
    width: auto;
    border-top: 0;
    padding: 0;
  }
  .experience tr {
    display: block;
    padding: calc(var(--step) * 1.5) 0;
    border-top: 1px solid var(--rule);
  }
}
```

- [ ] **Step 8: Add the section to the app**

`src/App.tsx` — add the import and render it inside `<main>` below `<Identity />`:

```tsx
import Experience from './components/Experience'
import { education, roles } from './data/experience'
```

```tsx
<Experience roles={roles} education={education} />
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Add experience table with education row"
```

---

### Task 6: Stack section

**Files:**
- Create: `src/data/stack.ts`, `src/components/Stack.tsx`, `src/components/Stack.css`, `src/components/Stack.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: the `.section` and `.label` styles from Task 5.
- Produces:
  - `interface StackGroup { label: string; items: string[] }`
  - `stack: StackGroup[]`
  - `Stack` — default export, `({ groups }: { groups: StackGroup[] }) => JSX.Element`

- [ ] **Step 1: Write the failing test**

`src/components/Stack.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Stack`
Expected: FAIL — cannot resolve `../data/stack`.

- [ ] **Step 3: Write the stack data**

`src/data/stack.ts`:

```ts
export interface StackGroup {
  label: string
  items: string[]
}

export const stack: StackGroup[] = [
  {
    label: 'languages',
    items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'Dart', 'Golang', 'C#'],
  },
  {
    label: 'test',
    items: [
      'Selenium WebDriver',
      'Playwright',
      'Cypress',
      'Appium',
      'Cucumber',
      'Gherkin',
      'TestNG',
      'JUnit',
      'JMeter',
      'Pact',
      'BrowserStack',
    ],
  },
  {
    label: 'ci & tooling',
    items: [
      'Git',
      'GitLab CI/CD',
      'Maven',
      'Allure',
      'Grafana',
      'Postman',
      'Swagger',
      'JIRA',
      'Confluence',
    ],
  },
  {
    label: 'web & data',
    items: [
      'React',
      'Vue',
      'Svelte.js',
      'Node.js',
      'Flutter',
      'Tailwind CSS',
      'MongoDB',
      'BigQuery',
      'Neo4j',
    ],
  },
]
```

- [ ] **Step 4: Write the component**

`src/components/Stack.tsx`:

```tsx
import type { StackGroup } from '../data/stack'
import './Stack.css'

export default function Stack({ groups }: { groups: StackGroup[] }) {
  return (
    <section id="stack" className="section">
      <h2 className="label">stack</h2>
      <dl className="stack">
        {groups.map((group) => (
          <div className="stack-group" key={group.label}>
            <dt>{group.label}</dt>
            <dd>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

`src/components/Stack.css`:

```css
.stack {
  margin: 0;
}

.stack-group {
  display: flex;
  gap: calc(var(--step) * 2);
  padding: calc(var(--step)) 0;
  border-top: 1px solid var(--rule);
}

.stack-group:first-child {
  border-top: 0;
}

.stack dt {
  flex: 0 0 96px;
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stack dd {
  margin: 0;
}

.stack ul {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--step) * 0.5) calc(var(--step) * 2);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 640px) {
  .stack-group {
    display: block;
  }
  .stack dt {
    margin-bottom: calc(var(--step) * 0.5);
  }
}
```

- [ ] **Step 5: Add the section to the app**

`src/App.tsx` — import and render below `<Experience />`:

```tsx
import Stack from './components/Stack'
import { stack } from './data/stack'
```

```tsx
<Stack groups={stack} />
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add stack section"
```

---

### Task 7: Notes from markdown, hidden when empty

**Files:**
- Create: `src/notes.ts`, `src/notes.test.ts`, `src/components/Notes.tsx`, `src/components/Notes.css`, `src/components/Notes.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: the `.section` styles from Task 5.
- Produces:
  - `interface Note { slug: string; title: string; date: string; html: string }`
  - `parseNote(slug: string, raw: string): Note` — reads `---` frontmatter with `title:` and `date:` keys, renders the body with `marked`
  - `loadNotes(): Note[]` — reads `content/notes/*.md` via `import.meta.glob`, newest first
  - `Notes` — default export, `({ notes }: { notes: Note[] }) => JSX.Element | null`, returns `null` for an empty list

- [ ] **Step 1: Write the failing test for parsing**

`src/notes.test.ts`:

```ts
import { parseNote, sortNotes } from './notes'

const RAW = `---
title: Flaky by design
date: 2026-09-01
---

A note about **retry loops**.
`

describe('parseNote', () => {
  it('reads the title and date out of the frontmatter', () => {
    const note = parseNote('flaky-by-design', RAW)
    expect(note.title).toBe('Flaky by design')
    expect(note.date).toBe('2026-09-01')
    expect(note.slug).toBe('flaky-by-design')
  })

  it('renders the body as html', () => {
    const note = parseNote('flaky-by-design', RAW)
    expect(note.html).toContain('<strong>retry loops</strong>')
    expect(note.html).not.toContain('title:')
  })

  it('falls back to the slug when the frontmatter has no title', () => {
    const note = parseNote('untitled-note', 'plain body')
    expect(note.title).toBe('untitled-note')
    expect(note.date).toBe('')
  })
})

describe('sortNotes', () => {
  it('orders notes newest first', () => {
    const sorted = sortNotes([
      { slug: 'a', title: 'a', date: '2026-01-01', html: '' },
      { slug: 'b', title: 'b', date: '2026-06-01', html: '' },
    ])
    expect(sorted.map((n) => n.slug)).toEqual(['b', 'a'])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- notes`
Expected: FAIL — cannot resolve `./notes`.

- [ ] **Step 3: Write the notes module**

`src/notes.ts`:

```ts
import { marked } from 'marked'

export interface Note {
  slug: string
  title: string
  date: string
  html: string
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseNote(slug: string, raw: string): Note {
  const match = raw.match(FRONTMATTER)
  const meta: Record<string, string> = {}
  let body = raw

  if (match) {
    body = raw.slice(match[0].length)
    for (const line of match[1].split(/\r?\n/)) {
      const separator = line.indexOf(':')
      if (separator === -1) continue
      meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
    }
  }

  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? '',
    html: marked.parse(body, { async: false }) as string,
  }
}

export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date))
}

export function loadNotes(): Note[] {
  const files = import.meta.glob('/content/notes/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>

  const notes = Object.entries(files).map(([path, raw]) =>
    parseNote(path.split('/').pop()!.replace(/\.md$/, ''), raw),
  )

  return sortNotes(notes)
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- notes`
Expected: PASS — 4 tests.

- [ ] **Step 5: Write the failing test for the component**

This is the requirement that keeps an empty "Notes" heading off the page while there are zero notes.

`src/components/Notes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import type { Note } from '../notes'
import Notes from './Notes'

const NOTE: Note = {
  slug: 'flaky-by-design',
  title: 'Flaky by design',
  date: '2026-09-01',
  html: '<p>body</p>',
}

describe('Notes', () => {
  it('renders nothing at all when there are no notes', () => {
    const { container } = render(<Notes notes={[]} />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText(/notes/i)).not.toBeInTheDocument()
  })

  it('renders the section once a note exists', () => {
    render(<Notes notes={[NOTE]} />)
    expect(screen.getByRole('heading', { name: 'Flaky by design' })).toBeInTheDocument()
    expect(screen.getByText('2026-09-01')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- Notes`
Expected: FAIL — cannot resolve `./Notes`.

- [ ] **Step 7: Write the component**

`src/components/Notes.tsx`:

```tsx
import type { Note } from '../notes'
import './Notes.css'

export default function Notes({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return null

  return (
    <section id="notes" className="section">
      <h2 className="label">notes</h2>
      {notes.map((note) => (
        <article className="note" key={note.slug}>
          <h3>{note.title}</h3>
          <p className="note-date">{note.date}</p>
          <div className="note-body" dangerouslySetInnerHTML={{ __html: note.html }} />
        </article>
      ))}
    </section>
  )
}
```

`src/components/Notes.css`:

```css
.note {
  padding: calc(var(--step) * 1.5) 0;
  border-top: 1px solid var(--rule);
}

.note:first-of-type {
  border-top: 0;
}

.note h3 {
  margin: 0;
  font-size: 14px;
}

.note-date {
  margin: calc(var(--step) * 0.5) 0 0;
  color: var(--muted);
  font-size: 10px;
}

.note-body {
  max-width: 66ch;
}

.note-body a {
  border-bottom-color: var(--accent);
}
```

- [ ] **Step 8: Create the notes directory**

The directory must exist for the glob to resolve, and git will not track an empty one.

```bash
mkdir -p content/notes
printf 'Drop markdown files here. Frontmatter keys: title, date (YYYY-MM-DD).\nThe notes section stays hidden until the first .md file lands.\n' > content/notes/README.txt
```

- [ ] **Step 9: Add the section to the app**

`src/App.tsx` — import and render below `<Stack />`:

```tsx
import Notes from './components/Notes'
import { loadNotes } from './notes'
```

```tsx
<Notes notes={loadNotes()} />
```

- [ ] **Step 10: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 11: Verify the empty section really is absent from the build**

Run: `npm run build && grep -c '>notes<' dist/index.html || true`
Expected: `0` — the notes label is not in the built HTML while `content/notes/` holds no markdown.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Add markdown-backed notes section, hidden while empty"
```

---

### Task 8: Contact form

**Files:**
- Create: `src/components/ContactForm.tsx`, `src/components/ContactForm.css`, `src/components/ContactForm.test.tsx`
- Modify: `src/App.tsx`, `src/data/profile.ts`

**Interfaces:**
- Consumes: `profile.links` from Task 4.
- Produces: `ContactForm` — default export, `() => JSX.Element`. Sends through EmailJS `service_sjuqhqv` / `template_rt05gzl` with public key `4y53nE57BGeNERzC4` (all three are already public in the old site's source).

- [ ] **Step 1: Write the failing test**

`src/components/ContactForm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

const send = vi.fn()

vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: (...args: unknown[]) => send(...args),
  },
}))

describe('ContactForm', () => {
  beforeEach(() => {
    send.mockReset()
    send.mockResolvedValue({ status: 200 })
  })

  it('refuses to send when the email is malformed', async () => {
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText(/name/i), 'A Recruiter')
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText(/message/i), 'hello')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(send).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i)
  })

  it('sends a valid message and confirms it', async () => {
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText(/name/i), 'A Recruiter')
    await userEvent.type(screen.getByLabelText(/email/i), 'someone@example.com')
    await userEvent.type(screen.getByLabelText(/message/i), 'hello')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(send).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('status')).toHaveTextContent(/message sent/i)
  })

  it('silently drops a submission when the honeypot is filled', async () => {
    const { container } = render(<ContactForm />)
    const honeypot = container.querySelector<HTMLInputElement>('input[name="company"]')!

    await userEvent.type(screen.getByLabelText(/name/i), 'Spam Bot')
    await userEvent.type(screen.getByLabelText(/email/i), 'bot@example.com')
    await userEvent.type(screen.getByLabelText(/message/i), 'buy things')
    await userEvent.type(honeypot, 'ACME')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(send).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- ContactForm`
Expected: FAIL — cannot resolve `./ContactForm`.

- [ ] **Step 3: Write the component**

`src/components/ContactForm.tsx`:

```tsx
import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import './ContactForm.css'

const SERVICE_ID = 'service_sjuqhqv'
const TEMPLATE_ID = 'template_rt05gzl'
const PUBLIC_KEY = '4y53nE57BGeNERzC4'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot: a real person never sees this field, so anything in it is a bot.
    if ((data.get('company') as string).trim() !== '') return

    const email = (data.get('email') as string).trim()
    if (!EMAIL.test(email)) {
      setError('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setError('')
    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: (data.get('name') as string).trim(),
          email_id: email,
          message: (data.get('message') as string).trim(),
        },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('sent')
      form.reset()
    } catch {
      setError('Sending failed. Reach me on LinkedIn instead.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section">
      <h2 className="label">contact</h2>
      <form className="contact" onSubmit={onSubmit} noValidate>
        <label htmlFor="contact-name">name</label>
        <input id="contact-name" name="name" type="text" required />

        <label htmlFor="contact-email">email</label>
        <input id="contact-email" name="email" type="email" required />

        <label htmlFor="contact-message">message</label>
        <textarea id="contact-message" name="message" rows={5} required />

        <input
          className="honeypot"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'sending…' : 'send'}
        </button>

        {status === 'error' && <p role="alert">{error}</p>}
        {status === 'sent' && <p role="status">Message sent. I will get back to you.</p>}
      </form>
    </section>
  )
}
```

`src/components/ContactForm.css`:

```css
.contact {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 0.5);
  max-width: 460px;
}

.contact label {
  margin-top: calc(var(--step));
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.contact input,
.contact textarea {
  padding: calc(var(--step));
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--text);
  font: inherit;
}

.contact input:focus,
.contact textarea:focus {
  border-color: var(--accent);
  outline: none;
}

.contact button {
  align-self: flex-start;
  margin-top: calc(var(--step) * 2);
  padding: calc(var(--step)) calc(var(--step) * 2);
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font: inherit;
  cursor: pointer;
}

.contact button:disabled {
  border-color: var(--rule);
  color: var(--muted);
  cursor: default;
}

.contact [role='alert'] {
  color: var(--heading);
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- ContactForm`
Expected: PASS — 3 tests.

- [ ] **Step 5: Add the section and the footer links to the app**

`src/App.tsx` — import and render below `<Notes />`:

```tsx
import ContactForm from './components/ContactForm'
```

```tsx
<ContactForm />
```

- [ ] **Step 6: Verify no private contact details ship**

Run: `npm run build && grep -riE '538|hotmail' dist/ || echo CLEAN`
Expected: `CLEAN`.

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Add contact form with honeypot and validation"
```

---

### Task 9: Document head, metadata and analytics

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg`, `public/robots.txt`, `public/sitemap.xml`, `src/document.test.ts`

**Interfaces:**
- Consumes: `index.html` from Task 1.
- Produces: no runtime exports; a head that carries description, Open Graph, favicon and the GA4 tag.

- [ ] **Step 1: Write the failing test**

`src/document.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8')

describe('document head', () => {
  it('declares a description and Open Graph title', () => {
    expect(html).toContain('name="description"')
    expect(html).toContain('property="og:title"')
  })

  it('keeps the GA4 tag and drops the retired Universal Analytics property', () => {
    expect(html).toContain('G-RGZTGWEM57')
    expect(html).not.toContain('UA-110940506-1')
  })

  it('applies the theme before the app bundle loads', () => {
    expect(html.indexOf('localStorage.getItem')).toBeLessThan(html.indexOf('/src/main.tsx'))
  })

  it('carries no chat widget and no jQuery', () => {
    expect(html).not.toContain('tawk.to')
    expect(html).not.toContain('jquery')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- document`
Expected: FAIL — no `description` meta tag.

- [ ] **Step 3: Extend the head**

`index.html` — insert inside `<head>`, after the `<title>` and before the theme script:

```html
<meta name="description" content="Ömer Yusuf Sorhun — software QA engineer in Istanbul. Test automation, API and UI testing, end-to-end verification of event-driven data pipelines." />
<meta name="author" content="Ömer Yusuf Sorhun" />
<link rel="canonical" href="https://omeryusufsorhun.github.io/" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Ömer Yusuf Sorhun — Software QA Engineer" />
<meta property="og:description" content="Test automation, API and UI testing, end-to-end verification of event-driven data pipelines." />
<meta property="og:url" content="https://omeryusufsorhun.github.io/" />
<meta name="twitter:card" content="summary" />
```

And immediately before `</head>`, after the theme script:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RGZTGWEM57"></script>
<script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-RGZTGWEM57')
</script>
```

- [ ] **Step 4: Add the favicon and robots file**

`public/favicon.svg` — the caret from the identity block, drawn at favicon size:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0B0B0B"/>
  <rect x="12" y="7" width="8" height="18" fill="#00FF9C"/>
</svg>
```

`public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://omeryusufsorhun.github.io/sitemap.xml
```

`public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://omeryusufsorhun.github.io/</loc>
  </url>
</urlset>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — the whole suite is green.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add head metadata, favicon and GA4 tag"
```

---

### Task 10: Playwright smoke test

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: the production build from `npm run build`.
- Produces: `npm run test:e2e`, run in CI before deploy.

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test@latest
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Write the config**

`playwright.config.ts` — the web server runs the *production* build, which is what actually ships.

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 3: Add the script**

`package.json` — add to `scripts`:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 4: Write the smoke test**

`e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('the page loads with the identity block and a reachable CV', async ({ page, request }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('ömer yusuf sorhun')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  const cv = await request.get('/cv.pdf')
  expect(cv.status()).toBe(200)
})

test('the theme switch flips the document and survives a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /switch colour theme/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
```

- [ ] **Step 5: Run it**

Run: `npm run test:e2e`
Expected: PASS — 2 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Playwright smoke test"
```

---

### Task 11: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `npm test`, `npm run test:e2e`, `npm run build` from earlier tasks.
- Produces: a Pages deployment of `dist/` on every push to `main`.

- [ ] **Step 1: Write the workflow**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the workflow parses**

Run: `npx --yes js-yaml .github/workflows/deploy.yml > /dev/null && echo VALID`
Expected: `VALID`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add GitHub Pages deploy workflow"
```

- [ ] **Step 4: STOP — get the owner's go-ahead before anything reaches the live site**

Three actions remain, all of which change what visitors see. Do not perform any of them without explicit, in-the-moment approval:

1. `git push -u origin feat/terminal-redesign`
2. Switch the Pages source from `legacy` to Actions — the site keeps serving the old scraped page until this happens:

   ```bash
   gh api -X PUT repos/omeryusufsorhun/omeryusufsorhun.github.io/pages -f build_type=workflow
   ```

3. Merge `feat/terminal-redesign` into `main`, which triggers the deploy.

Report the deployed URL and the workflow conclusion once it finishes.

---

## Self-Review

**Spec coverage**

| Spec section | Task |
| --- | --- |
| 1 Goal / 2 Non-goals (no projects, no phone) | Tasks 1, 8 (`grep` check), Global Constraints |
| 3 Visual direction (palette, type, layout) | Tasks 2, 4 |
| 4 Page structure — identity | Task 4 |
| 4 Page structure — experience + education | Task 5 |
| 4 Page structure — stack | Task 6 |
| 4 Page structure — notes, hidden when empty | Task 7 |
| 4 Page structure — contact | Task 8 |
| 5 Theme switch | Tasks 1 (head script), 3 |
| 6 Data and content sources | Tasks 4, 5, 6, 7; CV in Task 1 |
| 7 Technical setup, removals, GA4 kept | Tasks 1, 9, 11 |
| 8 Accessibility and performance | Tasks 2 (focus ring), 4 (`<nav>`), 5 (`<table>` + caption), 3 (`aria-pressed`) |
| 9 Testing — 5 Vitest scenarios + 1 Playwright smoke | Tasks 3, 5, 7, 8, 10 |

No spec requirement is unassigned.

**Placeholder scan:** none. Every code step carries the literal file content.

**Type consistency:** `Role`, `Education`, `StackGroup`, `Note`, `Profile`, `Theme` are each defined once and imported by name thereafter. `sortRoles` (Task 5) and `sortNotes` (Task 7) keep distinct names for distinct types. `applyTheme`/`readStoredTheme` are used in Task 3 exactly as declared. The `.section` and `.label` classes are defined once in Task 5's stylesheet and reused by Tasks 6, 7 and 8 — noted in each task's Consumes block.
