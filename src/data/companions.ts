import type { Companion } from '../types/game'

// PHASE 25 — Eco Buddy. Dibuka lewat koleksi kartu agar dua sistem saling menopang.
export const COMPANIONS: Companion[] = [
  {
    id: 'teco',
    name: 'Teco Turtle',
    emoji: '🐢',
    skill: 'organic_bonus',
    skillLabel: 'Sahabat Kompos',
    description:
      'Sampah organik yang dipilah benar memberi +50 Eco Point per level Teco.',
    unlockAtCards: 5,
  },
  {
    id: 'bira',
    name: 'Bira Bird',
    emoji: '🐦',
    skill: 'score_bonus',
    skillLabel: 'Sayap Keberuntungan',
    description:
      'Setiap jawaban benar memberi +25 Eco Point per level Bira.',
    unlockAtCards: 12,
  },
  {
    id: 'cico',
    name: 'Cico Cat',
    emoji: '🐱',
    skill: 'combo_guard',
    skillLabel: 'Refleks Kucing',
    description:
      'Combo bertahan sekali saat kamu salah, sekali per level. Ceroboh sedikit tidak apa-apa.',
    unlockAtCards: 20,
  },
]

/** Level companion naik tiap 500 XP, maksimum 5 */
export const COMPANION_XP_PER_LEVEL = 500
export const COMPANION_MAX_LEVEL = 5

export function getCompanion(id: string): Companion | undefined {
  return COMPANIONS.find((companion) => companion.id === id)
}

export function getCompanionLevel(xp: number): number {
  return Math.min(
    COMPANION_MAX_LEVEL,
    Math.floor(Math.max(0, xp) / COMPANION_XP_PER_LEVEL) + 1,
  )
}

/**
 * Bonus skor dari companion. Efeknya menguat seiring level companion
 * supaya memakai satu buddy secara konsisten terasa berkembang.
 */
export function getCompanionScoreBonus(
  companion: Companion | undefined,
  xp: number,
  isCorrect: boolean,
  category: string,
): number {
  if (!companion || !isCorrect) {
    return 0
  }
  const level = getCompanionLevel(xp)
  if (companion.skill === 'organic_bonus' && category === 'organik') {
    return 50 * level
  }
  if (companion.skill === 'score_bonus') {
    return 25 * level
  }
  return 0
}
