import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Home, RotateCcw, Share2, Trophy } from 'lucide-react'
import type { GameStatus } from '../types/game'
import { BADGES } from '../data/trashData'
import { shareResult } from '../utils/share'

const CONFETTI = ['🎉', '✨', '🎊', '⭐', '💚', '🌟', '🍃', '🎈', '♻️', '🌈']

interface LevelCompleteModalProps {
  status: GameStatus
  level: number
  score: number
  bestCombo: number
  onContinue: () => void
  onRestart: () => void
  onExit: () => void
}

const buttonBase =
  'flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 px-4 py-3 font-bold shadow transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300'

export function LevelCompleteModal({
  status,
  level,
  score,
  bestCombo,
  onContinue,
  onRestart,
  onExit,
}: LevelCompleteModalProps) {
  const [shareLabel, setShareLabel] = useState('Bagikan Hasil')

  if (status === 'playing') {
    return null
  }

  const newBadge = BADGES.find((badge) => badge.unlockLevel === level)
  const isGameOver = status === 'gameOver'
  const isWon = status === 'won'

  const handleShare = async () => {
    const outcome = await shareResult(score, isWon)
    setShareLabel(
      outcome === 'copied'
        ? 'Tersalin ke clipboard! ✅'
        : outcome === 'failed'
          ? 'Gagal membagikan'
          : 'Dibagikan! ✅',
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={
        isGameOver ? 'Permainan berakhir' : isWon ? 'Kamu menang' : 'Level selesai'
      }
    >
      {/* Confetti sederhana saat menang / naik level */}
      {!isGameOver &&
        CONFETTI.map((piece, index) => (
          <motion.span
            key={index}
            initial={{ y: -60, x: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: '105vh',
              x: (index - 4.5) * 24,
              rotate: (index % 2 === 0 ? 1 : -1) * 360,
              opacity: [1, 1, 0.8],
            }}
            transition={{
              duration: 2.6 + (index % 4) * 0.5,
              delay: index * 0.12,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="pointer-events-none fixed top-0 text-2xl"
            style={{ left: `${6 + index * 9.5}%` }}
            aria-hidden="true"
          >
            {piece}
          </motion.span>
        ))}

      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <motion.div
          animate={{ rotate: isGameOver ? 0 : [0, -8, 8, 0] }}
          transition={{ repeat: isGameOver ? 0 : Infinity, duration: 1.6 }}
          className="text-6xl"
          aria-hidden="true"
        >
          {isGameOver ? '😵' : isWon ? '🏆' : '🎉'}
        </motion.div>

        <h2 className="mt-3 text-2xl font-extrabold text-emerald-900">
          {isGameOver
            ? 'Game Over!'
            : isWon
              ? 'Kota Telah Bersih!'
              : `Level ${level} Selesai!`}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {isGameOver
            ? 'Kota masih butuh bantuanmu. Coba lagi ya!'
            : isWon
              ? 'Kamu berhasil menyelamatkan kota dari sampah!'
              : 'Kota semakin bersih berkat kamu!'}
        </p>

        <div className="mt-4 flex justify-center gap-3 text-sm">
          <div className="rounded-xl bg-emerald-50 px-4 py-2">
            <div className="font-extrabold text-emerald-900 tabular-nums">
              {score}
            </div>
            <div className="text-xs text-slate-500">Skor</div>
          </div>
          <div className="rounded-xl bg-orange-50 px-4 py-2">
            <div className="font-extrabold text-orange-600 tabular-nums">
              x{bestCombo}
            </div>
            <div className="text-xs text-slate-500">Combo Terbaik</div>
          </div>
        </div>

        {!isGameOver && newBadge && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-yellow-300 bg-yellow-50 px-4 py-2.5"
          >
            <Trophy className="h-5 w-5 text-yellow-600" aria-hidden="true" />
            <div className="text-left">
              <div className="text-xs text-slate-500">Badge Baru!</div>
              <div className="text-sm font-bold text-yellow-700">
                {newBadge.emoji} {newBadge.name}
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-5 space-y-2.5">
          {status === 'levelComplete' && (
            <button
              type="button"
              onClick={onContinue}
              className={`${buttonBase} bg-green-500 border-green-700 text-white hover:bg-green-400`}
            >
              Lanjut Level {level + 1}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleShare()}
            className={`${buttonBase} bg-sky-100 border-sky-300 text-sky-800 hover:bg-sky-50`}
          >
            <Share2 className="h-5 w-5" aria-hidden="true" />
            {shareLabel}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className={`${buttonBase} ${
              isGameOver
                ? 'bg-green-500 border-green-700 text-white hover:bg-green-400'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Main Lagi
          </button>
          <button
            type="button"
            onClick={onExit}
            className={`${buttonBase} bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-50`}
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            Ke Beranda
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
