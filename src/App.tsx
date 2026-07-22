import { useState } from 'react'
import { Home } from './pages/Home'
import { Game } from './pages/Game'

type View = { page: 'home' } | { page: 'game'; shouldResume: boolean }

function App() {
  const [view, setView] = useState<View>({ page: 'home' })

  return view.page === 'home' ? (
    <Home onStart={(shouldResume) => setView({ page: 'game', shouldResume })} />
  ) : (
    <Game
      shouldResume={view.shouldResume}
      onExit={() => setView({ page: 'home' })}
    />
  )
}

export default App
