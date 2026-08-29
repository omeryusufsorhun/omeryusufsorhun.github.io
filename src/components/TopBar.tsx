import ThemeToggle from './ThemeToggle'
import './TopBar.css'

export default function TopBar({ sections }: { sections: string[] }) {
  return (
    <div className="topbar">
      <span className="topbar-host">omeryusufsorhun.github.io</span>
      <nav aria-label="Sections">
        {sections.map((id) => (
          <a key={id} href={`#${id}`}>
            {id}
          </a>
        ))}
      </nav>
      <ThemeToggle />
    </div>
  )
}
