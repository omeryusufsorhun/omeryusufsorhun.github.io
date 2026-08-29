import type { Education as EducationEntry } from '../data/experience'
import '../styles/timeline.css'

export default function Education({ education }: { education: EducationEntry }) {
  return (
    <section id="education" className="section">
      <h2 className="label">education</h2>
      <table className="timeline">
        <caption className="visually-hidden">Education</caption>
        <tbody>
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
