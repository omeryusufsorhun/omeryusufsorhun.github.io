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
