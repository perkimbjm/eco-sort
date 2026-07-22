import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { GameEventId, TrashCategory, TrashItem } from '../types/game'
import {
  getLevelConfig,
  getTrashByCategories,
  BADGES,
} from '../data/trashData'
import { GAME_EVENTS } from '../data/endgame'
import {
  loadBadges,
  saveBadges,
  loadHighScore,
  saveHighScore,
} from '../utils/storage'
import { SESSION_STORAGE_KEY } from '../utils/profile'
import {
  createInitialState,
  gameReducer,
  getLevelTarget,
  EVENT_INTERVAL,
  RARE_CHANCE,
  type InternalState,
} from './gameReducer'

// Diekspor ulang agar komponen & test lama tetap mengimpor dari sini
export {
  MAX_HEALTH,
  SCORE_CORRECT,
  SCORE_WRONG_PENALTY,
  CLEAN_PER_CORRECT,
  FEVER_COMBO,
  FEVER_MULTIPLIER,
  CLUTCH_BONUS,
  RARE_BONUS,
  BOSS_MAX_HP,
  STORM_LENGTH,
  getLevelTarget,
  getComboBonus,
  getBossDamage,
  isFeverActive,
  createInitialState,
  gameReducer,
  type InternalState,
  type GameAction,
} from './gameReducer'

const CORRECT_NEXT_DELAY_MS = 700
// Jeda lebih lama saat salah/terlewat agar pemain sempat membaca edukasinya
const WRONG_NEXT_DELAY_MS = 2000
const TIMEOUT_NEXT_DELAY_MS = 1600
const TICK_MS = 100

export function pickRandomTrash(level: number, excludeId?: string): TrashItem {
  const pool = getTrashByCategories(getLevelConfig(level).categories)
  const candidates =
    pool.length > 1 ? pool.filter((item) => item.id !== excludeId) : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

/** Menyiapkan sampah aktif beserta antrean pratinjau sesuai mode level */
export function buildLevelQueue(level: number): {
  item: TrashItem
  upcoming: TrashItem[]
} {
  const config = getLevelConfig(level)
  const item = pickRandomTrash(level)
  const upcoming = Array.from({ length: config.queuePreview }, () =>
    pickRandomTrash(level),
  )
  return { item, upcoming }
}

function rollRareTrash(level: number): boolean {
  // Item langka hanya muncul di level endgame agar terasa istimewa
  return getLevelConfig(level).mode !== 'classic' && Math.random() < RARE_CHANCE
}

function pickRandomEvent(): GameEventId {
  return GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)].id
}

// ---------- Simpan / lanjutkan sesi ----------

export function loadSavedSession(): InternalState | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as InternalState
    if (
      parsed &&
      typeof parsed.level === 'number' &&
      parsed.currentTrash &&
      (parsed.status === 'playing' || parsed.status === 'levelComplete')
    ) {
      // Buang feedback yang sedang berjalan agar tidak macet setelah refresh
      return {
        ...createInitialState(parsed.currentTrash),
        ...parsed,
        lastAnswer: null,
        lastBonus: 0,
        lastGained: 0,
        lastClutch: false,
        lastDamage: 0,
        // Beri waktu penuh lagi supaya tidak langsung timeout saat dibuka
        timeLeftMs: parsed.timeLimitMs ?? 0,
      }
    }
    return null
  } catch {
    return null
  }
}

export function hasSavedSession(): boolean {
  return loadSavedSession() !== null
}

function persistSession(state: InternalState): void {
  try {
    if (state.status === 'playing' || state.status === 'levelComplete') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state))
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  } catch {
    // Penyimpanan diblokir — sesi tidak tersimpan
  }
}

export function clearSavedSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // Abaikan
  }
}

interface UseGameOptions {
  shouldResume?: boolean
}

export function useGame(options?: UseGameOptions) {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    if (options?.shouldResume) {
      const saved = loadSavedSession()
      if (saved) {
        return saved
      }
    }
    return createInitialState(pickRandomTrash(1))
  })

  const levelConfig = getLevelConfig(state.level)

  const checkAnswer = useCallback((category: TrashCategory) => {
    dispatch({ type: 'ANSWER', category })
  }, [])

  const decide = useCallback((isBest: boolean) => {
    dispatch({ type: 'DECIDE', isBest })
  }, [])

  const continueToNextLevel = useCallback(() => {
    const nextLevel = state.level + 1
    const { item, upcoming } = buildLevelQueue(nextLevel)
    dispatch({ type: 'CONTINUE_LEVEL', item, upcoming })
  }, [state.level])

  const resetGame = useCallback(() => {
    clearSavedSession()
    dispatch({ type: 'RESET', item: pickRandomTrash(1) })
  }, [])

  // Timer mundur untuk mode chaos & boss
  useEffect(() => {
    if (levelConfig.timeLimitMs === 0 || state.status !== 'playing') {
      return
    }
    const timer = setInterval(() => {
      dispatch({ type: 'TICK', deltaMs: TICK_MS })
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [levelConfig.timeLimitMs, state.status])

  // Setelah jawaban dinilai, tampilkan sampah berikutnya dengan jeda animasi
  useEffect(() => {
    if (!state.lastAnswer || state.status !== 'playing') {
      return
    }
    const delay =
      state.lastAnswer === 'correct'
        ? CORRECT_NEXT_DELAY_MS
        : state.lastAnswer === 'timeout'
          ? TIMEOUT_NEXT_DELAY_MS
          : WRONG_NEXT_DELAY_MS
    const timer = setTimeout(() => {
      dispatch({
        type: 'NEXT_TRASH',
        fresh: pickRandomTrash(state.level, state.currentTrash?.id),
        isRare: rollRareTrash(state.level),
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [state.lastAnswer, state.status, state.level, state.currentTrash])

  // Event acak Chaos City tiap beberapa sampah terjawab
  const lastEventAt = useRef(0)
  useEffect(() => {
    if (levelConfig.mode !== 'chaos' || state.status !== 'playing') {
      return
    }
    const handled = state.correctCount + state.wrongCount + state.timeoutCount
    if (handled > 0 && handled % EVENT_INTERVAL === 0 && handled !== lastEventAt.current) {
      lastEventAt.current = handled
      dispatch({ type: 'SET_EVENT', event: pickRandomEvent() })
    }
  }, [
    levelConfig.mode,
    state.status,
    state.correctCount,
    state.wrongCount,
    state.timeoutCount,
  ])

  // Simpan sesi berjalan agar refresh tidak mereset progres
  useEffect(() => {
    persistSession(state)
  }, [state])

  // Simpan badge saat level selesai dan high score saat permainan berakhir
  useEffect(() => {
    if (state.status === 'levelComplete' || state.status === 'won') {
      const earned = BADGES.filter(
        (badge) => badge.unlockLevel <= state.level,
      ).map((badge) => badge.id)
      const existing = loadBadges()
      const merged = [...new Set([...existing, ...earned])]
      if (merged.length !== existing.length) {
        saveBadges(merged)
      }
    }
    if (state.status !== 'playing' && state.score > loadHighScore()) {
      saveHighScore(state.score)
    }
  }, [state.status, state.level, state.score])

  return {
    state,
    levelConfig,
    levelTarget: getLevelTarget(state.level),
    checkAnswer,
    decide,
    continueToNextLevel,
    resetGame,
  }
}
