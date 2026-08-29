import type { Profile } from '../data/profile'
import './Identity.css'

export default function Identity({ profile }: { profile: Profile }) {
  return (
    <header className="identity">
      <h1>
        {profile.name}
        <span className="caret" aria-hidden="true" />
      </h1>
      <p className="identity-role">
        {profile.role} · {profile.location}
      </p>
      <p className="identity-summary">{profile.summary}</p>
      <p className="identity-links">
        {profile.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </p>
    </header>
  )
}
