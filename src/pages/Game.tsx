import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { CATEGORIES, getCategoryInfo } from '../data/trashData'
import { playSound } from '../utils/sound'
import { GameHeader } from '../components/GameHeader'
import { ScoreBoard } from '../components/ScoreBoard'
import { HealthBar } from '../components/HealthBar'
import { CityProgress } from '../components/CityProgress'
import { TrashCard } from '../components/TrashCard'
import { CategoryButton } from '../components/CategoryButton'
import { LevelCompleteModal } from '../components/LevelCompleteModal'

interface GameProps {
  onExit: () => void
}

export function Game({ onExit }: GameProps) {
  const {
    state,
    levelConfig,
    levelTarget,
    checkAnswer,
    continueToNextLevel,
    resetGame,
  } = useGame()
  const [isMuted, setIsMuted] = useState(false)

  const activeCategories = CATEGORIES.filter((category) =>
    levelConfig.categories.includes(category.id),
  )

  useEffect(() => {
    if (state.lastAnswer === 'correct') {
      playSound('correct', isMuted)
    } else if (state.lastAnswer === 'wrong') {
      playSound('wrong', isMuted)
    }
  }, [state.lastAnswer, isMuted])

  useEffect(() => {
    if (state.status === 'levelComplete' || state.status === 'won') {
      playSound('levelUp', isMuted)
    } else if (state.status === 'gameOver') {
      playSound('gameOver', isMuted)
    }
  }, [state.status, isMuted])

  const rangerMessage =
    state.lastAnswer === 'correct'
      ? state.combo >= 3
        ? `Combo x${state.combo}! Luar biasa! 🔥`
        : 'Mantap, pilahan tepat! 👍'
      : state.lastAnswer === 'wrong' && state.currentTrash
        ? `Hmm, ${state.currentTrash.name} masuk tong ${getCategoryInfo(state.currentTrash.category).label}!`
        : 'Pilih tong yang tepat ya!'

  return (
    <div className="city-bg flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-3 p-4">
        <GameHeader
          levelName={`Level ${state.level} · ${levelConfig.name}`}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((muted) => !muted)}
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
          <AnimatePresence mode="popLayout">
            {state.currentTrash && (
              <TrashCard
                key={state.trashKey}
                trash={state.currentTrash}
                feedback={state.lastAnswer}
              />
            )}
          </AnimatePresence>

          {/* Eco Ranger — pemandu kecil di bawah kartu */}
          <div className="mt-4 flex items-center gap-2">
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="text-3xl"
              aria-hidden="true"
            >
              🦸‍♂️
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
      </div>

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
