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
