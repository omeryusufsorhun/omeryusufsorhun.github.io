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
