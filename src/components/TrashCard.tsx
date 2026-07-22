import { motion } from 'framer-motion'
import type { Ref } from 'react'
import type { TrashItem } from '../types/game'

interface TrashCardProps {
  trash: TrashItem
  feedback: 'correct' | 'wrong' | 'timeout' | null
  /** Item langka ✨ Golden Bottle — tampil dengan kilau emas */
  isRare?: boolean
  /** Eco Fever aktif — kartu tampil lebih membara */
  isFever?: boolean
  // Diperlukan AnimatePresence mode="popLayout" untuk mengukur elemen keluar
  ref?: Ref<HTMLDivElement>
}

const BORDER_BY_FEEDBACK: Record<string, string> = {
  correct: 'border-green-400',
  wrong: 'border-red-400',
  timeout: 'border-amber-400',
}

export function TrashCard({
  trash,
  feedback,
  isRare = false,
  isFever = false,
  ref,
}: TrashCardProps) {
  const isMiss = feedback === 'wrong' || feedback === 'timeout'
  const borderClass = feedback
    ? BORDER_BY_FEEDBACK[feedback]
    : isRare
      ? 'border-amber-400'
      : isFever
        ? 'border-orange-400'
        : 'border-emerald-200'

  return (
    <motion.div
      ref={ref}
      initial={{ y: -80, opacity: 0, scale: 0.8 }}
      animate={
        isMiss
          ? { x: [0, -14, 14, -10, 10, -5, 5, 0], y: 0, opacity: 1, scale: 1 }
          : { y: 0, x: 0, opacity: 1, scale: 1 }
      }
      exit={
        feedback === 'correct'
          ? { y: 160, opacity: 0, scale: 0.5, rotate: 12 }
          : { x: -120, opacity: 0 }
      }
      transition={
        isMiss
          ? { duration: 0.45 }
          : { type: 'spring', stiffness: 300, damping: 22 }
      }
      className={`relative mx-auto w-full max-w-xs rounded-3xl border-4 p-5 text-center shadow-xl ${borderClass} ${
        isRare
          ? 'bg-gradient-to-br from-amber-50 to-yellow-100 shadow-amber-300/60'
          : 'bg-white'
      }`}
    >
      {isRare && (
        <motion.div
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="pointer-events-none absolute -inset-1 rounded-3xl bg-amber-300/40 blur-md"
          aria-hidden="true"
        />
      )}

      <div className="relative">
        {isRare && (
          <span className="mb-1 inline-block rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-0.5 text-[10px] font-black tracking-wide text-amber-950">
            ✨ RARE · +1000
          </span>
        )}
        <motion.span
          animate={
            isRare
              ? { y: [0, -8, 0], rotate: [0, -6, 6, 0] }
              : { y: [0, -6, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: isFever ? 1.2 : 2,
            ease: 'easeInOut',
          }}
          className="block text-6xl sm:text-7xl"
          role="img"
          aria-label={trash.name}
        >
          {trash.emoji}
        </motion.span>
        <h2 className="mt-3 text-xl font-extrabold text-emerald-900 sm:text-2xl">
          {trash.name}
        </h2>
        <p className="mt-2 min-h-10 text-sm text-slate-600">
          {trash.description}
        </p>
      </div>

      {feedback === 'correct' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-sm font-bold text-white shadow-lg"
        >
          ✅ Benar!
        </motion.div>
      )}
      {isMiss && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-bold text-white shadow-lg ${
            feedback === 'timeout' ? 'bg-amber-500' : 'bg-red-500'
          }`}
        >
          {feedback === 'timeout' ? '⏱️ Terlewat!' : '❌ Salah! -20'}
        </motion.div>
      )}
    </motion.div>
  )
}
