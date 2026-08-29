import type { MouseEvent } from 'react'
import ThemeToggle from './ThemeToggle'
import './TopBar.css'

export default function TopBar({ sections }: { sections: string[] }) {
  // Handle the scroll explicitly rather than leaving it to the browser: a plain
  // anchor does nothing when the hash is already the one being clicked, which
  // happens as soon as the reader scrolls away and clicks the same item again.
  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id)
    if (!target) return

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="topbar">
      <span className="topbar-host">omeryusufsorhun.github.io</span>
      <nav aria-label="Sections">
        {sections.map((id) => (
          <a key={id} href={`#${id}`} onClick={(event) => scrollToSection(event, id)}>
            {id}
          </a>
        ))}
      </nav>
      <ThemeToggle />
    </div>
  )
}
