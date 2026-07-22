import { describe, expect, test } from 'vitest'
import {
  CLEAN_PER_CORRECT,
  createInitialState,
  gameReducer,
  getLevelTarget,
  MAX_HEALTH,
  pickRandomTrash,
  SCORE_CORRECT,
  SCORE_WRONG_PENALTY,
  type InternalState,
} from './useGame'
import {
  CATEGORIES,
  getLevelConfig,
  LEVELS,
  TRASH_ITEMS,
} from '../data/trashData'
import type { TrashCategory, TrashItem } from '../types/game'

const sampleTrash: TrashItem = {
  id: 'tes-botol',
  name: 'Botol Plastik',
  emoji: '🧴',
  category: 'plastik',
  description: 'Contoh sampah untuk pengujian.',
}

function freshState(): InternalState {
  return createInitialState(sampleTrash)
}

function answer(state: InternalState, category: TrashCategory): InternalState {
  return gameReducer(state, { type: 'ANSWER', category })
}

function answerCorrectThenNext(state: InternalState): InternalState {
  const afterAnswer = answer(state, state.currentTrash!.category)
  if (afterAnswer.status !== 'playing') {
    return afterAnswer
  }
  return gameReducer(afterAnswer, { type: 'NEXT_TRASH', item: sampleTrash })
}

describe('data sampah', () => {
  test('minimal 25 sampah dan semua kategori terisi', () => {
    expect(TRASH_ITEMS.length).toBeGreaterThanOrEqual(25)
    for (const category of CATEGORIES) {
      const count = TRASH_ITEMS.filter(
        (item) => item.category === category.id,
      ).length
      expect(count, `kategori ${category.id}`).toBeGreaterThan(0)
    }
  })

  test('tidak ada typo kategori dan id unik', () => {
    const validIds = new Set(CATEGORIES.map((category) => category.id))
    const seen = new Set<string>()
    for (const item of TRASH_ITEMS) {
      expect(validIds.has(item.category), `${item.id}: ${item.category}`).toBe(
        true,
      )
      expect(seen.has(item.id), `id duplikat: ${item.id}`).toBe(false)
      seen.add(item.id)
    }
  })

  test('level 1-5 punya kategori sesuai rencana', () => {
    expect(LEVELS).toHaveLength(5)
    expect(getLevelConfig(1).categories).toEqual(['plastik', 'organik'])
    expect(getLevelConfig(2).categories).toContain('kertas')
    expect(getLevelConfig(3).categories).toEqual(
      expect.arrayContaining(['residu', 'logam']),
    )
    expect(getLevelConfig(4).categories).toContain('b3')
    expect(getLevelConfig(5).categories).toHaveLength(6)
  })

  test('pickRandomTrash hanya mengambil dari kategori level & tidak mengulang item sebelumnya', () => {
    for (let i = 0; i < 50; i++) {
      const item = pickRandomTrash(1, 'daun-kering')
      expect(getLevelConfig(1).categories).toContain(item.category)
      expect(item.id).not.toBe('daun-kering')
    }
  })
})

describe('aturan skor', () => {
  test('jawaban benar: skor +100, combo +1, cleanCity +5', () => {
    const next = answer(freshState(), 'plastik')
    expect(next.score).toBe(SCORE_CORRECT)
    expect(next.combo).toBe(1)
    expect(next.cleanCity).toBe(CLEAN_PER_CORRECT)
    expect(next.lastAnswer).toBe('correct')
    expect(next.health).toBe(MAX_HEALTH)
  })

  test('jawaban salah: skor -20, health -1, combo reset', () => {
    let state = answerCorrectThenNext(freshState())
    state = answerCorrectThenNext(state)
    const next = answer(state, 'organik')
    expect(next.score).toBe(SCORE_CORRECT * 2 - SCORE_WRONG_PENALTY)
    expect(next.health).toBe(MAX_HEALTH - 1)
    expect(next.combo).toBe(0)
    expect(next.lastAnswer).toBe('wrong')
  })

  test('skor tidak pernah negatif', () => {
    const next = answer(freshState(), 'organik')
    expect(next.score).toBe(0)
  })

  test('skenario: jawaban benar 5 kali berturut-turut', () => {
    let state = freshState()
    for (let i = 0; i < 5; i++) {
      state = answerCorrectThenNext(state)
    }
    expect(state.score).toBe(SCORE_CORRECT * 5)
    expect(state.combo).toBe(5)
    expect(state.bestCombo).toBe(5)
    expect(state.cleanCity).toBe(CLEAN_PER_CORRECT * 5)
    expect(state.status).toBe('playing')
  })

  test('input diabaikan saat feedback masih tampil', () => {
    const afterAnswer = answer(freshState(), 'plastik')
    const doubleClick = answer(afterAnswer, 'plastik')
    expect(doubleClick).toBe(afterAnswer)
  })
})

describe('skenario: jawaban salah sampai game over', () => {
  test('health habis memicu status gameOver', () => {
    let state = freshState()
    for (let i = 0; i < MAX_HEALTH; i++) {
      expect(state.status).toBe('playing')
      state = answer(state, 'organik')
      if (state.status === 'playing') {
        state = gameReducer(state, { type: 'NEXT_TRASH', item: sampleTrash })
      }
    }
    expect(state.health).toBe(0)
    expect(state.status).toBe('gameOver')
  })

  test('input diabaikan setelah game over', () => {
    let state = freshState()
    for (let i = 0; i < MAX_HEALTH; i++) {
      state = answer(state, 'organik')
      if (state.status === 'playing') {
        state = gameReducer(state, { type: 'NEXT_TRASH', item: sampleTrash })
      }
    }
    expect(answer(state, 'plastik')).toBe(state)
  })
})

describe('skenario: semua level selesai', () => {
  test('level naik otomatis sampai menang di level 5', () => {
    let state = freshState()
    for (let level = 1; level <= 5; level++) {
      expect(state.level).toBe(level)
      const answersNeeded = Math.ceil(getLevelTarget(level) / CLEAN_PER_CORRECT)
      for (let i = 0; i < answersNeeded; i++) {
        state = answerCorrectThenNext(state)
      }
      if (level < 5) {
        expect(state.status).toBe('levelComplete')
        state = gameReducer(state, {
          type: 'CONTINUE_LEVEL',
          item: sampleTrash,
        })
        expect(state.cleanCity).toBe(0)
        expect(state.health).toBe(MAX_HEALTH)
        expect(state.status).toBe('playing')
      }
    }
    expect(state.status).toBe('won')
    expect(state.level).toBe(5)
  })

  test('reset mengembalikan permainan ke kondisi awal', () => {
    let state = answerCorrectThenNext(freshState())
    state = gameReducer(state, { type: 'RESET', item: sampleTrash })
    expect(state.score).toBe(0)
    expect(state.level).toBe(1)
    expect(state.health).toBe(MAX_HEALTH)
    expect(state.cleanCity).toBe(0)
    expect(state.status).toBe('playing')
  })
})
