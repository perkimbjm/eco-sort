import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { useProfile } from '../hooks/useProfile'
import { CATEGORIES, getCategoryInfo } from '../data/trashData'
import { getCityStage } from '../data/cityStages'
import { playSound } from '../utils/sound'
import { getUnlockedItems } from '../utils/profile'
import { GameHeader } from '../components/GameHeader'
import { ScoreBoard } from '../components/ScoreBoard'
import { HealthBar } from '../components/HealthBar'
import { CityProgress } from '../components/CityProgress'
import { TrashCard } from '../components/TrashCard'
import { CategoryButton } from '../components/CategoryButton'
import { LevelCompleteModal } from '../components/LevelCompleteModal'
import { FloatingReward } from '../components/FloatingReward'
import { ToastStack } from '../components/Toasts'
import { useToasts } from '../hooks/useToasts'

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
    continueToNextLevel,
    resetGame,
  } = useGame({ shouldResume })
  const {
    profile,
    recordAnswer,
    recordLevelComplete,
    recordGameEnd,
    addEcoPoints,
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

  // ----- proses event gameplay ke sistem progression (sekali per jawaban) -----
  const processedAnswers = useRef(state.correctCount + state.wrongCount)
  useEffect(() => {
    const totalAnswers = state.correctCount + state.wrongCount
    if (
      !state.lastAnswer ||
      !state.currentTrash ||
      totalAnswers === processedAnswers.current
    ) {
      return
    }
    processedAnswers.current = totalAnswers
    playSound(state.lastAnswer === 'correct' ? 'correct' : 'wrong', isMuted)
    const toastEvents = recordAnswer({
      isCorrect: state.lastAnswer === 'correct',
      category: state.currentTrash.category,
      comboAfter: state.combo,
      bonus: state.lastBonus,
      sessionScore: state.score,
    })
    pushToasts(toastEvents)
  }, [state, isMuted, recordAnswer, pushToasts])

  // ----- proses transisi status: level selesai / menang / kalah -----
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
      playSound('levelUp', isMuted)
      pushToasts(recordLevelComplete())
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
  ])

  // ----- CITY UPGRADE: rayakan saat stage kota naik (PHASE 13) -----
  const previousStage = useRef({ level: state.level, stage: stage.index })
  useEffect(() => {
    const previous = previousStage.current
    previousStage.current = { level: state.level, stage: stage.index }
    if (state.level !== previous.level) {
      return
    }
    if (stage.index > previous.stage) {
      addEcoPoints(CITY_UPGRADE_REWARD)
      pushToasts([
        {
          emoji: '🎉',
          title: `CITY UPGRADE! ${stage.emoji} ${stage.name}`,
          subtitle: `Warga semakin sadar lingkungan · +${CITY_UPGRADE_REWARD} Eco Point`,
        },
      ])
    }
  }, [stage.index, stage.emoji, stage.name, state.level, addEcoPoints, pushToasts])

  // ----- pesan Eco Ranger -----
  const wrongCategory =
    state.lastAnswer === 'wrong' && state.currentTrash
      ? getCategoryInfo(state.currentTrash.category)
      : null
  const rangerMessage =
    state.lastAnswer === 'correct'
      ? state.combo >= 3
        ? `Combo x${state.combo}! Luar biasa! 🔥`
        : 'Mantap, pilahan tepat! 👍'
      : wrongCategory && state.currentTrash
        ? `${state.currentTrash.name} masuk tong ${wrongCategory.label}!`
        : 'Pilih tong yang tepat ya!'

  return (
    <div className="city-bg flex min-h-dvh flex-col" data-stage={stage.index}>
      <ToastStack toasts={toasts} />
      {/* Screen shake ringan saat jawaban salah (PHASE 17) */}
      <motion.div
        animate={
          state.lastAnswer === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }
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

        <CityProgress cleanCity={state.cleanCity} levelTarget={levelTarget} />

        <div className="relative flex flex-1 flex-col items-center justify-center py-2">
          <AnimatePresence>
            {state.lastAnswer && (
              <FloatingReward
                key={`${state.trashKey}-${state.lastAnswer}`}
                feedback={state.lastAnswer}
                bonus={state.lastBonus}
                combo={state.combo}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {state.currentTrash && (
              <TrashCard
                key={state.trashKey}
                trash={state.currentTrash}
                feedback={state.lastAnswer}
              />
            )}
          </AnimatePresence>

          {/* Edukasi singkat saat salah (PHASE 11) */}
          <AnimatePresence>
            {wrongCategory && state.currentTrash && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-3 w-full max-w-xs rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-2.5 text-center"
              >
                <p className="text-sm font-extrabold text-red-600">
                  ❌ Oops! Pelajari kategori sampah ini.
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {state.currentTrash.emoji} {state.currentTrash.name} seharusnya
                  masuk tong{' '}
                  <span className="font-extrabold">
                    {wrongCategory.emoji} {wrongCategory.label}
                  </span>{' '}
                  — {wrongCategory.description.toLowerCase()}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Eco Ranger — pemandu kecil di bawah kartu */}
          <div className="mt-4 flex items-center gap-2">
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
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
        </div>

        <div
          className={`grid gap-2.5 pb-2 ${
            activeCategories.length <= 3 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {activeCategories.map((category) => (
            <CategoryButton
              key={category.id}
              category={category}
              isDisabled={state.lastAnswer !== null || state.status !== 'playing'}
              onSelect={checkAnswer}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        <LevelCompleteModal
          key={state.status}
          status={state.status}
          level={state.level}
          score={state.score}
          bestCombo={state.bestCombo}
          onContinue={continueToNextLevel}
          onRestart={resetGame}
          onExit={onExit}
        />
      </AnimatePresence>
    </div>
  )
}
