import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(here, 'tokens.css'), 'utf8')

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
  it('defines the dark palette', () => {
    const dark = block("html\\[data-theme='dark'\\]")
    for (const [name, value] of Object.entries(DARK)) {
      expect(dark).toContain(`${name}: ${value}`)
    }
  })

  it('defines the light palette', () => {
    const light = block("html\\[data-theme='light'\\]")
    for (const [name, value] of Object.entries(LIGHT)) {
      expect(light).toContain(`${name}: ${value}`)
    }
  })

  it('never reads prefers-color-scheme', () => {
    expect(css).not.toContain('prefers-color-scheme')
  })
})
