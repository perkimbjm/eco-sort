import { describe, expect, test } from 'vitest'
import {
  processAnswer,
  processGameEnd,
  processLevelComplete,
  XP_PER_CORRECT,
  XP_PER_LEVEL_COMPLETE,
} from './progression'
import { createDefaultProfile, getRangerLevel } from './profile'
import { generateDailyMissions, MISSION_REWARD_ECO_POINTS } from '../data/missions'
import { getCityStage } from '../data/cityStages'
import type { Mission, Profile } from '../types/game'

function baseProfile(overrides: Partial<Profile> = {}): Profile {
  return { ...createDefaultProfile(), ...overrides }
}

const correctEvent = {
  isCorrect: true,
  category: 'plastik' as const,
  comboAfter: 1,
  bonus: 0,
  sessionScore: 100,
}

describe('processAnswer', () => {
  test('jawaban benar menambah XP, Eco Point, dan statistik kategori', () => {
    const { profile } = processAnswer(baseProfile(), [], correctEvent)
    expect(profile.totalCorrect).toBe(1)
    expect(profile.xp).toBe(XP_PER_CORRECT)
    expect(profile.ecoPoints).toBe(100)
    expect(profile.categoryStats.plastik.correct).toBe(1)
  })

  test('jawaban salah hanya menambah statistik salah', () => {
    const { profile } = processAnswer(baseProfile(), [], {
      ...correctEvent,
      isCorrect: false,
      comboAfter: 0,
    })
    expect(profile.totalWrong).toBe(1)
    expect(profile.xp).toBe(0)
    expect(profile.ecoPoints).toBe(0)
    expect(profile.categoryStats.plastik.wrong).toBe(1)
  })

  test('bonus combo menambah XP milestone dan maxCombo tersimpan', () => {
    const { profile } = processAnswer(baseProfile(), [], {
      ...correctEvent,
      comboAfter: 5,
      bonus: 500,
    })
    expect(profile.maxCombo).toBe(5)
    expect(profile.xp).toBe(XP_PER_CORRECT + 50)
    expect(profile.ecoPoints).toBe(600)
  })

  test('achievement Pemula terbuka setelah 10 pilahan benar', () => {
    const { profile, toasts } = processAnswer(
      baseProfile({ totalCorrect: 9 }),
      [],
      correctEvent,
    )
    expect(profile.achievements).toContain('pemula')
    expect(toasts.some((toast) => toast.title.includes('Pemula'))).toBe(true)
  })

  test('misi selesai memberi reward 1000 Eco Point', () => {
    const mission: Mission = {
      id: 'sort-any',
      type: 'sort_any',
      description: 'Pilah 1 sampah',
      target: 1,
      progress: 0,
      isClaimed: false,
    }
    const result = processAnswer(baseProfile(), [mission], correctEvent)
    expect(result.missions[0].isClaimed).toBe(true)
    expect(result.profile.ecoPoints).toBe(100 + MISSION_REWARD_ECO_POINTS)
    expect(result.toasts.some((toast) => toast.title.includes('Misi'))).toBe(
      true,
    )
  })

  test('misi kategori hanya maju untuk kategori yang cocok', () => {
    const mission: Mission = {
      id: 'sort-category',
      type: 'sort_category',
      description: 'Pilah organik',
      category: 'organik',
      target: 5,
      progress: 0,
      isClaimed: false,
    }
    const result = processAnswer(baseProfile(), [mission], correctEvent)
    expect(result.missions[0].progress).toBe(0)
    const matched = processAnswer(baseProfile(), [mission], {
      ...correctEvent,
      category: 'organik',
    })
    expect(matched.missions[0].progress).toBe(1)
  })
})

describe('level & akhir permainan', () => {
  test('selesai level memberi 200 XP', () => {
    const { profile } = processLevelComplete(baseProfile())
    expect(profile.xp).toBe(XP_PER_LEVEL_COMPLETE)
  })

  test('menang membuka achievement Guardian Earth', () => {
    const { profile, toasts } = processGameEnd(baseProfile(), true)
    expect(profile.wins).toBe(1)
    expect(profile.achievements).toContain('guardian-earth')
    expect(toasts.some((toast) => toast.title.includes('Guardian'))).toBe(true)
  })

  test('kalah tetap menambah jumlah permainan', () => {
    const { profile } = processGameEnd(baseProfile(), false)
    expect(profile.gamesPlayed).toBe(1)
    expect(profile.wins).toBe(0)
  })
})

describe('level Eco Ranger', () => {
  test('naik level pada ambang XP kuadratik', () => {
    expect(getRangerLevel(0)).toBe(1)
    expect(getRangerLevel(99)).toBe(1)
    expect(getRangerLevel(100)).toBe(2)
    expect(getRangerLevel(400)).toBe(3)
    expect(getRangerLevel(1600)).toBe(5)
    expect(getRangerLevel(8100)).toBe(10)
  })
})

describe('city stage', () => {
  test('stage sesuai rentang persen rencana', () => {
    expect(getCityStage(0).name).toBe('Kota Tercemar')
    expect(getCityStage(19).name).toBe('Kota Tercemar')
    expect(getCityStage(20).name).toBe('Mulai Bersih')
    expect(getCityStage(40).name).toBe('Kota Hijau')
    expect(getCityStage(70).name).toBe('Eco City')
    expect(getCityStage(90).name).toBe('Perfect Environment')
    expect(getCityStage(100).name).toBe('Perfect Environment')
  })
})

describe('misi harian', () => {
  test('deterministik untuk tanggal yang sama dan berbeda antar hari', () => {
    const a = generateDailyMissions('2026-07-22')
    const b = generateDailyMissions('2026-07-22')
    expect(a).toEqual(b)
    expect(a.length).toBeGreaterThanOrEqual(1)
    expect(a.length).toBeLessThanOrEqual(2)
    for (const mission of a) {
      expect(mission.target).toBeGreaterThan(0)
      expect(mission.progress).toBe(0)
      expect(mission.isClaimed).toBe(false)
    }
  })
})
