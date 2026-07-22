import { motion } from 'framer-motion'
import { Lock, Play } from 'lucide-react'
import type { MasteryModeId, Profile } from '../types/game'
import { MASTERY_MODES } from '../data/mastery'

interface MasteryPanelProps {
  profile: Profile
  onStartMode: (modeId: MasteryModeId) => void
}

// PHASE 28 — Mode Mastery, terbuka setelah Eco World diselamatkan.
export function MasteryPanel({ profile, onStartMode }: MasteryPanelProps) {
  const isUnlocked = profile.highestLevel > 7

  if (!isUnlocked) {
    return (
      <div className="py-6 text-center">
        <span className="text-4xl" aria-hidden="true">
          🔒
        </span>
        <p className="mt-2 text-sm font-bold text-slate-600">
          Mastery Mode masih terkunci
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Tamatkan Level 7 dan kalahkan Raja Sampah untuk membukanya.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2.5 text-left">
      {MASTERY_MODES.map((mode, index) => {
        const best = profile.masteryScores[mode.id] ?? 0
        return (
          <motion.li
            key={mode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <button
              type="button"
              onClick={() => onStartMode(mode.id)}
              className="flex w-full items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-white p-3 text-left transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
            >
              <span className="text-3xl" aria-hidden="true">
                {mode.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-emerald-900">
                  {mode.name}
                </span>
                <span className="block text-xs text-slate-600">
                  {mode.description}
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold text-slate-400">
                  {mode.rule}
                </span>
                {best > 0 && (
                  <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                    ⭐ Rekor: {best.toLocaleString('id-ID')}
                  </span>
                )}
              </span>
              <Play
                className="h-5 w-5 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
            </button>
          </motion.li>
        )
      })}
      <li className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
        <Lock className="h-3 w-3" aria-hidden="true" />
        Skor Mastery dicatat terpisah dari petualangan utama.
      </li>
    </ul>
  )
}
