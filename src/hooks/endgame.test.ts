import { describe, expect, test } from 'vitest'
import {
  createInitialState,
  gameReducer,
  getBossDamage,
  getEffectiveTimeLimit,
  isFeverActive,
  BOSS_MAX_HP,
  BOSS_TIMEOUT_HEAL,
  CLUTCH_BONUS,
  FEVER_COMBO,
  RARE_BONUS,
  SCORE_CORRECT,
  STORM_LENGTH,
  TIMEOUT_CLEAN_PENALTY,
  type InternalState,
} from './gameReducer'
import { getLevelConfig, LEVELS } from '../data/trashData'
import type { TrashCategory, TrashItem } from '../types/game'

const plastik: TrashItem = {
  id: 'tes-botol',
  name: 'Botol Plastik',
  emoji: '🧴',
  category: 'plastik',
  description: 'Contoh sampah untuk pengujian.',
}

function answer(state: InternalState, category: TrashCategory): InternalState {
  return gameReducer(state, { type: 'ANSWER', category })
}

function next(state: InternalState, isRare = false): InternalState {
  return gameReducer(state, { type: 'NEXT_TRASH', fresh: plastik, isRare })
}

/** Membangun state pada level tertentu dengan mode & timer level itu */
function stateAtLevel(level: number, extra: Partial<InternalState> = {}) {
  const config = getLevelConfig(level)
  return {
    ...createInitialState(plastik),
    level,
    bossPhase: config.mode === 'boss' ? ('storm' as const) : null,
    timeLimitMs: config.timeLimitMs,
    timeLeftMs: config.timeLimitMs,
    ...extra,
  }
}

describe('konfigurasi level 6-7', () => {
  test('ada 7 level dengan mode yang sesuai', () => {
    expect(LEVELS).toHaveLength(7)
    expect(getLevelConfig(6).mode).toBe('chaos')
    expect(getLevelConfig(6).name).toBe('Chaos City')
    expect(getLevelConfig(7).mode).toBe('boss')
    expect(getLevelConfig(7).name).toBe('Final Guardian')
  })

  test('level endgame punya timer dan antrean, level klasik tidak', () => {
    expect(getLevelConfig(5).timeLimitMs).toBe(0)
    expect(getLevelConfig(5).queuePreview).toBe(0)
    expect(getLevelConfig(6).timeLimitMs).toBeGreaterThan(0)
    expect(getLevelConfig(6).queuePreview).toBe(2)
    // Level 7 lebih menekan daripada level 6
    expect(getLevelConfig(7).timeLimitMs).toBeLessThan(
      getLevelConfig(6).timeLimitMs,
    )
  })
})

describe('Eco Fever', () => {
  test('aktif mulai combo 10', () => {
    expect(isFeverActive(FEVER_COMBO - 1)).toBe(false)
    expect(isFeverActive(FEVER_COMBO)).toBe(true)
  })

  test('menggandakan perolehan skor', () => {
    const before = stateAtLevel(6, { combo: FEVER_COMBO - 1, score: 0 })
    const after = answer(before, 'plastik')
    expect(after.combo).toBe(FEVER_COMBO)
    // combo 10 memberi bonus 1000, lalu semuanya dikali 2
    expect(after.lastGained).toBe((SCORE_CORRECT + 1000) * 2)
  })
})

describe('timer & CLUTCH', () => {
  test('TICK mengurangi sisa waktu dan mencatat waktu bermain', () => {
    const state = gameReducer(stateAtLevel(6), { type: 'TICK', deltaMs: 500 })
    expect(state.timeLeftMs).toBe(getLevelConfig(6).timeLimitMs - 500)
    expect(state.elapsedMs).toBe(500)
  })

  test('waktu habis memicu timeout dan mengurangi Clean City', () => {
    const before = stateAtLevel(6, { cleanCity: 40, combo: 4, timeLeftMs: 100 })
    const after = gameReducer(before, { type: 'TICK', deltaMs: 200 })
    expect(after.lastAnswer).toBe('timeout')
    expect(after.timeoutCount).toBe(1)
    expect(after.combo).toBe(0)
    expect(after.cleanCity).toBe(40 - TIMEOUT_CLEAN_PENALTY)
    // Timeout tidak memotong nyawa — hanya progres kota
    expect(after.health).toBe(before.health)
  })

  test('Clean City tidak pernah negatif akibat timeout', () => {
    const after = gameReducer(stateAtLevel(6, { cleanCity: 2, timeLeftMs: 50 }), {
      type: 'TICK',
      deltaMs: 100,
    })
    expect(after.cleanCity).toBe(0)
  })

  test('jawaban benar di sisa waktu kritis memberi bonus CLUTCH', () => {
    const limit = getLevelConfig(6).timeLimitMs
    const clutch = answer(
      stateAtLevel(6, { timeLeftMs: limit * 0.1 }),
      'plastik',
    )
    expect(clutch.lastClutch).toBe(true)
    expect(clutch.lastGained).toBe(SCORE_CORRECT + CLUTCH_BONUS)

    const normal = answer(stateAtLevel(6, { timeLeftMs: limit }), 'plastik')
    expect(normal.lastClutch).toBe(false)
  })

  test('timer tidak berjalan saat feedback sedang tampil', () => {
    const paused = stateAtLevel(6, { lastAnswer: 'correct', timeLeftMs: 1000 })
    const after = gameReducer(paused, { type: 'TICK', deltaMs: 500 })
    expect(after.timeLeftMs).toBe(1000)
    expect(after.elapsedMs).toBe(500)
  })
})

describe('item langka', () => {
  test('memberi bonus 1000 saat dijawab benar', () => {
    const state = answer(stateAtLevel(6, { isRareTrash: true }), 'plastik')
    expect(state.lastGained).toBe(SCORE_CORRECT + RARE_BONUS)
  })
})

describe('antrean sampah', () => {
  test('sampah aktif diambil dari depan antrean, item baru masuk ke belakang', () => {
    const kardus: TrashItem = {
      id: 'kardus',
      name: 'Kardus',
      emoji: '📦',
      category: 'kertas',
      description: '',
    }
    const before = stateAtLevel(6, { upcoming: [kardus, plastik] })
    const after = next(before)
    expect(after.currentTrash?.id).toBe('kardus')
    expect(after.upcoming).toHaveLength(2)
    expect(after.upcoming[0].id).toBe(plastik.id)
  })

  test('mode klasik tetap tanpa antrean', () => {
    const after = next(createInitialState(plastik))
    expect(after.upcoming).toHaveLength(0)
    expect(after.currentTrash?.id).toBe(plastik.id)
  })
})

describe('event acak Chaos City', () => {
  test('hujan deras mempersingkat waktu, truk sampah melonggarkan', () => {
    const base = getLevelConfig(6).timeLimitMs
    expect(getEffectiveTimeLimit(6, 'hujan-deras')).toBeLessThan(base)
    expect(getEffectiveTimeLimit(6, 'truk-sampah')).toBeGreaterThan(base)
    expect(getEffectiveTimeLimit(6, null)).toBe(base)
  })

  test('warga membantu memberi perisai yang menahan satu reset combo', () => {
    const shielded = gameReducer(stateAtLevel(6, { combo: 7 }), {
      type: 'SET_EVENT',
      event: 'warga-membantu',
    })
    expect(shielded.hasComboShield).toBe(true)

    const afterWrong = answer(shielded, 'organik')
    expect(afterWrong.combo).toBe(7)
    expect(afterWrong.hasComboShield).toBe(false)
    // Perisai hanya menjaga combo — nyawa tetap berkurang
    expect(afterWrong.health).toBe(shielded.health - 1)

    const afterSecondWrong = answer(next(afterWrong), 'organik')
    expect(afterSecondWrong.combo).toBe(0)
  })
})

describe('Level 7 — boss battle', () => {
  test('damage meningkat seiring combo dan berlipat saat fever', () => {
    expect(getBossDamage(0, false)).toBe(5)
    expect(getBossDamage(5, false)).toBe(7)
    expect(getBossDamage(10, true)).toBe((5 + 4) * 2)
  })

  test('fase storm berpindah ke battle setelah badai dilalui', () => {
    let state = stateAtLevel(7)
    expect(state.bossPhase).toBe('storm')
    for (let i = 0; i < STORM_LENGTH; i++) {
      state = answer(state, 'plastik')
      state = next(state)
    }
    expect(state.stormRemaining).toBe(0)
    expect(state.bossPhase).toBe('battle')
  })

  test('jawaban benar mengurangi energi boss', () => {
    const state = answer(stateAtLevel(7, { bossPhase: 'battle' }), 'plastik')
    expect(state.bossHp).toBe(BOSS_MAX_HP - getBossDamage(1, false))
    expect(state.lastDamage).toBeGreaterThan(0)
  })

  test('timeout saat battle memulihkan energi boss', () => {
    const before = stateAtLevel(7, {
      bossPhase: 'battle',
      bossHp: 50,
      timeLeftMs: 50,
    })
    const after = gameReducer(before, { type: 'TICK', deltaMs: 100 })
    expect(after.bossHp).toBe(50 + BOSS_TIMEOUT_HEAL)
  })

  test('energi boss habis membuka fase Ultimate Decision', () => {
    const state = answer(
      stateAtLevel(7, { bossPhase: 'battle', bossHp: 5 }),
      'plastik',
    )
    expect(state.bossHp).toBe(0)
    expect(state.bossPhase).toBe('decision')
    // Belum menang — pemain masih harus memilih
    expect(state.status).toBe('playing')
  })

  test('input diabaikan selama fase keputusan', () => {
    const deciding = stateAtLevel(7, { bossPhase: 'decision', bossHp: 0 })
    expect(answer(deciding, 'plastik')).toBe(deciding)
  })

  test('keputusan terbaik memberi skor lebih besar dan memenangkan permainan', () => {
    const deciding = stateAtLevel(7, { bossPhase: 'decision', bossHp: 0 })
    const best = gameReducer(deciding, { type: 'DECIDE', isBest: true })
    const worst = gameReducer(deciding, { type: 'DECIDE', isBest: false })
    expect(best.status).toBe('won')
    expect(worst.status).toBe('won')
    expect(best.score).toBeGreaterThan(worst.score)
  })
})
