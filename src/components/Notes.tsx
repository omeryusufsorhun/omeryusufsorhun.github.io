import type { Note } from '../notes'
import './Notes.css'

export default function Notes({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return null

  return (
    <section id="notes" className="section">
      <h2 className="label">notes</h2>
      {notes.map((note) => (
        <article className="note" key={note.slug}>
          <h3>{note.title}</h3>
          <p className="note-date">{note.date}</p>
          <div className="note-body" dangerouslySetInnerHTML={{ __html: note.html }} />
        </article>
      ))}
    </section>
  )
}
