import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, HelpCircle, Play, X } from 'lucide-react'
import { BADGES, CATEGORIES } from '../data/trashData'
import { loadBadges, loadHighScore } from '../utils/storage'

interface HomeProps {
  onStart: () => void
}

type HomeModal = 'howto' | 'badges' | null

const menuButton =
  'flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 px-6 py-3.5 text-lg font-extrabold shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300'

export function Home({ onStart }: HomeProps) {
  const [activeModal, setActiveModal] = useState<HomeModal>(null)
  const earnedBadgeIds = loadBadges()
  const highScore = loadHighScore()

  return (
    <div className="city-bg flex min-h-dvh items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="text-7xl"
          aria-hidden="true"
        >
          ♻️
        </motion.div>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-900 sm:text-5xl">
          ECO SORT
          <span className="block text-green-600">BATTLE</span>
        </h1>
        <p className="mt-3 text-sm font-semibold text-emerald-800 sm:text-base">
          Selamatkan Kota Dari Sampah
        </p>
        <p className="text-xs text-emerald-700/80">
          Powered by peduli-sampah.id
        </p>

        {highScore > 0 && (
          <p className="mt-3 inline-block rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold text-yellow-700">
            ⭐ Skor Tertinggi: {highScore}
          </p>
        )}

        <div className="mt-8 space-y-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStart}
            className={`${menuButton} border-green-700 bg-green-500 text-white hover:bg-green-400`}
          >
            <Play className="h-6 w-6" aria-hidden="true" />
            Mulai Game
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveModal('howto')}
            className={`${menuButton} border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50`}
          >
            <HelpCircle className="h-6 w-6" aria-hidden="true" />
            Cara Bermain
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveModal('badges')}
            className={`${menuButton} border-yellow-500 bg-yellow-400 text-yellow-950 hover:bg-yellow-300`}
          >
            <Award className="h-6 w-6" aria-hidden="true" />
            Prestasi
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="max-h-[85dvh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-emerald-900">
                  {activeModal === 'howto' ? '📖 Cara Bermain' : '🏅 Prestasi'}
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
                  aria-label="Tutup"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {activeModal === 'howto' ? (
                <div className="mt-4 space-y-3 text-left text-sm text-slate-700">
                  <p>
                    1️⃣ Sampah akan muncul satu per satu. Perhatikan nama dan
                    petunjuknya.
                  </p>
                  <p>
                    2️⃣ Tekan tombol tong sampah yang sesuai dengan jenis
                    sampahnya.
                  </p>
                  <p>
                    3️⃣ Jawaban benar: <b>+100 skor</b> dan kota makin bersih.
                    Jawaban salah: <b>-20 skor</b> dan kehilangan 1 nyawa ❤️.
                  </p>
                  <p>
                    4️⃣ Penuhi bar <b>Clean City</b> untuk naik level. Ada 5
                    level menanti!
                  </p>
                  <div className="mt-2 rounded-2xl bg-emerald-50 p-3">
                    <p className="font-bold text-emerald-900">Jenis tong:</p>
                    <ul className="mt-1.5 space-y-1">
                      {CATEGORIES.map((category) => (
                        <li key={category.id}>
                          {category.emoji} <b>{category.label}</b> —{' '}
                          {category.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <ul className="mt-4 space-y-2.5">
                  {BADGES.map((badge) => {
                    const isEarned = earnedBadgeIds.includes(badge.id)
                    return (
                      <li
                        key={badge.id}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left ${
                          isEarned
                            ? 'border-yellow-300 bg-yellow-50'
                            : 'border-slate-200 bg-slate-50 opacity-60'
                        }`}
                      >
                        <span className="text-3xl" aria-hidden="true">
                          {isEarned ? badge.emoji : '🔒'}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-emerald-900">
                            {badge.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {badge.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
