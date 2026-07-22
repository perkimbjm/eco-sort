import type { MasteryMode } from '../types/game'

// PHASE 28 — Mode Mastery, terbuka setelah menamatkan Level 7.
export const MASTERY_MODES: MasteryMode[] = [
  {
    id: 'speed',
    name: 'Speed Mode',
    emoji: '⚡',
    description: 'Bersihkan sampah secepat mungkin dalam 60 detik.',
    rule: 'Timer 2,5 detik per sampah · nyawa 3 · kejar skor tertinggi',
  },
  {
    id: 'endless',
    name: 'Endless Mode',
    emoji: '♾️',
    description: 'Sampah datang tanpa henti dan makin cepat. Sampai kapan kuat?',
    rule: 'Tanpa batas level · kecepatan meningkat tiap 10 sampah',
  },
  {
    id: 'perfect',
    name: 'Perfect Mode',
    emoji: '💎',
    description: 'Satu kesalahan saja, permainan berakhir.',
    rule: 'Nyawa 1 · tanpa ampun · hanya untuk Eco Master',
  },
]

export const MASTERY_TIME_LIMITS: Record<string, number> = {
  speed: 2500,
  endless: 5000,
  perfect: 5500,
}

export function getMasteryMode(id: string): MasteryMode | undefined {
  return MASTERY_MODES.find((mode) => mode.id === id)
}

/** Endless makin cepat tiap 10 sampah, dengan lantai 1,8 detik */
export function getEndlessTimeLimit(handled: number): number {
  const step = Math.floor(handled / 10)
  return Math.max(1800, MASTERY_TIME_LIMITS.endless - step * 400)
}
