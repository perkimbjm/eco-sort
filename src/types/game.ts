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

// ---------- Post-MVP: progression & engagement ----------

export interface CityStage {
  index: number
  name: string
  emoji: string
  minPercent: number
}

export interface Achievement {
  id: string
  name: string
  emoji: string
  description: string
}

export type MissionType = 'sort_any' | 'sort_category' | 'combo' | 'score'

export interface Mission {
  id: string
  type: MissionType
  description: string
  category?: TrashCategory
  target: number
  progress: number
  isClaimed: boolean
}

export interface DailyMissions {
  date: string
  missions: Mission[]
}

export interface CategoryStat {
  correct: number
  wrong: number
}

export interface Profile {
  playerName: string
  ecoPoints: number
  xp: number
  totalCorrect: number
  totalWrong: number
  maxCombo: number
  gamesPlayed: number
  wins: number
  dailyStreak: number
  lastPlayedDate: string
  achievements: string[]
  badges: string[]
  categoryStats: Record<TrashCategory, CategoryStat>
  isMuted: boolean
}

export interface LeaderboardEntry {
  name: string
  score: number
  level: number
  date: string
}

export interface RangerItem {
  id: string
  name: string
  emoji: string
  unlockRangerLevel: number
}
