import { Marked } from 'marked'

// Notes render through dangerouslySetInnerHTML, so nothing executable may
// survive the markdown parse. Two holes have to be closed: raw HTML tokens
// (<script>, onerror=...) and link hrefs, which marked passes through verbatim
// including javascript: and data: URIs. Normal markdown is untouched — code
// fences still escape their own contents.
const SAFE_SCHEME = /^(?:https?:|mailto:|[#/]|\.{1,2}\/)/i

const markdown = new Marked({
  renderer: {
    html: () => '',
    link({ href, title, text }) {
      if (!SAFE_SCHEME.test(href.trim())) return text
      const attrs = title ? ` title="${title}"` : ''
      const external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${href}"${attrs}${external}>${text}</a>`
    },
  },
})

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
    html: markdown.parse(body, { async: false }) as string,
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
