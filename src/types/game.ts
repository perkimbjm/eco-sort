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

// Mode permainan per level (Level 6-7 Adrenaline Update)
// classic  : satu sampah, tanpa timer — level 1-5
// chaos    : antrean sampah + timer + event acak — level 6
// boss     : tiga fase melawan Raja Sampah — level 7
export type LevelMode = 'classic' | 'chaos' | 'boss'

export type BossPhase = 'storm' | 'battle' | 'decision'

export type GameEventId = 'hujan-deras' | 'truk-sampah' | 'warga-membantu'

export interface GameEvent {
  id: GameEventId
  name: string
  emoji: string
  description: string
  /** Berapa sampah ke depan efeknya berlaku (0 = efek sekali pakai) */
  turns: number
}

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
  /** 'timeout' = sampah terlewat karena kehabisan waktu (mode chaos/boss) */
  lastAnswer: 'correct' | 'wrong' | 'timeout' | null

  // ---- Level 6-7 ----
  /** Pratinjau sampah berikutnya di antrean (mode chaos/boss) */
  upcoming: TrashItem[]
  /** Sampah aktif adalah item langka ✨ Golden Bottle */
  isRareTrash: boolean
  /** Sisa waktu untuk sampah aktif, dalam milidetik */
  timeLeftMs: number
  /** Batas waktu sampah aktif, dalam milidetik (0 = tanpa timer) */
  timeLimitMs: number
  activeEvent: GameEventId | null
  eventTurnsLeft: number
  /** Perisai combo dari event "Warga Membantu" — menahan satu reset */
  hasComboShield: boolean
  bossPhase: BossPhase | null
  bossHp: number
  /** Sisa sampah yang harus dilalui pada fase Garbage Storm */
  stormRemaining: number
  /** Jawaban terakhir masuk di detik-detik terakhir (CLUTCH) */
  lastClutch: boolean
  /** Damage yang baru diberikan ke boss, untuk animasi */
  lastDamage: number
  /** Jumlah sampah yang terlewat karena kehabisan waktu */
  timeoutCount: number
  /** Total waktu bermain, untuk perhitungan peringkat akhir */
  elapsedMs: number
}

export type RankGrade = 'S' | 'A' | 'B' | 'C'

export interface RankResult {
  grade: RankGrade
  title: string
  stars: number
  breakdown: {
    label: string
    value: string
    points: number
  }[]
  totalPoints: number
}

export interface DecisionOption {
  id: string
  label: string
  text: string
  isBest: boolean
  explanation: string
}

// ---------- Phase 21-30: Adventure ----------

export interface WorldArea {
  id: string
  name: string
  emoji: string
  /** Level yang tercakup area ini */
  levels: number[]
  /** Level minimum yang harus pernah dicapai agar area terbuka */
  unlockAtLevel: number
  intro: string
  outro: string
  newCategories: TrashCategory[]
}

export type CardRarity = 'umum' | 'jarang' | 'langka' | 'legendaris'

export interface CollectionCard {
  /** Sama dengan id TrashItem */
  id: string
  rarity: CardRarity
  fact: string
}

export type CompanionSkill = 'organic_bonus' | 'score_bonus' | 'combo_guard'

export interface Companion {
  id: string
  name: string
  emoji: string
  skill: CompanionSkill
  skillLabel: string
  description: string
  /** Jumlah kartu koleksi yang dibutuhkan untuk membuka */
  unlockAtCards: number
}

export interface Secret {
  id: string
  name: string
  emoji: string
  /** Petunjuk samar — isi sebenarnya baru terungkap setelah ditemukan */
  hint: string
  reveal: string
}

export type MasteryModeId = 'speed' | 'endless' | 'perfect'

export interface MasteryMode {
  id: MasteryModeId
  name: string
  emoji: string
  description: string
  rule: string
}

export type LeaderboardCategory = 'score' | 'combo' | 'city'

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
  mode: LevelMode
  /** Batas waktu per sampah dalam ms (0 = tanpa timer) */
  timeLimitMs: number
  /** Jumlah pratinjau sampah berikutnya yang ditampilkan */
  queuePreview: number
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
  /** Kemampuan/mode yang terbuka, mis. speed-sorting, new-game-plus */
  unlocks: string[]
  /** Peringkat akhir terbaik yang pernah diraih di Level 7 */
  bestRank: RankGrade | null

  // ---- Phase 21-30 ----
  /** Level tertinggi yang pernah dicapai — penentu terbukanya area */
  highestLevel: number
  /** Id sampah yang kartunya sudah terkumpul */
  collected: string[]
  /** Item Eco Ranger yang sedang dipakai */
  equipped: string[]
  companions: string[]
  activeCompanion: string | null
  /** XP tiap companion, menentukan levelnya */
  companionXp: Record<string, number>
  secretsFound: string[]
  /** Skor terbaik tiap mode Mastery */
  masteryScores: Record<string, number>
  /** Pemain sudah menonton adegan penutup */
  hasSeenEnding: boolean
  /** Kota terbersih yang pernah dicapai, dalam persen */
  bestCityPercent: number
}

export interface LeaderboardEntry {
  name: string
  score: number
  level: number
  date: string
  /** Combo terbaik pada permainan itu */
  combo?: number
  /** Clean City tertinggi pada permainan itu, dalam persen */
  cityPercent?: number
}

export interface RangerItem {
  id: string
  name: string
  emoji: string
  unlockRangerLevel: number
}
