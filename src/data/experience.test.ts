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
