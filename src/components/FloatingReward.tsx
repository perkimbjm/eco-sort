import { motion } from 'framer-motion'

const PARTICLES = ['✨', '🌟', '💚', '🍃', '⭐', '🌿']

interface FloatingRewardProps {
  feedback: 'correct' | 'wrong'
  bonus: number
  combo: number
}

// Teks reward melayang + partikel sederhana saat menjawab (PHASE 11 & 12)
export function FloatingReward({ feedback, bonus, combo }: FloatingRewardProps) {
  if (feedback === 'wrong') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.7 }}
        animate={{ opacity: [0, 1, 1, 0], y: -70, scale: 1 }}
        transition={{ duration: 1.4, times: [0, 0.15, 0.7, 1] }}
        className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 text-center"
      >
        <span className="block text-2xl font-black text-red-500 drop-shadow">
          ❌ Oops!
        </span>
        <span className="block text-sm font-bold text-red-400">-20</span>
      </motion.div>
    )
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2">
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.6, 1.15, 1, 1] }}
        transition={{ duration: 1.3, times: [0, 0.15, 0.7, 1] }}
        className="text-center"
      >
        <span className="block text-2xl font-black text-green-600 drop-shadow">
          ✨ PERFECT!
        </span>
        <span className="block text-lg font-extrabold text-emerald-700">
          +100{bonus > 0 ? ` +${bonus}` : ''} Eco Point
        </span>
        {bonus > 0 && (
          <span className="block text-sm font-black text-orange-500">
            🔥 COMBO x{combo}!
          </span>
        )}
        <span className="block text-xs font-semibold text-emerald-600">
          🌱 Kota semakin bersih
        </span>
      </motion.div>

      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: (index - 2.5) * 34,
            y: -40 - (index % 3) * 30,
            scale: 1.2,
            rotate: (index - 3) * 60,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute left-0 top-0 text-xl"
          aria-hidden="true"
        >
          {particle}
        </motion.span>
      ))}
    </div>
  )
}
