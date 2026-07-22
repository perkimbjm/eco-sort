import type {
  DailyMissions,
  LeaderboardEntry,
  Profile,
  RangerItem,
  TrashCategory,
} from '../types/game'
import { generateDailyMissions, todayString } from '../data/missions'
import { loadBadges, loadHighScore } from './storage'

const PROFILE_KEY = 'eco-sort:profile'
const MISSIONS_KEY = 'eco-sort:missions'
const LEADERBOARD_KEY = 'eco-sort:leaderboard'
const SESSION_KEY = 'eco-sort:session'
const LEADERBOARD_MAX = 10

export const RANGER_ITEMS: RangerItem[] = [
  { id: 'eco-hat', name: 'Eco Hat', emoji: '🧢', unlockRangerLevel: 5 },
  { id: 'rescue-helmet', name: 'Rescue Helmet', emoji: '⛑️', unlockRangerLevel: 8 },
  { id: 'green-suit', name: 'Green Suit', emoji: '🥋', unlockRangerLevel: 10 },
  {
    id: 'guardian-badge',
    name: 'City Guardian Badge',
    emoji: '🎖️',
    unlockRangerLevel: 15,
  },
]

export function getRangerLevel(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1
}

export function getXpForLevel(level: number): number {
  return 100 * (level - 1) * (level - 1)
}

export function getUnlockedItems(xp: number): RangerItem[] {
  const level = getRangerLevel(xp)
  return RANGER_ITEMS.filter((item) => item.unlockRangerLevel <= level)
}

function emptyCategoryStats(): Record<
  TrashCategory,
  { correct: number; wrong: number }
> {
  return {
    plastik: { correct: 0, wrong: 0 },
    organik: { correct: 0, wrong: 0 },
    kertas: { correct: 0, wrong: 0 },
    residu: { correct: 0, wrong: 0 },
    logam: { correct: 0, wrong: 0 },
    b3: { correct: 0, wrong: 0 },
  }
}

export function createDefaultProfile(): Profile {
  return {
    playerName: 'Eco Ranger',
    ecoPoints: 0,
    xp: 0,
    totalCorrect: 0,
    totalWrong: 0,
    maxCombo: 0,
    gamesPlayed: 0,
    wins: 0,
    dailyStreak: 0,
    lastPlayedDate: '',
    achievements: [],
    // Migrasi dari penyimpanan MVP lama
    badges: loadBadges(),
    categoryStats: emptyCategoryStats(),
    isMuted: false,
    unlocks: [],
    bestRank: null,
    highestLevel: 1,
    collected: [],
    equipped: [],
    companions: [],
    activeCompanion: null,
    companionXp: {},
    secretsFound: [],
    masteryScores: {},
    hasSeenEnding: false,
    bestCityPercent: 0,
  }
}

/**
 * Profil lama belum punya `highestLevel`. Tanpa migrasi, pemain yang sudah
 * menamatkan permainan akan melihat seluruh peta terkunci lagi. Level tertinggi
 * disimpulkan dari badge yang sudah diraih dan riwayat papan skor.
 */
function inferHighestLevel(parsed: Partial<Profile>): number {
  const badges = parsed.badges ?? loadBadges()
  const fromBadges = badges.includes('eco-legend')
    ? 8
    : badges.includes('city-savior')
      ? 7
      : badges.includes('pahlawan-lingkungan')
        ? 6
        : badges.includes('eco-warrior')
          ? 4
          : badges.includes('pemilah-pemula')
            ? 2
            : 1
  const fromLeaderboard = loadLeaderboard().reduce(
    (best, entry) => Math.max(best, entry.level ?? 1),
    1,
  )
  return Math.max(fromBadges, fromLeaderboard)
}

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) {
      return createDefaultProfile()
    }
    const parsed = JSON.parse(raw) as Partial<Profile>
    const merged = { ...createDefaultProfile(), ...parsed }
    // Selalu ambil yang tertinggi: aman untuk profil lama tanpa field ini
    // maupun profil yang sempat tersimpan dengan nilai bawaan terlalu rendah.
    return {
      ...merged,
      highestLevel: Math.max(merged.highestLevel, inferHighestLevel(parsed)),
    }
  } catch {
    return createDefaultProfile()
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // Penyimpanan diblokir — progres hanya bertahan selama sesi
  }
}

// Streak harian: +1 jika kemarin bermain, reset ke 1 jika bolong
export function touchDailyStreak(profile: Profile): Profile {
  const today = todayString()
  if (profile.lastPlayedDate === today) {
    return profile
  }
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  const yesterdayString = `${yesterday.getFullYear()}-${month}-${day}`
  return {
    ...profile,
    dailyStreak: profile.lastPlayedDate === yesterdayString
      ? profile.dailyStreak + 1
      : 1,
    lastPlayedDate: today,
  }
}

export function loadDailyMissions(): DailyMissions {
  const today = todayString()
  try {
    const raw = localStorage.getItem(MISSIONS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DailyMissions
      if (parsed.date === today && Array.isArray(parsed.missions)) {
        return parsed
      }
    }
  } catch {
    // regenerasi di bawah
  }
  return { date: today, missions: generateDailyMissions(today) }
}

export function saveDailyMissions(missions: DailyMissions): void {
  try {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions))
  } catch {
    // Abaikan
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed as LeaderboardEntry[]
    }
    return []
  } catch {
    return []
  }
}

export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  // Disimpan dalam satu daftar; pemeringkatan per kategori dilakukan saat tampil
  const updated = [...loadLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_MAX)
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated))
  } catch {
    // Abaikan
  }
  return updated
}

export function hasUnlock(profile: Profile, unlockId: string): boolean {
  return profile.unlocks.includes(unlockId)
}

export function exportAllData(): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: 'Eco Sort Battle',
      profile: loadProfile(),
      missions: loadDailyMissions(),
      leaderboard: loadLeaderboard(),
      highScore: loadHighScore(),
    },
    null,
    2,
  )
}

export function resetAllData(): void {
  try {
    for (const key of [
      PROFILE_KEY,
      MISSIONS_KEY,
      LEADERBOARD_KEY,
      SESSION_KEY,
      'eco-sort:badges',
      'eco-sort:highscore',
    ]) {
      localStorage.removeItem(key)
    }
  } catch {
    // Abaikan
  }
}

export const SESSION_STORAGE_KEY = SESSION_KEY
