import { motion } from 'framer-motion'

const PARTICLES = ['✨', '🌟', '💚', '🍃', '⭐', '🌿']

interface FloatingRewardProps {
  feedback: 'correct' | 'wrong' | 'timeout'
  gained: number
  combo: number
  isFever: boolean
  isClutch: boolean
  isRare: boolean
}

// Teks reward melayang + partikel saat menjawab (PHASE 11, diperluas Level 6-7)
export function FloatingReward({
  feedback,
  gained,
  combo,
  isFever,
  isClutch,
  isRare,
}: FloatingRewardProps) {
  if (feedback !== 'correct') {
    const isTimeout = feedback === 'timeout'
    return (
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.7 }}
        animate={{ opacity: [0, 1, 1, 0], y: -70, scale: 1 }}
        transition={{ duration: 1.4, times: [0, 0.15, 0.7, 1] }}
        className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 text-center"
      >
        <span
          className={`block text-2xl font-black drop-shadow ${
            isTimeout ? 'text-amber-600' : 'text-red-500'
          }`}
        >
          {isTimeout ? '⚠️ Sampah menumpuk!' : '❌ Oops!'}
        </span>
        <span
          className={`block text-sm font-bold ${
            isTimeout ? 'text-amber-500' : 'text-red-400'
          }`}
        >
          {isTimeout ? 'Clean City -5%' : '-20'}
        </span>
      </motion.div>
    )
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2">
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.6, 1.15, 1, 1] }}
        transition={{ duration: 1.3, times: [0, 0.15, 0.7, 1] }}
        className="whitespace-nowrap text-center"
      >
        {isRare && (
          <span className="block text-lg font-black text-amber-500 drop-shadow">
            ✨ LEGENDARY ITEM!
          </span>
        )}
        {isClutch && (
          <span className="block text-lg font-black text-orange-600 drop-shadow">
            ⚡ CLUTCH! +500
          </span>
        )}
        <span className="block text-2xl font-black text-green-600 drop-shadow">
          ✨ PERFECT!
        </span>
        <span className="block text-lg font-extrabold text-emerald-700">
          +{gained.toLocaleString('id-ID')} Eco Point
        </span>
        {isFever && (
          <span className="block text-sm font-black text-red-600">
            🔥 ECO FEVER x2!
          </span>
        )}
        {combo >= 3 && !isFever && (
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
            scale: isRare || isFever ? 1.6 : 1.2,
            rotate: (index - 3) * 60,
          }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute left-0 top-0 text-xl"
          aria-hidden="true"
        >
          {isRare ? '✨' : particle}
        </motion.span>
      ))}
    </div>
  )
}
