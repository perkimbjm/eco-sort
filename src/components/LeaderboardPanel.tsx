import { useState } from 'react'
import { motion } from 'framer-motion'
import type {
  LeaderboardCategory,
  LeaderboardEntry,
  Profile,
} from '../types/game'

const MEDALS = ['🥇', '🥈', '🥉']

const CATEGORIES: {
  id: LeaderboardCategory
  label: string
  emoji: string
  valueOf: (entry: LeaderboardEntry) => number
  format: (entry: LeaderboardEntry) => string
}[] = [
  {
    id: 'score',
    label: 'Skor',
    emoji: '⭐',
    valueOf: (entry) => entry.score,
    format: (entry) => entry.score.toLocaleString('id-ID'),
  },
  {
    id: 'combo',
    label: 'Combo',
    emoji: '🔥',
    valueOf: (entry) => entry.combo ?? 0,
    format: (entry) => `x${entry.combo ?? 0}`,
  },
  {
    id: 'city',
    label: 'Kota Terbersih',
    emoji: '🌳',
    valueOf: (entry) => entry.cityPercent ?? 0,
    format: (entry) => `${entry.cityPercent ?? 0}%`,
  },
]

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[]
  profile: Profile
}

// PHASE 19 & 29 — Papan skor lokal dengan tiga kategori peringkat
export function LeaderboardPanel({ entries, profile }: LeaderboardPanelProps) {
  const [active, setActive] = useState<LeaderboardCategory>('score')

  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        Belum ada skor tercatat.
        <br />
        Selesaikan satu permainan untuk masuk ranking! 🏆
      </p>
    )
  }

  const category = CATEGORIES.find((item) => item.id === active) ?? CATEGORIES[0]
  const ranked = [...entries].sort(
    (a, b) => category.valueOf(b) - category.valueOf(a),
  )
  const ownBest = Math.max(
    0,
    ...ranked
      .filter((entry) => entry.name === profile.playerName)
      .map(category.valueOf),
  )

  return (
    <div className="text-left">
      <div className="flex gap-1.5">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
              active === item.id
                ? 'bg-emerald-500 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      <ol className="mt-3 space-y-1.5">
        {ranked.map((entry, index) => {
          const isOwn =
            entry.name === profile.playerName &&
            category.valueOf(entry) === ownBest &&
            ownBest > 0
          return (
            <motion.li
              key={`${entry.name}-${entry.date}-${entry.score}-${index}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${
                isOwn
                  ? 'border-2 border-emerald-300 bg-emerald-50'
                  : 'bg-slate-50'
              }`}
            >
              <span className="w-7 text-center text-sm font-extrabold text-slate-500">
                {MEDALS[index] ?? index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-emerald-900">
                {entry.name}
                {isOwn && ' (kamu)'}
              </span>
              <span className="text-xs text-slate-400">Lv {entry.level}</span>
              <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                {category.format(entry)}
              </span>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
