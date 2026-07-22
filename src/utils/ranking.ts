import type { RankGrade, RankResult } from '../types/game'

export interface RankInput {
  score: number
  bestCombo: number
  wrongCount: number
  timeoutCount: number
  elapsedMs: number
}

const RANK_TITLES: Record<RankGrade, string> = {
  S: 'Eco Master',
  A: 'Green Hero',
  B: 'Recycler',
  C: 'Eco Rookie',
}

const RANK_STARS: Record<RankGrade, number> = { S: 5, A: 4, B: 3, C: 2 }

// Ambang poin untuk tiap peringkat (dari total maksimum 100)
const GRADE_THRESHOLDS: { grade: RankGrade; min: number }[] = [
  { grade: 'S', min: 85 },
  { grade: 'A', min: 65 },
  { grade: 'B', min: 45 },
  { grade: 'C', min: 0 },
]

function clampPoints(value: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(value)))
}

/**
 * Menilai penampilan akhir dari skor, combo, kesalahan, dan waktu.
 * Fungsi murni agar mudah diuji dan dipakai ulang di layar hasil.
 */
export function calculateRank(input: RankInput): RankResult {
  // Skor: 15.000 dianggap penampilan sempurna (maks 40 poin)
  const scorePoints = clampPoints((input.score / 15000) * 40, 40)
  // Combo terbaik: 25 beruntun sesuai target dokumen (maks 25 poin)
  const comboPoints = clampPoints((input.bestCombo / 25) * 25, 25)
  // Akurasi: tiap kesalahan memotong 4 poin dari 20
  const accuracyPoints = clampPoints(20 - input.wrongCount * 4, 20)
  // Ketepatan waktu: tiap sampah terlewat memotong 5 poin dari 15
  const timingPoints = clampPoints(15 - input.timeoutCount * 5, 15)

  const totalPoints =
    scorePoints + comboPoints + accuracyPoints + timingPoints
  const grade =
    GRADE_THRESHOLDS.find((threshold) => totalPoints >= threshold.min)?.grade ??
    'C'

  const totalSeconds = Math.round(input.elapsedMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return {
    grade,
    title: RANK_TITLES[grade],
    stars: RANK_STARS[grade],
    totalPoints,
    breakdown: [
      {
        label: 'Skor',
        value: input.score.toLocaleString('id-ID'),
        points: scorePoints,
      },
      { label: 'Combo Terbaik', value: `x${input.bestCombo}`, points: comboPoints },
      {
        label: 'Akurasi',
        value: `${input.wrongCount} salah`,
        points: accuracyPoints,
      },
      {
        label: 'Ketepatan Waktu',
        value: `${input.timeoutCount} terlewat · ${minutes}:${seconds}`,
        points: timingPoints,
      },
    ],
  }
}

export function isBetterRank(
  candidate: RankGrade,
  current: RankGrade | null,
): boolean {
  if (!current) {
    return true
  }
  const order: RankGrade[] = ['C', 'B', 'A', 'S']
  return order.indexOf(candidate) > order.indexOf(current)
}
