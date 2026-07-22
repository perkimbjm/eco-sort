import { motion } from 'framer-motion'
import type { Ref } from 'react'
import type { TrashItem } from '../types/game'

interface TrashCardProps {
  trash: TrashItem
  feedback: 'correct' | 'wrong' | null
  // Diperlukan AnimatePresence mode="popLayout" untuk mengukur elemen keluar
  ref?: Ref<HTMLDivElement>
}

export function TrashCard({ trash, feedback, ref }: TrashCardProps) {
  return (
    <motion.div
      ref={ref}
      initial={{ y: -80, opacity: 0, scale: 0.8 }}
      animate={
        feedback === 'wrong'
          ? { x: [0, -14, 14, -10, 10, -5, 5, 0], y: 0, opacity: 1, scale: 1 }
          : { y: 0, x: 0, opacity: 1, scale: 1 }
      }
      exit={
        feedback === 'correct'
          ? { y: 160, opacity: 0, scale: 0.5, rotate: 12 }
          : { x: -120, opacity: 0 }
      }
      transition={
        feedback === 'wrong'
          ? { duration: 0.45 }
          : { type: 'spring', stiffness: 300, damping: 22 }
      }
      className={`relative mx-auto w-full max-w-xs rounded-3xl border-4 bg-white p-5 text-center shadow-xl ${
        feedback === 'correct'
          ? 'border-green-400'
          : feedback === 'wrong'
            ? 'border-red-400'
            : 'border-emerald-200'
      }`}
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="block text-6xl sm:text-7xl"
        role="img"
        aria-label={trash.name}
      >
        {trash.emoji}
      </motion.span>
      <h2 className="mt-3 text-xl font-extrabold text-emerald-900 sm:text-2xl">
        {trash.name}
      </h2>
      <p className="mt-2 min-h-10 text-sm text-slate-600">{trash.description}</p>

      {feedback === 'correct' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-4 py-1 text-sm font-bold text-white shadow-lg"
        >
          ✅ Benar! +100
        </motion.div>
      )}
      {feedback === 'wrong' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white shadow-lg"
        >
          ❌ Salah! -20
        </motion.div>
      )}
    </motion.div>
  )
}
