import type { Mission, TrashCategory } from '../types/game'
import { getCategoryInfo } from './trashData'

export const MISSION_REWARD_ECO_POINTS = 1000

const MISSION_CATEGORIES: TrashCategory[] = ['plastik', 'organik', 'kertas']

interface MissionTemplate {
  id: string
  build: () => Omit<Mission, 'progress' | 'isClaimed'>
}

// Hash sederhana yang deterministik dari string tanggal — supaya misi harian
// sama sepanjang hari tanpa perlu menyimpan seed.
function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function buildTemplates(dateSeed: number): MissionTemplate[] {
  const category = MISSION_CATEGORIES[dateSeed % MISSION_CATEGORIES.length]
  const categoryLabel = getCategoryInfo(category).label
  return [
    {
      id: 'sort-any',
      build: () => ({
        id: 'sort-any',
        type: 'sort_any',
        description: 'Pilah 20 sampah dengan benar',
        target: 20,
      }),
    },
    {
      id: 'sort-category',
      build: () => ({
        id: 'sort-category',
        type: 'sort_category',
        description: `Pilah 8 sampah ${categoryLabel} dengan benar`,
        category,
        target: 8,
      }),
    },
    {
      id: 'combo',
      build: () => ({
        id: 'combo',
        type: 'combo',
        description: 'Dapatkan combo 5 dalam satu permainan',
        target: 5,
      }),
    },
    {
      id: 'score',
      build: () => ({
        id: 'score',
        type: 'score',
        description: 'Raih 1500 skor dalam satu permainan',
        target: 1500,
      }),
    },
  ]
}

export function generateDailyMissions(date: string): Mission[] {
  const seed = hashString(date)
  const templates = buildTemplates(seed)
  const first = templates[seed % templates.length]
  const second = templates[(seed + 1) % templates.length]
  const picked = first.id === second.id ? [first] : [first, second]
  return picked.map((template) => ({
    ...template.build(),
    progress: 0,
    isClaimed: false,
  }))
}

export function todayString(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
