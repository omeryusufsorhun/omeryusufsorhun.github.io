import Identity from './components/Identity'
import TopBar from './components/TopBar'
import { profile } from './data/profile'

export default function App() {
  return (
    <>
      <TopBar sections={['experience', 'stack', 'contact']} />
      <main>
        <Identity profile={profile} />
      </main>
    </>
  )
}
