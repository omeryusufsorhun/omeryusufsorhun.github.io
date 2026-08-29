import Experience from './components/Experience'
import Identity from './components/Identity'
import TopBar from './components/TopBar'
import { education, roles } from './data/experience'
import { profile } from './data/profile'

export default function App() {
  return (
    <>
      <TopBar sections={['experience', 'stack', 'contact']} />
      <main>
        <Identity profile={profile} />
        <Experience roles={roles} education={education} />
      </main>
    </>
  )
}
