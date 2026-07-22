import { motion } from 'framer-motion'
import { Flame, Star, TrendingUp } from 'lucide-react'

interface ScoreBoardProps {
  score: number
  level: number
  combo: number
}

export function ScoreBoard({ score, level, combo }: ScoreBoardProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 shadow">
        <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
        <motion.span
          key={score}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-sm font-extrabold text-emerald-900 tabular-nums"
        >
          {score}
        </motion.span>
      </div>
      <div className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 shadow">
        <TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        <span className="text-sm font-extrabold text-emerald-900">
          Lv {level}
        </span>
      </div>
      <div
        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow transition-colors ${
          combo >= 3 ? 'bg-orange-100' : 'bg-white/90'
        }`}
      >
        <Flame
          className={`h-4 w-4 ${combo >= 3 ? 'text-orange-500' : 'text-slate-400'}`}
          aria-hidden="true"
        />
        <motion.span
          key={combo}
          initial={{ scale: combo > 0 ? 1.4 : 1 }}
          animate={{ scale: 1 }}
          className="text-sm font-extrabold text-emerald-900 tabular-nums"
        >
          x{combo}
        </motion.span>
      </div>
    </div>
  )
}
