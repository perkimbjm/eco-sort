import { describe, expect, test } from 'vitest'
import { processAnswer, processLevelComplete } from './progression'
import { createDefaultProfile, loadProfile } from './profile'
import {
  getAreaForLevel,
  getAreaProgress,
  isAreaUnlocked,
  WORLD_AREAS,
} from '../data/worlds'
import { COLLECTION_CARDS, getCollectionProgress } from '../data/collection'
import {
  COMPANIONS,
  getCompanionLevel,
  getCompanionScoreBonus,
} from '../data/companions'
import { findNewSecrets, SECRETS } from '../data/secrets'
import { getEndlessTimeLimit, MASTERY_MODES } from '../data/mastery'
import { createInitialState, gameReducer } from '../hooks/gameReducer'
import { TRASH_ITEMS, LEVELS } from '../data/trashData'
import type { Profile, TrashItem } from '../types/game'

// Vitest berjalan di Node tanpa DOM — sediakan localStorage seadanya
// agar jalur loadProfile() yang asli tetap bisa diuji.
function installLocalStorageStub(): void {
  const store = new Map<string, string>()
  const stub = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: stub,
    configurable: true,
    writable: true,
  })
}

installLocalStorageStub()

const plastik: TrashItem = {
  id: 'botol-plastik',
  name: 'Botol Plastik',
  emoji: '🧴',
  category: 'plastik',
  description: 'Contoh.',
}

function profileWith(overrides: Partial<Profile> = {}): Profile {
  return { ...createDefaultProfile(), ...overrides }
}

const correctEvent = {
  isCorrect: true,
  category: 'plastik' as const,
  comboAfter: 1,
  bonus: 0,
  sessionScore: 100,
}

describe('PHASE 21 — peta dunia', () => {
  test('setiap level 1-7 termasuk dalam tepat satu area', () => {
    for (const level of LEVELS.map((config) => config.level)) {
      const owners = WORLD_AREAS.filter((area) => area.levels.includes(level))
      expect(owners, `level ${level}`).toHaveLength(1)
    }
  })

  test('area terbuka mengikuti level tertinggi yang dicapai', () => {
    const tpa = WORLD_AREAS[WORLD_AREAS.length - 1]
    expect(isAreaUnlocked(tpa, 1)).toBe(false)
    expect(isAreaUnlocked(tpa, tpa.unlockAtLevel)).toBe(true)
    expect(isAreaUnlocked(WORLD_AREAS[0], 1)).toBe(true)
  })

  test('kemajuan area dihitung dari level yang sudah dilewati', () => {
    const kota = getAreaForLevel(1)
    expect(getAreaProgress(kota, 1)).toBe(0)
    expect(getAreaProgress(kota, 3)).toBe(100)
  })

  test('menuntaskan level menaikkan level tertinggi', () => {
    const { profile } = processLevelComplete(profileWith(), 3, 100)
    expect(profile.highestLevel).toBe(4)
    expect(profile.bestCityPercent).toBe(100)
  })

  test('level tertinggi tidak pernah turun', () => {
    const { profile } = processLevelComplete(
      profileWith({ highestLevel: 7 }),
      2,
      50,
    )
    expect(profile.highestLevel).toBe(7)
  })

  test('kemajuan lama tetap terbaca lewat badge saat memuat profil', () => {
    localStorage.setItem('eco-sort:badges', JSON.stringify(['eco-legend']))
    localStorage.setItem(
      'eco-sort:profile',
      JSON.stringify({ playerName: 'Lama', highestLevel: 1 }),
    )
    expect(loadProfile().highestLevel).toBeGreaterThanOrEqual(8)
    localStorage.clear()
  })
})

describe('PHASE 23 — koleksi kartu', () => {
  test('setiap kartu memetakan sampah yang benar-benar ada', () => {
    const trashIds = new Set(TRASH_ITEMS.map((item) => item.id))
    for (const card of COLLECTION_CARDS) {
      expect(trashIds.has(card.id), `kartu ${card.id}`).toBe(true)
      expect(card.fact.length).toBeGreaterThan(20)
    }
  })

  test('setiap sampah punya kartunya sendiri', () => {
    const cardIds = new Set(COLLECTION_CARDS.map((card) => card.id))
    for (const item of TRASH_ITEMS) {
      expect(cardIds.has(item.id), `sampah ${item.id}`).toBe(true)
    }
  })

  test('kartu terbuka saat sampahnya dipilah benar', () => {
    const { profile, toasts } = processAnswer(profileWith(), [], {
      ...correctEvent,
      trashId: 'botol-plastik',
    })
    expect(profile.collected).toContain('botol-plastik')
    expect(toasts.some((toast) => toast.title.includes('Kartu baru'))).toBe(true)
  })

  test('kartu tidak terbuka dua kali dan tidak terbuka saat salah', () => {
    const owned = profileWith({ collected: ['botol-plastik'] })
    const again = processAnswer(owned, [], {
      ...correctEvent,
      trashId: 'botol-plastik',
    })
    expect(again.profile.collected).toHaveLength(1)

    const wrong = processAnswer(profileWith(), [], {
      ...correctEvent,
      isCorrect: false,
      trashId: 'botol-plastik',
    })
    expect(wrong.profile.collected).toHaveLength(0)
  })

  test('progres koleksi dihitung benar', () => {
    const progress = getCollectionProgress(
      COLLECTION_CARDS.slice(0, 8).map((card) => card.id),
    )
    expect(progress.owned).toBe(8)
    expect(progress.total).toBe(COLLECTION_CARDS.length)
  })
})

describe('PHASE 25 — Eco Buddy', () => {
  test('companion terbuka setelah kartu mencukupi', () => {
    const teco = COMPANIONS[0]
    const collected = COLLECTION_CARDS.slice(0, teco.unlockAtCards - 1).map(
      (card) => card.id,
    )
    const { profile, toasts } = processAnswer(profileWith({ collected }), [], {
      ...correctEvent,
      trashId: COLLECTION_CARDS[teco.unlockAtCards - 1].id,
    })
    expect(profile.companions).toContain(teco.id)
    expect(profile.activeCompanion).toBe(teco.id)
    expect(toasts.some((toast) => toast.title.includes(teco.name))).toBe(true)
  })

  test('Teco hanya memberi bonus untuk sampah organik', () => {
    const teco = COMPANIONS[0]
    expect(getCompanionScoreBonus(teco, 0, true, 'organik')).toBe(50)
    expect(getCompanionScoreBonus(teco, 0, true, 'plastik')).toBe(0)
    expect(getCompanionScoreBonus(teco, 0, false, 'organik')).toBe(0)
  })

  test('bonus companion menguat seiring levelnya', () => {
    const bira = COMPANIONS[1]
    expect(getCompanionScoreBonus(bira, 0, true, 'plastik')).toBe(25)
    expect(getCompanionScoreBonus(bira, 1000, true, 'plastik')).toBe(75)
  })

  test('level companion dibatasi maksimum', () => {
    expect(getCompanionLevel(0)).toBe(1)
    expect(getCompanionLevel(500)).toBe(2)
    expect(getCompanionLevel(999999)).toBe(5)
  })

  test('companion aktif mendapat XP dan bonus Eco Point', () => {
    const bira = COMPANIONS[1]
    const { profile } = processAnswer(
      profileWith({ companions: [bira.id], activeCompanion: bira.id }),
      [],
      { ...correctEvent, gained: 100 },
    )
    expect(profile.companionXp[bira.id]).toBeGreaterThan(0)
    expect(profile.ecoPoints).toBe(100 + 25)
  })
})

describe('PHASE 26 — rahasia', () => {
  test('rahasia terbuka hanya saat syaratnya terpenuhi', () => {
    const none = findNewSecrets({
      profile: profileWith(),
      collectionTotal: COLLECTION_CARDS.length,
      maxCompanionLevel: 1,
    })
    expect(none).toHaveLength(0)

    const perfect = findNewSecrets({
      profile: profileWith({ bestRank: 'S' }),
      collectionTotal: COLLECTION_CARDS.length,
      maxCompanionLevel: 1,
    })
    expect(perfect.map((secret) => secret.id)).toContain('tanpa-cela')
  })

  test('rahasia yang sudah ditemukan tidak muncul lagi', () => {
    const found = findNewSecrets({
      profile: profileWith({ bestRank: 'S', secretsFound: ['tanpa-cela'] }),
      collectionTotal: COLLECTION_CARDS.length,
      maxCompanionLevel: 1,
    })
    expect(found.map((secret) => secret.id)).not.toContain('tanpa-cela')
  })

  test('setiap rahasia punya petunjuk yang tidak membocorkan isinya', () => {
    for (const secret of SECRETS) {
      expect(secret.hint.length).toBeGreaterThan(10)
      expect(secret.hint).not.toBe(secret.reveal)
    }
  })
})

describe('PHASE 28 — Mastery Mode', () => {
  test('Perfect Mode hanya memberi satu nyawa', () => {
    const state = createInitialState(plastik, { masteryMode: 'perfect' })
    expect(state.health).toBe(1)
    expect(state.masteryMode).toBe('perfect')
  })

  test('Speed Mode punya timer sesi dan berakhir saat habis', () => {
    const state = createInitialState(plastik, { masteryMode: 'speed' })
    expect(state.sessionTimeLeftMs).toBeGreaterThan(0)
    const ended = gameReducer(
      { ...state, sessionTimeLeftMs: 50 },
      { type: 'TICK', deltaMs: 100 },
    )
    expect(ended.status).toBe('won')
  })

  test('Mastery tidak menyelesaikan level meski Clean City penuh', () => {
    const state = {
      ...createInitialState(plastik, { masteryMode: 'endless' }),
      cleanCity: 999,
    }
    const after = gameReducer(state, { type: 'ANSWER', category: 'plastik' })
    expect(after.status).toBe('playing')
  })

  test('Endless makin cepat namun punya batas bawah', () => {
    expect(getEndlessTimeLimit(0)).toBeGreaterThan(getEndlessTimeLimit(30))
    expect(getEndlessTimeLimit(1000)).toBe(1800)
  })

  test('tiga mode mastery tersedia', () => {
    expect(MASTERY_MODES.map((mode) => mode.id)).toEqual([
      'speed',
      'endless',
      'perfect',
    ])
  })
})

describe('mulai dari level tertentu (Adventure Mode)', () => {
  test('memulai di level 6 langsung memakai konfigurasi chaos', () => {
    const state = createInitialState(plastik, { level: 6 })
    expect(state.level).toBe(6)
    expect(state.timeLimitMs).toBeGreaterThan(0)
    expect(state.bossPhase).toBe(null)
  })

  test('memulai di level 7 langsung masuk fase storm', () => {
    const state = createInitialState(plastik, { level: 7 })
    expect(state.bossPhase).toBe('storm')
  })
})
