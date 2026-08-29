import { render, screen, within } from '@testing-library/react'
import { education, roles } from '../data/experience'
import Experience from './Experience'

describe('Experience', () => {
  it('renders one row per role, most recent first', () => {
    render(<Experience roles={roles} education={education} />)
    const table = screen.getByRole('table', { name: /experience/i })
    const rows = within(table).getAllByRole('row')
    expect(within(rows[0]).getByText('Insider')).toBeInTheDocument()
    expect(rows).toHaveLength(roles.length + 1)
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
