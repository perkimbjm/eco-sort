import type {
  GameEventId,
  GameState,
  MasteryModeId,
  TrashCategory,
  TrashItem,
} from '../types/game'
import { getLevelConfig, LEVELS } from '../data/trashData'
import { EVENT_TIME_MULTIPLIER } from '../data/endgame'
import { getEndlessTimeLimit, MASTERY_TIME_LIMITS } from '../data/mastery'

/** Durasi satu sesi Speed Mode */
export const SPEED_MODE_SESSION_MS = 60000

export const MAX_HEALTH = 3
export const SCORE_CORRECT = 100
export const SCORE_WRONG_PENALTY = 20
export const CLEAN_PER_CORRECT = 5

// ---- Level 6-7 ----
export const FEVER_COMBO = 10
export const FEVER_MULTIPLIER = 2
/** Jawaban benar di sisa waktu ≤ 15% dihitung sebagai CLUTCH */
export const CLUTCH_RATIO = 0.15
export const CLUTCH_BONUS = 500
export const RARE_CHANCE = 0.07
export const RARE_BONUS = 1000
export const TIMEOUT_CLEAN_PENALTY = 5
export const BOSS_MAX_HP = 100
export const BOSS_DAMAGE_BASE = 5
/** Timeout saat boss battle memulihkan energi Raja Sampah */
export const BOSS_TIMEOUT_HEAL = 3
export const STORM_LENGTH = 8
/** Event acak dipicu tiap sekian sampah terjawab di Chaos City */
export const EVENT_INTERVAL = 6

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

export function isFeverActive(combo: number): boolean {
  return combo >= FEVER_COMBO
}

/** Damage ke Raja Sampah meningkat seiring combo, berlipat saat Eco Fever */
export function getBossDamage(combo: number, isFever: boolean): number {
  const base = BOSS_DAMAGE_BASE + Math.floor(combo / 5) * 2
  return isFever ? base * FEVER_MULTIPLIER : base
}

/** Batas waktu efektif setelah dipengaruhi event yang sedang aktif */
export function getEffectiveTimeLimit(
  level: number,
  activeEvent: GameEventId | null,
): number {
  const base = getLevelConfig(level).timeLimitMs
  if (base === 0 || !activeEvent) {
    return base
  }
  return Math.round(base * EVENT_TIME_MULTIPLIER[activeEvent])
}

export interface InternalState extends GameState {
  trashKey: number
  /** Bagian bonus sebelum pengali Eco Fever, untuk rincian tampilan */
  lastBonus: number
  /** Total skor yang benar-benar ditambahkan pada jawaban terakhir */
  lastGained: number
  /** Mode Mastery yang sedang dimainkan; null = petualangan biasa */
  masteryMode: MasteryModeId | null
  /** Sisa waktu sesi untuk Speed Mode */
  sessionTimeLeftMs: number
}

export interface StartOptions {
  level?: number
  masteryMode?: MasteryModeId | null
}

export type GameAction =
  | { type: 'ANSWER'; category: TrashCategory }
  | { type: 'TICK'; deltaMs: number }
  | { type: 'NEXT_TRASH'; fresh: TrashItem; isRare: boolean }
  | { type: 'SET_EVENT'; event: GameEventId | null }
  | { type: 'DECIDE'; isBest: boolean }
  | { type: 'CONTINUE_LEVEL'; item: TrashItem; upcoming: TrashItem[] }
  | {
      type: 'RESET'
      item: TrashItem
      level?: number
      masteryMode?: MasteryModeId | null
    }

export function createInitialState(
  item: TrashItem,
  options: StartOptions = {},
): InternalState {
  const level = options.level ?? 1
  const mastery = options.masteryMode ?? null
  const config = getLevelConfig(level)
  // Mode Mastery memakai aturannya sendiri, bukan konfigurasi level
  const timeLimitMs = mastery
    ? MASTERY_TIME_LIMITS[mastery]
    : config.timeLimitMs
  const health = mastery === 'perfect' ? 1 : MAX_HEALTH

  return {
    score: 0,
    level,
    health,
    combo: 0,
    cleanCity: 0,
    currentTrash: item,
    status: 'playing',
    bestCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    lastAnswer: null,
    upcoming: [],
    isRareTrash: false,
    timeLeftMs: timeLimitMs,
    timeLimitMs,
    activeEvent: null,
    eventTurnsLeft: 0,
    hasComboShield: false,
    bossPhase: !mastery && config.mode === 'boss' ? 'storm' : null,
    bossHp: BOSS_MAX_HP,
    stormRemaining: STORM_LENGTH,
    lastClutch: false,
    lastDamage: 0,
    timeoutCount: 0,
    elapsedMs: 0,
    trashKey: 0,
    lastBonus: 0,
    lastGained: 0,
    masteryMode: mastery,
    sessionTimeLeftMs: mastery === 'speed' ? SPEED_MODE_SESSION_MS : 0,
  }
}

function canAnswer(state: InternalState): boolean {
  return (
    state.status === 'playing' &&
    state.currentTrash !== null &&
    state.lastAnswer === null &&
    state.bossPhase !== 'decision'
  )
}

/** Kemajuan fase boss setelah satu sampah selesai ditangani */
function advanceStorm(state: InternalState): Partial<InternalState> {
  if (state.bossPhase !== 'storm') {
    return {}
  }
  const stormRemaining = Math.max(0, state.stormRemaining - 1)
  return {
    stormRemaining,
    bossPhase: stormRemaining === 0 ? 'battle' : 'storm',
  }
}

function applyCorrect(state: InternalState): InternalState {
  const combo = state.combo + 1
  const isFever = isFeverActive(combo)
  const isClutch =
    state.timeLimitMs > 0 && state.timeLeftMs <= state.timeLimitMs * CLUTCH_RATIO

  const bonus =
    getComboBonus(combo) +
    (isClutch ? CLUTCH_BONUS : 0) +
    (state.isRareTrash ? RARE_BONUS : 0)
  const gained = Math.round(
    (SCORE_CORRECT + bonus) * (isFever ? FEVER_MULTIPLIER : 1),
  )

  const base: InternalState = {
    ...state,
    score: state.score + gained,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    correctCount: state.correctCount + 1,
    lastAnswer: 'correct',
    lastBonus: bonus,
    lastGained: gained,
    lastClutch: isClutch,
    eventTurnsLeft: Math.max(0, state.eventTurnsLeft - 1),
  }

  // ---- Mode boss: damage menggantikan progres Clean City ----
  if (state.bossPhase === 'battle') {
    const damage = getBossDamage(combo, isFever)
    const bossHp = Math.max(0, state.bossHp - damage)
    return {
      ...base,
      bossHp,
      lastDamage: damage,
      bossPhase: bossHp === 0 ? 'decision' : 'battle',
      cleanCity: bossHp === 0 ? getLevelTarget(state.level) : state.cleanCity,
    }
  }

  if (state.bossPhase === 'storm') {
    return { ...base, ...advanceStorm(base) }
  }

  const cleanCity = state.cleanCity + CLEAN_PER_CORRECT

  // ---- Mode Mastery: tidak ada penyelesaian level, main sampai gagal/waktu habis ----
  if (state.masteryMode) {
    return { ...base, cleanCity }
  }

  // ---- Mode classic & chaos ----
  const isLevelDone = cleanCity >= getLevelTarget(state.level)
  const isLastLevel = state.level >= LEVELS.length
  return {
    ...base,
    cleanCity,
    status: isLevelDone ? (isLastLevel ? 'won' : 'levelComplete') : 'playing',
  }
}

function applyWrong(state: InternalState): InternalState {
  const health = state.health - 1
  // Perisai "Warga Membantu" menahan satu reset combo
  const keepsCombo = state.hasComboShield

  const base: InternalState = {
    ...state,
    score: Math.max(0, state.score - SCORE_WRONG_PENALTY),
    health,
    combo: keepsCombo ? state.combo : 0,
    hasComboShield: false,
    wrongCount: state.wrongCount + 1,
    lastAnswer: 'wrong',
    lastBonus: 0,
    lastGained: -Math.min(state.score, SCORE_WRONG_PENALTY),
    lastClutch: false,
    lastDamage: 0,
    eventTurnsLeft: Math.max(0, state.eventTurnsLeft - 1),
    status: health <= 0 ? 'gameOver' : 'playing',
  }

  return state.bossPhase === 'storm' ? { ...base, ...advanceStorm(base) } : base
}

function applyTimeout(state: InternalState): InternalState {
  const keepsCombo = state.hasComboShield

  const base: InternalState = {
    ...state,
    combo: keepsCombo ? state.combo : 0,
    hasComboShield: false,
    timeoutCount: state.timeoutCount + 1,
    lastAnswer: 'timeout',
    lastBonus: 0,
    lastGained: 0,
    lastClutch: false,
    lastDamage: 0,
    timeLeftMs: 0,
    eventTurnsLeft: Math.max(0, state.eventTurnsLeft - 1),
  }

  // Saat boss battle, kelalaian memulihkan energi Raja Sampah
  if (state.bossPhase === 'battle') {
    return {
      ...base,
      bossHp: Math.min(BOSS_MAX_HP, state.bossHp + BOSS_TIMEOUT_HEAL),
    }
  }
  if (state.bossPhase === 'storm') {
    return { ...base, ...advanceStorm(base) }
  }
  // ⚠️ Sampah menumpuk — Clean City berkurang
  return {
    ...base,
    cleanCity: Math.max(0, state.cleanCity - TIMEOUT_CLEAN_PENALTY),
  }
}

function tickReducer(state: InternalState, deltaMs: number): InternalState {
  const elapsedMs = state.elapsedMs + deltaMs

  // Speed Mode: sesi berakhir saat waktu total habis
  if (state.masteryMode === 'speed' && state.status === 'playing') {
    const sessionTimeLeftMs = state.sessionTimeLeftMs - deltaMs
    if (sessionTimeLeftMs <= 0) {
      return {
        ...state,
        elapsedMs,
        sessionTimeLeftMs: 0,
        status: 'won',
        lastAnswer: null,
      }
    }
    state = { ...state, sessionTimeLeftMs }
  }

  const isTimerRunning =
    state.status === 'playing' &&
    state.timeLimitMs > 0 &&
    state.lastAnswer === null &&
    state.bossPhase !== 'decision'

  if (!isTimerRunning) {
    return { ...state, elapsedMs }
  }

  const timeLeftMs = state.timeLeftMs - deltaMs
  if (timeLeftMs > 0) {
    return { ...state, elapsedMs, timeLeftMs }
  }
  return applyTimeout({ ...state, elapsedMs, timeLeftMs: 0 })
}

/** Menyiapkan state untuk sampah berikutnya, termasuk reset timer */
function nextTrashReducer(
  state: InternalState,
  fresh: TrashItem,
  isRare: boolean,
): InternalState {
  const hasQueue = state.upcoming.length > 0
  const nextCurrent = hasQueue ? state.upcoming[0] : fresh
  const nextUpcoming = hasQueue ? [...state.upcoming.slice(1), fresh] : []

  // Event kedaluwarsa saat jatah gilirannya habis
  const activeEvent = state.eventTurnsLeft > 0 ? state.activeEvent : null
  // Endless Mode makin cepat seiring banyaknya sampah yang ditangani
  const handled = state.correctCount + state.wrongCount + state.timeoutCount
  const timeLimitMs = state.masteryMode
    ? state.masteryMode === 'endless'
      ? getEndlessTimeLimit(handled)
      : MASTERY_TIME_LIMITS[state.masteryMode]
    : getEffectiveTimeLimit(state.level, activeEvent)

  return {
    ...state,
    currentTrash: nextCurrent,
    upcoming: nextUpcoming,
    isRareTrash: isRare,
    activeEvent,
    timeLimitMs,
    timeLeftMs: timeLimitMs,
    lastAnswer: null,
    lastBonus: 0,
    lastGained: 0,
    lastClutch: false,
    lastDamage: 0,
    trashKey: state.trashKey + 1,
  }
}

function continueLevelReducer(
  state: InternalState,
  item: TrashItem,
  upcoming: TrashItem[],
): InternalState {
  const level = state.level + 1
  const config = getLevelConfig(level)
  const isBoss = config.mode === 'boss'

  return {
    ...state,
    level,
    health: MAX_HEALTH,
    cleanCity: 0,
    combo: 0,
    currentTrash: item,
    upcoming,
    isRareTrash: false,
    activeEvent: null,
    eventTurnsLeft: 0,
    hasComboShield: false,
    bossPhase: isBoss ? 'storm' : null,
    bossHp: BOSS_MAX_HP,
    stormRemaining: STORM_LENGTH,
    timeLimitMs: config.timeLimitMs,
    timeLeftMs: config.timeLimitMs,
    lastAnswer: null,
    lastBonus: 0,
    lastGained: 0,
    lastClutch: false,
    lastDamage: 0,
    status: 'playing',
    trashKey: state.trashKey + 1,
  }
}

export function gameReducer(
  state: InternalState,
  action: GameAction,
): InternalState {
  switch (action.type) {
    case 'ANSWER': {
      if (!canAnswer(state) || !state.currentTrash) {
        return state
      }
      return state.currentTrash.category === action.category
        ? applyCorrect(state)
        : applyWrong(state)
    }
    case 'TICK':
      return tickReducer(state, action.deltaMs)
    case 'NEXT_TRASH':
      return nextTrashReducer(state, action.fresh, action.isRare)
    case 'SET_EVENT': {
      if (!action.event) {
        return { ...state, activeEvent: null, eventTurnsLeft: 0 }
      }
      const isShield = action.event === 'warga-membantu'
      return {
        ...state,
        activeEvent: action.event,
        eventTurnsLeft: isShield ? 0 : 5,
        hasComboShield: isShield ? true : state.hasComboShield,
        timeLimitMs: getEffectiveTimeLimit(state.level, action.event),
      }
    }
    case 'DECIDE':
      return {
        ...state,
        status: 'won',
        cleanCity: getLevelTarget(state.level),
        // Pilihan terbaik memberi lonjakan pemulihan bumi
        score: state.score + (action.isBest ? 5000 : 1000),
      }
    case 'CONTINUE_LEVEL':
      return continueLevelReducer(state, action.item, action.upcoming)
    case 'RESET':
      return createInitialState(action.item, {
        level: action.level,
        masteryMode: action.masteryMode ?? null,
      })
    default:
      return state
  }
}
