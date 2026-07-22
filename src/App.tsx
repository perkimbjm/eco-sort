import { useState } from 'react'
import { Home } from './pages/Home'
import { Game } from './pages/Game'

type Page = 'home' | 'game'

function App() {
  const [page, setPage] = useState<Page>('home')

  return page === 'home' ? (
    <Home onStart={() => setPage('game')} />
  ) : (
    <Game onExit={() => setPage('home')} />
  )
}

export default App
