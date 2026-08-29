import ContactForm from './components/ContactForm'
import Education from './components/Education'
import Experience from './components/Experience'
import Identity from './components/Identity'
import Notes from './components/Notes'
import Stack from './components/Stack'
import TopBar from './components/TopBar'
import { education, roles } from './data/experience'
import { profile } from './data/profile'
import { stack } from './data/stack'
import { loadNotes } from './notes'

export default function App() {
  const notes = loadNotes()
  const sections = ['experience', 'stack', 'education', ...(notes.length > 0 ? ['notes'] : []), 'contact']

  return (
    <>
      <TopBar sections={sections} />
      <main>
        <Identity profile={profile} />
        <Experience roles={roles} />
        <Stack groups={stack} />
        <Education education={education} />
        <Notes notes={notes} />
        <ContactForm />
      </main>
    </>
  )
}
