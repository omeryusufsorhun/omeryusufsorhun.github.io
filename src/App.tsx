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

  return (
    <>
      <TopBar sections={notes.length > 0 ? ['experience', 'stack', 'notes', 'contact'] : ['experience', 'stack', 'contact']} />
      <main>
        <Identity profile={profile} />
        <Experience roles={roles} education={education} />
        <Stack groups={stack} />
        <Notes notes={notes} />
      </main>
    </>
  )
}
