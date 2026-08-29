import Experience from './components/Experience'
import Identity from './components/Identity'
import Stack from './components/Stack'
import TopBar from './components/TopBar'
import { education, roles } from './data/experience'
import { profile } from './data/profile'
import { stack } from './data/stack'

export default function App() {
  return (
    <>
      <TopBar sections={['experience', 'stack', 'contact']} />
      <main>
        <Identity profile={profile} />
        <Experience roles={roles} education={education} />
        <Stack groups={stack} />
      </main>
    </>
  )
}
