import { useCallback, useEffect, useReducer } from 'react'
import type { GameState, TrashCategory, TrashItem } from '../types/game'
import { getLevelConfig, getTrashByCategories, LEVELS } from '../data/trashData'
import { loadBadges, saveBadges, loadHighScore, saveHighScore } from '../utils/storage'
import { BADGES } from '../data/trashData'

export const MAX_HEALTH = 3
export const SCORE_CORRECT = 100
export const SCORE_WRONG_PENALTY = 20
export const CLEAN_PER_CORRECT = 5
const NEXT_TRASH_DELAY_MS = 700

export function getLevelTarget(level: number): number {
  return 30 + level * 10
}

export interface InternalState extends GameState {
  trashKey: number
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
    const cleanCity = state.cleanCity + CLEAN_PER_CORRECT
    const isLevelDone = cleanCity >= getLevelTarget(state.level)
    const isLastLevel = state.level >= LEVELS.length

    return {
      ...state,
      score: state.score + SCORE_CORRECT,
      combo,
      bestCombo: Math.max(state.bestCombo, combo),
      cleanCity,
      correctCount: state.correctCount + 1,
      lastAnswer: 'correct',
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
        status: 'playing',
        trashKey: state.trashKey + 1,
      }
    case 'RESET':
      return createInitialState(action.item)
    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => createInitialState(pickRandomTrash(1)),
  )

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
    dispatch({ type: 'RESET', item: pickRandomTrash(1) })
  }, [])

  // Setelah jawaban dinilai, tampilkan sampah berikutnya dengan jeda animasi
  useEffect(() => {
    if (!state.lastAnswer || state.status !== 'playing') {
      return
    }
    const timer = setTimeout(() => {
      dispatch({
        type: 'NEXT_TRASH',
        item: pickRandomTrash(state.level, state.currentTrash?.id),
      })
    }, NEXT_TRASH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [state.lastAnswer, state.status, state.level, state.currentTrash])

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
