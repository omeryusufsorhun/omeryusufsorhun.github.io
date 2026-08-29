import type { StackGroup } from '../data/stack'
import './Stack.css'

export default function Stack({ groups }: { groups: StackGroup[] }) {
  return (
    <section id="stack" className="section">
      <h2 className="label">stack</h2>
      <dl className="stack">
        {groups.map((group) => (
          <div className="stack-group" key={group.label}>
            <dt>{group.label}</dt>
            <dd>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
