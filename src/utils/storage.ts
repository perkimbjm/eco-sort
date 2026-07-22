const BADGES_KEY = 'eco-sort:badges'
const HIGH_SCORE_KEY = 'eco-sort:highscore'

export function loadBadges(): string[] {
  try {
    const raw = localStorage.getItem(BADGES_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
      return parsed
    }
    return []
  } catch {
    return []
  }
}

export function saveBadges(badgeIds: string[]): void {
  try {
    localStorage.setItem(BADGES_KEY, JSON.stringify(badgeIds))
  } catch {
    // localStorage penuh atau diblokir — badge hanya bertahan selama sesi
  }
}

export function loadHighScore(): number {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY)
    const value = raw ? Number(raw) : 0
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
  } catch {
    // Abaikan — high score hanya bertahan selama sesi
  }
}
