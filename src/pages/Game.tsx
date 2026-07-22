import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame, FEVER_COMBO, isFeverActive } from '../hooks/useGame'
import { useProfile } from '../hooks/useProfile'
import { useToasts } from '../hooks/useToasts'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { CATEGORIES, getCategoryInfo } from '../data/trashData'
import { getCityStage } from '../data/cityStages'
import {
  UNLOCK_NEW_GAME_PLUS,
  UNLOCK_SPEED_SORTING,
} from '../data/endgame'
import { playSound } from '../utils/sound'
import { selectMusicTrack } from '../utils/music'
import { getUnlockedItems } from '../utils/profile'
import { calculateRank } from '../utils/ranking'
import { GameHeader } from '../components/GameHeader'
import { ScoreBoard } from '../components/ScoreBoard'
import { HealthBar } from '../components/HealthBar'
import { CityProgress } from '../components/CityProgress'
import { TrashCard } from '../components/TrashCard'
import { CategoryButton } from '../components/CategoryButton'
import { LevelCompleteModal } from '../components/LevelCompleteModal'
import { FloatingReward } from '../components/FloatingReward'
import { ToastStack } from '../components/Toasts'
import { TimerBar } from '../components/TimerBar'
import { TrashQueue } from '../components/TrashQueue'
import { BossPanel } from '../components/BossPanel'
import { EventBanner } from '../components/EventBanner'
import { FeverOverlay } from '../components/FeverOverlay'
import { DecisionPanel } from '../components/DecisionPanel'

const CITY_UPGRADE_REWARD = 50

interface GameProps {
  shouldResume: boolean
  onExit: () => void
}

export function Game({ shouldResume, onExit }: GameProps) {
  const {
    state,
    levelConfig,
    levelTarget,
    checkAnswer,
    decide,
    continueToNextLevel,
    resetGame,
  } = useGame({ shouldResume })
  const {
    profile,
    recordAnswer,
    recordLevelComplete,
    recordGameEnd,
    addEcoPoints,
    unlockAbility,
    recordRank,
    toggleMuted,
  } = useProfile()
  const { toasts, pushToasts } = useToasts()

  const activeCategories = CATEGORIES.filter((category) =>
    levelConfig.categories.includes(category.id),
  )
  const percent = Math.min(100, Math.round((state.cleanCity / levelTarget) * 100))
  const stage = getCityStage(percent)
  const isMuted = profile.isMuted
  const unlockedItems = getUnlockedItems(profile.xp)
  const isFever = isFeverActive(state.combo)
  const isDeciding = state.bossPhase === 'decision' && state.status === 'playing'

  // Eco Fever memakai track combo agar musiknya terasa "meningkat"
  useBackgroundMusic(
    selectMusicTrack(state.status, state.combo, state.level),
    isMuted,
  )

  const rankResult =
    state.status === 'won' && levelConfig.mode === 'boss'
      ? calculateRank({
          score: state.score,
          bestCombo: state.bestCombo,
          wrongCount: state.wrongCount,
          timeoutCount: state.timeoutCount,
          elapsedMs: state.elapsedMs,
        })
      : null

  // ----- proses event gameplay ke sistem progression (sekali per jawaban) -----
  const processedAnswers = useRef(
    state.correctCount + state.wrongCount + state.timeoutCount,
  )
  useEffect(() => {
    const handled = state.correctCount + state.wrongCount + state.timeoutCount
    if (
      !state.lastAnswer ||
      !state.currentTrash ||
      handled === processedAnswers.current
    ) {
      return
    }
    processedAnswers.current = handled
    playSound(state.lastAnswer === 'correct' ? 'correct' : 'wrong', isMuted)
    pushToasts(
      recordAnswer({
        isCorrect: state.lastAnswer === 'correct',
        category: state.currentTrash.category,
        comboAfter: state.combo,
        bonus: state.lastBonus,
        gained: Math.max(0, state.lastGained),
        sessionScore: state.score,
      }),
    )
  }, [state, isMuted, recordAnswer, pushToasts])

  // ----- Eco Fever: umumkan sekali saat menyala -----
  const wasFever = useRef(isFever)
  useEffect(() => {
    if (isFever && !wasFever.current) {
      pushToasts([
        {
          emoji: '🔥',
          title: 'ECO FEVER AKTIF!',
          subtitle: `Combo ${FEVER_COMBO}+ · semua poin dikali 2`,
        },
      ])
    }
    wasFever.current = isFever
  }, [isFever, pushToasts])

  // ----- CLUTCH & item langka -----
  const clutchKey = useRef(state.trashKey)
  useEffect(() => {
    if (state.lastClutch && clutchKey.current !== state.trashKey) {
      clutchKey.current = state.trashKey
      pushToasts([
        {
          emoji: '⚡',
          title: 'CLUTCH!',
          subtitle: 'Diselamatkan di detik terakhir · +500 bonus',
        },
      ])
    }
  }, [state.lastClutch, state.trashKey, pushToasts])

  // ----- event acak Chaos City -----
  const announcedEvent = useRef<string | null>(null)
  useEffect(() => {
    if (state.activeEvent && announcedEvent.current !== state.activeEvent) {
      announcedEvent.current = state.activeEvent
      playSound('levelUp', isMuted)
    }
    if (!state.activeEvent) {
      announcedEvent.current = null
    }
  }, [state.activeEvent, isMuted])

  // ----- transisi status: level selesai / menang / kalah -----
  const processedStatus = useRef(state.status)
  useEffect(() => {
    if (state.status === processedStatus.current) {
      return
    }
    const previous = processedStatus.current
    processedStatus.current = state.status
    if (previous !== 'playing') {
      return
    }
    if (state.status === 'levelComplete' || state.status === 'won') {
      if (state.status === 'levelComplete') {
        playSound('levelUp', isMuted)
      }
      pushToasts(recordLevelComplete())
      // Hadiah kemampuan sesuai level yang baru dituntaskan
      if (state.level === 6) {
        pushToasts(unlockAbility(UNLOCK_SPEED_SORTING))
      }
      if (state.status === 'won' && state.level >= 7) {
        pushToasts(unlockAbility(UNLOCK_NEW_GAME_PLUS))
      }
    } else if (state.status === 'gameOver') {
      playSound('gameOver', isMuted)
    }
    if (state.status === 'won' || state.status === 'gameOver') {
      pushToasts(recordGameEnd(state.status === 'won', state.score, state.level))
    }
  }, [
    state.status,
    state.score,
    state.level,
    isMuted,
    pushToasts,
    recordLevelComplete,
    recordGameEnd,
    unlockAbility,
  ])

  // ----- simpan peringkat akhir terbaik -----
  const savedRank = useRef(false)
  useEffect(() => {
    if (rankResult && !savedRank.current) {
      savedRank.current = true
      recordRank(rankResult.grade)
    }
  }, [rankResult, recordRank])

  // ----- CITY UPGRADE saat stage kota naik -----
  const previousStage = useRef({ level: state.level, stage: stage.index })
  useEffect(() => {
    const previous = previousStage.current
    previousStage.current = { level: state.level, stage: stage.index }
    if (state.level !== previous.level || stage.index <= previous.stage) {
      return
    }
    addEcoPoints(CITY_UPGRADE_REWARD)
    pushToasts([
      {
        emoji: '🎉',
        title: `CITY UPGRADE! ${stage.emoji} ${stage.name}`,
        subtitle: `Warga semakin sadar lingkungan · +${CITY_UPGRADE_REWARD} Eco Point`,
      },
    ])
  }, [stage.index, stage.emoji, stage.name, state.level, addEcoPoints, pushToasts])

  // ----- pesan Eco Ranger -----
  const missedCategory =
    (state.lastAnswer === 'wrong' || state.lastAnswer === 'timeout') &&
    state.currentTrash
      ? getCategoryInfo(state.currentTrash.category)
      : null
  const rangerMessage =
    state.lastAnswer === 'correct'
      ? isFever
        ? `ECO FEVER! Combo x${state.combo}! 🔥`
        : state.combo >= 3
          ? `Combo x${state.combo}! Luar biasa! 🔥`
          : 'Mantap, pilahan tepat! 👍'
      : missedCategory && state.currentTrash
        ? `${state.currentTrash.name} masuk tong ${missedCategory.label}!`
        : levelConfig.mode === 'boss'
          ? 'Serang Raja Sampah dengan pilahan yang tepat!'
          : levelConfig.mode === 'chaos'
            ? 'Cepat! Sampah terus berdatangan!'
            : 'Pilih tong yang tepat ya!'

  return (
    <div className="city-bg flex min-h-dvh flex-col" data-stage={stage.index}>
      <ToastStack toasts={toasts} />
      <AnimatePresence>
        {isFever && state.status === 'playing' && (
          <FeverOverlay key="fever" combo={state.combo} />
        )}
      </AnimatePresence>

      {/* Screen shake saat jawaban salah / sampah terlewat */}
      <motion.div
        animate={
          state.lastAnswer === 'wrong' || state.lastAnswer === 'timeout'
            ? { x: [0, -8, 8, -5, 5, 0] }
            : { x: 0 }
        }
        transition={{ duration: 0.4 }}
        className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-3 p-4"
      >
        <GameHeader
          levelName={`Level ${state.level} · ${levelConfig.name}`}
          isMuted={isMuted}
          onToggleMute={toggleMuted}
          onExit={onExit}
        />

        <div className="flex items-center justify-between gap-2">
          <ScoreBoard
            score={state.score}
            level={state.level}
            combo={state.combo}
          />
          <HealthBar health={state.health} />
        </div>

        {levelConfig.mode === 'boss' && state.bossPhase ? (
          <BossPanel
            phase={state.bossPhase === 'decision' ? 'battle' : state.bossPhase}
            bossHp={state.bossHp}
            stormRemaining={state.stormRemaining}
            lastDamage={state.lastDamage}
            damageKey={state.trashKey}
          />
        ) : (
          <CityProgress cleanCity={state.cleanCity} levelTarget={levelTarget} />
        )}

        {state.timeLimitMs > 0 && !isDeciding && (
          <TimerBar
            timeLeftMs={state.timeLeftMs}
            timeLimitMs={state.timeLimitMs}
          />
        )}

        <EventBanner
          eventId={state.activeEvent}
          hasComboShield={state.hasComboShield}
        />

        <div className="relative flex flex-1 flex-col items-center justify-center py-2">
          {isDeciding ? (
            <DecisionPanel onDecide={decide} />
          ) : (
            <>
              <AnimatePresence>
                {state.lastAnswer && (
                  <FloatingReward
                    key={`${state.trashKey}-${state.lastAnswer}`}
                    feedback={state.lastAnswer}
                    gained={state.lastGained}
                    combo={state.combo}
                    isFever={isFever}
                    isClutch={state.lastClutch}
                    isRare={state.isRareTrash}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence mode="popLayout">
                {state.currentTrash && (
                  <TrashCard
                    key={state.trashKey}
                    trash={state.currentTrash}
                    feedback={state.lastAnswer}
                    isRare={state.isRareTrash}
                    isFever={isFever}
                  />
                )}
              </AnimatePresence>

              <div className="mt-3">
                <TrashQueue upcoming={state.upcoming} />
              </div>

              {/* Edukasi singkat saat salah / terlewat */}
              <AnimatePresence>
                {missedCategory && state.currentTrash && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-3 w-full max-w-xs rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-center"
                  >
                    <p className="text-sm font-extrabold text-red-600">
                      {state.lastAnswer === 'timeout'
                        ? '⚠️ Sampah menumpuk! Pelajari kategorinya.'
                        : '❌ Oops! Pelajari kategori sampah ini.'}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {state.currentTrash.emoji} {state.currentTrash.name}{' '}
                      seharusnya masuk tong{' '}
                      <span className="font-extrabold">
                        {missedCategory.emoji} {missedCategory.label}
                      </span>{' '}
                      — {missedCategory.description.toLowerCase()}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Eco Ranger — pemandu kecil di bawah kartu */}
              <div className="mt-4 flex items-center gap-2">
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: isFever ? 1 : 1.8 }}
                  className={`text-3xl ${
                    unlockedItems.some((item) => item.id === 'green-suit')
                      ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]'
                      : ''
                  }`}
                  aria-hidden="true"
                >
                  🦸‍♂️
                  {unlockedItems.some((item) => item.id === 'eco-hat') && (
                    <span className="-ml-1 text-lg">🧢</span>
                  )}
                </motion.span>
                <motion.p
                  key={rangerMessage}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl rounded-bl-none bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow sm:text-sm"
                >
                  {rangerMessage}
                </motion.p>
              </div>
            </>
          )}
        </div>

        {!isDeciding && (
          <div
            className={`grid gap-2.5 pb-2 ${
              activeCategories.length <= 3 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {activeCategories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isDisabled={
                  state.lastAnswer !== null || state.status !== 'playing'
                }
                onSelect={checkAnswer}
              />
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        <LevelCompleteModal
          key={state.status}
          status={state.status}
          level={state.level}
          score={state.score}
          bestCombo={state.bestCombo}
          rankResult={rankResult}
          onContinue={continueToNextLevel}
          onRestart={resetGame}
          onExit={onExit}
        />
      </AnimatePresence>
    </div>
  )
}
