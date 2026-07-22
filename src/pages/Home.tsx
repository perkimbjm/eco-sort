import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  BarChart3,
  HelpCircle,
  Play,
  RotateCcw,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { CATEGORIES } from '../data/trashData'
import { loadBadges, loadHighScore } from '../utils/storage'
import { resetAllData } from '../utils/profile'
import { clearSavedSession, hasSavedSession } from '../hooks/useGame'
import { useProfile } from '../hooks/useProfile'
import { useBackgroundMusic } from '../hooks/useBackgroundMusic'
import { ProfileCard } from '../components/ProfileCard'
import { MissionPanel } from '../components/MissionPanel'
import { AchievementsPanel } from '../components/AchievementsPanel'
import { LeaderboardPanel } from '../components/LeaderboardPanel'
import { StatsPanel } from '../components/StatsPanel'

interface HomeProps {
  onStart: (shouldResume: boolean) => void
}

type HomeModal = 'howto' | 'achievements' | 'leaderboard' | 'stats' | null

const MODAL_TITLES: Record<Exclude<HomeModal, null>, string> = {
  howto: '📖 Cara Bermain',
  achievements: '🏅 Prestasi',
  leaderboard: '🏆 Ranking',
  stats: '📊 Statistik',
}

const menuButton =
  'flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 px-6 py-3 font-extrabold shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300'

export function Home({ onStart }: HomeProps) {
  const [activeModal, setActiveModal] = useState<HomeModal>(null)
  const [canResume, setCanResume] = useState(hasSavedSession)
  const { profile, dailyMissions, leaderboard, setPlayerName, toggleMuted } =
    useProfile()
  const highScore = loadHighScore()

  useBackgroundMusic('menu', profile.isMuted)

  const handleReset = () => {
    if (
      window.confirm(
        'Hapus semua data (profil, badge, skor, misi, ranking)? Tindakan ini tidak bisa dibatalkan.',
      )
    ) {
      resetAllData()
      window.location.reload()
    }
  }

  return (
    <div className="city-bg flex min-h-dvh items-center justify-center p-4" data-stage="2">
      <button
        type="button"
        onClick={toggleMuted}
        className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-emerald-800 shadow transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label={profile.isMuted ? 'Nyalakan suara' : 'Matikan suara'}
      >
        {profile.isMuted ? (
          <VolumeX className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Volume2 className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md py-4 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="text-6xl"
          aria-hidden="true"
        >
          ♻️
        </motion.div>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-emerald-900 sm:text-5xl">
          ECO SORT
          <span className="block text-green-600">BATTLE</span>
        </h1>
        <p className="mt-2 text-sm font-semibold text-emerald-800 sm:text-base">
          Selamatkan Kota Dari Sampah
        </p>
        <p className="text-xs text-emerald-700/80">
          Powered by peduli-sampah.id
        </p>
        {highScore > 0 && (
          <p className="mt-2 inline-block rounded-full bg-yellow-100 px-4 py-1 text-sm font-bold text-yellow-700">
            ⭐ Skor Tertinggi: {highScore.toLocaleString('id-ID')}
          </p>
        )}

        <div className="mt-4 space-y-3">
          <ProfileCard profile={profile} onChangeName={setPlayerName} />
          <MissionPanel dailyMissions={dailyMissions} />
        </div>

        <div className="mt-4 space-y-2.5">
          {canResume && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onStart(true)}
              className={`${menuButton} border-emerald-700 bg-emerald-500 text-white hover:bg-emerald-400`}
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Lanjutkan Permainan
            </motion.button>
          )}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              clearSavedSession()
              setCanResume(false)
              onStart(false)
            }}
            className={`${menuButton} border-green-700 bg-green-500 text-white hover:bg-green-400`}
          >
            <Play className="h-5 w-5" aria-hidden="true" />
            {canResume ? 'Game Baru' : 'Mulai Game'}
          </motion.button>

          <div className="grid grid-cols-2 gap-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveModal('howto')}
              className={`${menuButton} border-emerald-300 bg-white px-3 text-sm text-emerald-800 hover:bg-emerald-50`}
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              Cara Bermain
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveModal('achievements')}
              className={`${menuButton} border-yellow-500 bg-yellow-400 px-3 text-sm text-yellow-950 hover:bg-yellow-300`}
            >
              <Award className="h-4 w-4" aria-hidden="true" />
              Prestasi
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveModal('leaderboard')}
              className={`${menuButton} border-orange-400 bg-orange-300 px-3 text-sm text-orange-950 hover:bg-orange-200`}
            >
              <Trophy className="h-4 w-4" aria-hidden="true" />
              Ranking
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveModal('stats')}
              className={`${menuButton} border-sky-400 bg-sky-300 px-3 text-sm text-sky-950 hover:bg-sky-200`}
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              Statistik
            </motion.button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="mx-auto flex items-center gap-1.5 pt-1 text-xs font-semibold text-slate-400 transition hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Reset semua data
          </button>
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
                  {MODAL_TITLES[activeModal]}
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

              <div className="mt-4">
                {activeModal === 'howto' && (
                  <div className="space-y-3 text-left text-sm text-slate-700">
                    <p>
                      1️⃣ Sampah akan muncul satu per satu. Perhatikan nama dan
                      petunjuknya.
                    </p>
                    <p>
                      2️⃣ Tekan tombol tong sampah yang sesuai dengan jenis
                      sampahnya.
                    </p>
                    <p>
                      3️⃣ Jawaban benar: <b>+100 skor</b>. Combo 3/5/10 memberi
                      bonus besar! Jawaban salah: <b>-20 skor</b> dan kehilangan
                      1 nyawa ❤️.
                    </p>
                    <p>
                      4️⃣ Penuhi bar <b>Clean City</b> untuk naik level dan
                      saksikan kotamu berevolusi dari Kota Tercemar sampai
                      Perfect Environment. Ada 5 level!
                    </p>
                    <p>
                      5️⃣ Kumpulkan XP untuk menaikkan level Eco Ranger dan buka
                      item spesial. Selesaikan misi harian untuk bonus Eco
                      Point.
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
                )}
                {activeModal === 'achievements' && (
                  <AchievementsPanel
                    profile={profile}
                    earnedBadgeIds={loadBadges()}
                  />
                )}
                {activeModal === 'leaderboard' && (
                  <LeaderboardPanel entries={leaderboard} profile={profile} />
                )}
                {activeModal === 'stats' && <StatsPanel profile={profile} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
