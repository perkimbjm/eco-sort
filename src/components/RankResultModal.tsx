import { motion } from 'framer-motion'
import type { RankGrade, RankResult } from '../types/game'

const GRADE_STYLES: Record<RankGrade, string> = {
  S: 'from-yellow-300 via-amber-400 to-orange-500 text-yellow-950',
  A: 'from-emerald-300 to-green-500 text-emerald-950',
  B: 'from-sky-300 to-blue-500 text-sky-950',
  C: 'from-slate-300 to-slate-400 text-slate-800',
}

interface RankResultModalProps {
  result: RankResult
}

// Layar hasil akhir setelah Level 7 — mendorong pemain mengulang demi S Rank
export function RankResultModal({ result }: RankResultModalProps) {
  return (
    <div className="mt-4">
      <motion.div
        initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
        className={`mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl ${GRADE_STYLES[result.grade]}`}
      >
        <span className="text-5xl font-black drop-shadow">{result.grade}</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-center text-lg font-extrabold text-emerald-900"
      >
        {result.title}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xl"
        aria-label={`${result.stars} dari 5 bintang`}
      >
        {'⭐'.repeat(result.stars)}
      </motion.p>

      <ul className="mt-3 space-y-1.5">
        {result.breakdown.map((row, index) => (
          <motion.li
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.12 }}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-1.5 text-xs"
          >
            <span className="font-semibold text-slate-600">{row.label}</span>
            <span className="flex items-center gap-2">
              <span className="text-slate-500">{row.value}</span>
              <span className="w-10 text-right font-extrabold text-emerald-700 tabular-nums">
                +{row.points}
              </span>
            </span>
          </motion.li>
        ))}
      </ul>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-2 text-center text-xs font-bold text-slate-500 tabular-nums"
      >
        Total {result.totalPoints}/100
        {result.grade !== 'S' && ' · Raih 85+ untuk S Rank!'}
      </motion.p>
    </div>
  )
}
