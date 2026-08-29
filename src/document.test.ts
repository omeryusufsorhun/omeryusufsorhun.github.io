import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const html = readFileSync(resolve(here, '..', 'index.html'), 'utf8')

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
