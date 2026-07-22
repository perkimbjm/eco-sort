import type { DecisionOption, GameEvent, GameEventId } from '../types/game'

// ---------- Event acak Chaos City (Level 6) ----------

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'hujan-deras',
    name: 'Hujan Deras',
    emoji: '🌧️',
    description: 'Sampah berdatangan lebih cepat! Waktu memilih dipersingkat.',
    turns: 5,
  },
  {
    id: 'truk-sampah',
    name: 'Truk Sampah Datang',
    emoji: '🚛',
    description: 'Bantuan tiba! Waktu memilih jadi lebih longgar.',
    turns: 5,
  },
  {
    id: 'warga-membantu',
    name: 'Warga Membantu',
    emoji: '🤝',
    description: 'Warga menjaga combo-mu! Satu kesalahan tidak mereset combo.',
    turns: 0,
  },
]

/** Pengali batas waktu saat event tertentu aktif */
export const EVENT_TIME_MULTIPLIER: Record<GameEventId, number> = {
  'hujan-deras': 0.65,
  'truk-sampah': 1.5,
  'warga-membantu': 1,
}

export function getGameEvent(id: GameEventId): GameEvent {
  const found = GAME_EVENTS.find((event) => event.id === id)
  if (!found) {
    throw new Error(`Event tidak dikenal: ${id}`)
  }
  return found
}

// ---------- Fase 3: Ultimate Decision (Level 7) ----------

export const DECISION_PROMPT =
  'Raja Sampah terdesak dan menawarkan jalan pintas. Apa keputusanmu untuk bumi?'

export const DECISION_OPTIONS: DecisionOption[] = [
  {
    id: 'bakar',
    label: 'A',
    text: 'Membakar semua sampah',
    isBest: false,
    explanation:
      'Membakar sampah terbuka melepas dioksin dan partikel beracun yang merusak paru-paru serta memperparah krisis iklim. Bukan solusi.',
  },
  {
    id: 'daur-ulang',
    label: 'B',
    text: 'Daur ulang dan kurangi sampah',
    isBest: true,
    explanation:
      'Tepat! Prinsip 3R — Reduce, Reuse, Recycle — memutus rantai sampah dari sumbernya. Sampah berkurang, sumber daya terselamatkan.',
  },
  {
    id: 'sungai',
    label: 'C',
    text: 'Buang ke sungai',
    isBest: false,
    explanation:
      'Sampah di sungai mencemari air minum, membunuh biota, dan berakhir sebagai mikroplastik di laut yang kembali ke piring kita.',
  },
]

// ---------- Kemampuan yang terbuka ----------

export const UNLOCK_SPEED_SORTING = 'speed-sorting'
export const UNLOCK_NEW_GAME_PLUS = 'new-game-plus'

export const UNLOCK_LABELS: Record<string, { name: string; emoji: string }> = {
  [UNLOCK_SPEED_SORTING]: { name: 'Speed Sorting Ability', emoji: '⚡' },
  [UNLOCK_NEW_GAME_PLUS]: { name: 'New Game+ · Eco Master Mode', emoji: '🌟' },
}
