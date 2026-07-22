export type TrashCategory =
  | 'plastik'
  | 'organik'
  | 'kertas'
  | 'residu'
  | 'logam'
  | 'b3'

export interface TrashItem {
  id: string
  name: string
  emoji: string
  category: TrashCategory
  description: string
}

export type GameStatus = 'playing' | 'levelComplete' | 'gameOver' | 'won'

export interface GameState {
  score: number
  level: number
  health: number
  combo: number
  cleanCity: number
  currentTrash: TrashItem | null
  status: GameStatus
  bestCombo: number
  correctCount: number
  wrongCount: number
  lastAnswer: 'correct' | 'wrong' | null
}

export interface CategoryInfo {
  id: TrashCategory
  label: string
  emoji: string
  description: string
}

export interface LevelConfig {
  level: number
  name: string
  categories: TrashCategory[]
}

export interface Badge {
  id: string
  name: string
  emoji: string
  unlockLevel: number
  description: string
}
