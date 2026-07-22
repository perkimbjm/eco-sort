import { useState } from 'react'
import type { MasteryModeId } from './types/game'
import { Home } from './pages/Home'
import { Game } from './pages/Game'

export interface StartRequest {
  shouldResume: boolean
  startLevel?: number
  masteryMode?: MasteryModeId | null
}

type View = { page: 'home' } | ({ page: 'game' } & StartRequest)

function App() {
  const [view, setView] = useState<View>({ page: 'home' })

  return view.page === 'home' ? (
    <Home onStart={(request) => setView({ page: 'game', ...request })} />
  ) : (
    <Game
      // Remount penuh saat konfigurasi mulai berubah, agar state permainan bersih
      key={`${view.startLevel ?? 1}-${view.masteryMode ?? 'adventure'}-${view.shouldResume}`}
      shouldResume={view.shouldResume}
      startLevel={view.startLevel}
      masteryMode={view.masteryMode}
      onExit={() => setView({ page: 'home' })}
    />
  )
}

export default App
