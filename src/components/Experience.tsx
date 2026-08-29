import type { Role } from '../data/experience'
import { sortRoles } from '../data/experience'
import '../styles/timeline.css'

function period(role: Role): string {
  const start = role.start.replace('-', '.')
  if (role.end === null) return `${start} —`
  return `${start} – ${role.end.replace('-', '.')}`
}

export default function Experience({ roles }: { roles: Role[] }) {
  return (
    <section id="experience" className="section">
      <h2 className="label">experience</h2>
      <table className="timeline">
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
        </tbody>
      </table>
    </section>
  )
}
