import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface EndingSceneProps {
  playerName: string
  onFinish: () => void
}

// PHASE 27 — Adegan penutup. Baris demi baris agar terasa seperti epilog game.
const SCENES = [
  { emoji: '🏭', text: 'Dulu kota penuh sampah.' },
  { emoji: '🌊', text: 'Sekarang sungai kembali bersih.' },
  { emoji: '🌳', text: 'Pohon tumbuh, burung kembali bernyanyi.' },
  { emoji: '🌎', text: 'Karena kamu, bumi menjadi lebih baik.' },
]

const SCENE_DURATION_MS = 2600

export function EndingScene({ playerName, onFinish }: EndingSceneProps) {
  const [index, setIndex] = useState(0)
  const isLast = index >= SCENES.length

  useEffect(() => {
    if (isLast) {
      return
    }
    const timer = setTimeout(() => setIndex((current) => current + 1), SCENE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [index, isLast])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-900 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Adegan penutup"
    >
      {/* Bintang latar */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 2 + (i % 4),
            delay: i * 0.2,
          }}
          className="pointer-events-none absolute text-sm"
          style={{ left: `${(i * 7 + 5) % 95}%`, top: `${(i * 13 + 8) % 80}%` }}
          aria-hidden="true"
        >
          ✨
        </motion.span>
      ))}

      <div className="relative w-full max-w-sm text-center">
        <AnimatePresence mode="wait">
          {!isLast ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7 }}
            >
              <motion.span
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="block text-7xl"
                aria-hidden="true"
              >
                {SCENES[index].emoji}
              </motion.span>
              <p className="mt-5 text-xl font-bold leading-relaxed text-emerald-50">
                {SCENES[index].text}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="block text-7xl"
                aria-hidden="true"
              >
                🦸‍♂️
              </motion.span>
              <p className="mt-5 text-lg text-emerald-100">Terima kasih,</p>
              <p className="text-3xl font-black text-yellow-300 drop-shadow">
                {playerName}
              </p>
              <p className="mt-1 text-lg font-bold text-emerald-100">
                Eco Ranger sejati 🌏
              </p>
              <p className="mt-5 text-xs text-emerald-300/80">
                Terus pilah sampahmu di dunia nyata bersama peduli-sampah.id
              </p>
              <button
                type="button"
                onClick={onFinish}
                className="mt-6 w-full rounded-2xl border-b-4 border-green-700 bg-green-500 px-4 py-3 font-extrabold text-white shadow-lg transition hover:bg-green-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
              >
                Selesai
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLast && (
          <button
            type="button"
            onClick={() => setIndex(SCENES.length)}
            className="mt-8 text-xs font-semibold text-emerald-300/70 underline transition hover:text-emerald-100"
          >
            Lewati
          </button>
        )}
      </div>
    </motion.div>
  )
}
