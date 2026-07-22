import { useCallback, useEffect, useReducer } from 'react'
import type { GameState, TrashCategory, TrashItem } from '../types/game'
import { getLevelConfig, getTrashByCategories, LEVELS, BADGES } from '../data/trashData'
import {
  loadBadges,
  saveBadges,
  loadHighScore,
  saveHighScore,
} from '../utils/storage'
import { SESSION_STORAGE_KEY } from '../utils/profile'

export const MAX_HEALTH = 3
export const SCORE_CORRECT = 100
export const SCORE_WRONG_PENALTY = 20
export const CLEAN_PER_CORRECT = 5
const CORRECT_NEXT_DELAY_MS = 700
// Jeda lebih lama saat salah agar pemain sempat membaca edukasinya
const WRONG_NEXT_DELAY_MS = 2000

export function getLevelTarget(level: number): number {
  return 30 + level * 10
}

// Bonus combo: 3 → kecil, 5 → besar, 10 → jackpot, kelipatan 5 berikutnya tetap dihargai
export function getComboBonus(combo: number): number {
  if (combo === 3) return 100
  if (combo === 5) return 500
  if (combo === 10) return 1000
  if (combo > 10 && combo % 5 === 0) return 500
  return 0
}

export interface InternalState extends GameState {
  trashKey: number
  lastBonus: number
}

export type GameAction =
  | { type: 'ANSWER'; category: TrashCategory }
  | { type: 'NEXT_TRASH'; item: TrashItem }
  | { type: 'CONTINUE_LEVEL'; item: TrashItem }
  | { type: 'RESET'; item: TrashItem }

export function pickRandomTrash(level: number, excludeId?: string): TrashItem {
  const pool = getTrashByCategories(getLevelConfig(level).categories)
  const candidates =
    pool.length > 1 ? pool.filter((item) => item.id !== excludeId) : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export function createInitialState(item: TrashItem): InternalState {
  return {
    score: 0,
    level: 1,
    health: MAX_HEALTH,
    combo: 0,
    cleanCity: 0,
    currentTrash: item,
    status: 'playing',
    bestCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    lastAnswer: null,
    trashKey: 0,
    lastBonus: 0,
  }
}

function answerReducer(
  state: InternalState,
  category: TrashCategory,
): InternalState {
  if (state.status !== 'playing' || !state.currentTrash || state.lastAnswer) {
    return state
  }

  const isCorrect = state.currentTrash.category === category

  if (isCorrect) {
    const combo = state.combo + 1
    const bonus = getComboBonus(combo)
    const cleanCity = state.cleanCity + CLEAN_PER_CORRECT
    const isLevelDone = cleanCity >= getLevelTarget(state.level)
    const isLastLevel = state.level >= LEVELS.length

    return {
      ...state,
      score: state.score + SCORE_CORRECT + bonus,
      combo,
      bestCombo: Math.max(state.bestCombo, combo),
      cleanCity,
      correctCount: state.correctCount + 1,
      lastAnswer: 'correct',
      lastBonus: bonus,
      status: isLevelDone ? (isLastLevel ? 'won' : 'levelComplete') : 'playing',
    }
  }

  const health = state.health - 1

  return {
    ...state,
    score: Math.max(0, state.score - SCORE_WRONG_PENALTY),
    health,
    combo: 0,
    wrongCount: state.wrongCount + 1,
    lastAnswer: 'wrong',
    lastBonus: 0,
    status: health <= 0 ? 'gameOver' : 'playing',
  }
}

export function gameReducer(
  state: InternalState,
  action: GameAction,
): InternalState {
  switch (action.type) {
    case 'ANSWER':
      return answerReducer(state, action.category)
    case 'NEXT_TRASH':
      return {
        ...state,
        currentTrash: action.item,
        lastAnswer: null,
        lastBonus: 0,
        trashKey: state.trashKey + 1,
      }
    case 'CONTINUE_LEVEL':
      return {
        ...state,
        level: state.level + 1,
        health: MAX_HEALTH,
        cleanCity: 0,
        combo: 0,
        currentTrash: action.item,
        lastAnswer: null,
        lastBonus: 0,
        status: 'playing',
        trashKey: state.trashKey + 1,
      }
    case 'RESET':
      return createInitialState(action.item)
    default:
      return state
  }
}

// ---------- Simpan / lanjutkan sesi (PHASE 18) ----------

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
      return { ...parsed, lastAnswer: null, lastBonus: 0 }
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

  const checkAnswer = useCallback((category: TrashCategory) => {
    dispatch({ type: 'ANSWER', category })
  }, [])

  const nextTrash = useCallback(() => {
    dispatch({
      type: 'NEXT_TRASH',
      item: pickRandomTrash(state.level, state.currentTrash?.id),
    })
  }, [state.level, state.currentTrash])

  const continueToNextLevel = useCallback(() => {
    dispatch({
      type: 'CONTINUE_LEVEL',
      item: pickRandomTrash(state.level + 1),
    })
  }, [state.level])

  const resetGame = useCallback(() => {
    clearSavedSession()
    dispatch({ type: 'RESET', item: pickRandomTrash(1) })
  }, [])

  // Setelah jawaban dinilai, tampilkan sampah berikutnya dengan jeda animasi.
  // Jawaban salah diberi jeda lebih lama untuk membaca edukasi.
  useEffect(() => {
    if (!state.lastAnswer || state.status !== 'playing') {
      return
    }
    const delay =
      state.lastAnswer === 'wrong' ? WRONG_NEXT_DELAY_MS : CORRECT_NEXT_DELAY_MS
    const timer = setTimeout(() => {
      dispatch({
        type: 'NEXT_TRASH',
        item: pickRandomTrash(state.level, state.currentTrash?.id),
      })
    }, delay)
    return () => clearTimeout(timer)
  }, [state.lastAnswer, state.status, state.level, state.currentTrash])

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
    levelConfig: getLevelConfig(state.level),
    levelTarget: getLevelTarget(state.level),
    checkAnswer,
    nextTrash,
    continueToNextLevel,
    resetGame,
  }
}
