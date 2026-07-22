import type { WorldArea } from '../types/game'

// PHASE 21 — Peta Eco World. Area dipetakan ke level yang sudah ada
// supaya progresi tetap satu jalur, bukan sistem paralel yang membingungkan.
export const WORLD_AREAS: WorldArea[] = [
  {
    id: 'kota-ceria',
    name: 'Kota Ceria',
    emoji: '🏠',
    levels: [1, 2],
    unlockAtLevel: 1,
    intro:
      'Kotamu mulai dipenuhi sampah. Sebagai Eco Ranger baru, saatnya belajar memilah plastik dan organik.',
    outro:
      'Warga Kota Ceria tersenyum lagi. Tapi kabar buruk datang dari arah sungai...',
    newCategories: ['plastik', 'organik', 'kertas'],
  },
  {
    id: 'sungai-bersih',
    name: 'Sungai Bersih',
    emoji: '🌊',
    levels: [3],
    unlockAtLevel: 3,
    intro:
      'Sungai tercekik botol plastik dan styrofoam. Ikan-ikan menghilang. Bersihkan alirannya!',
    outro:
      'Air sungai kembali jernih. Dari kejauhan, cerobong pabrik mengepul pekat...',
    newCategories: ['residu', 'logam'],
  },
  {
    id: 'kota-industri',
    name: 'Kawasan Industri',
    emoji: '🏭',
    levels: [4, 5],
    unlockAtLevel: 4,
    intro:
      'Limbah logam dan elektronik menumpuk di kawasan pabrik. Pilahan yang tepat menyelamatkan pekerja dan tanah.',
    outro:
      'Kawasan industri kini punya bank sampah. Namun ada tempat yang belum tersentuh...',
    newCategories: ['logam', 'b3'],
  },
  {
    id: 'tpa-misterius',
    name: 'TPA Misterius',
    emoji: '🗑️',
    levels: [6, 7],
    unlockAtLevel: 6,
    intro:
      'Gunung sampah menjulang. Di puncaknya, Raja Sampah menunggu. Ini ujian terakhirmu, Eco Ranger.',
    outro: 'Eco World terselamatkan. Bumi bernapas lega karena kamu.',
    newCategories: ['b3'],
  },
]

export function getAreaForLevel(level: number): WorldArea {
  return (
    WORLD_AREAS.find((area) => area.levels.includes(level)) ?? WORLD_AREAS[0]
  )
}

export function isAreaUnlocked(area: WorldArea, highestLevel: number): boolean {
  return highestLevel >= area.unlockAtLevel
}

/** Persentase penyelesaian area berdasarkan level tertinggi yang dicapai */
export function getAreaProgress(
  area: WorldArea,
  highestLevel: number,
): number {
  const cleared = area.levels.filter((level) => level < highestLevel).length
  return Math.round((cleared / area.levels.length) * 100)
}
