import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'

interface TimerBarProps {
  timeLeftMs: number
  timeLimitMs: number
}

// Bar waktu untuk mode chaos & boss — berubah warna saat kritis (PHASE Level 6)
export function TimerBar({ timeLeftMs, timeLimitMs }: TimerBarProps) {
  if (timeLimitMs === 0) {
    return null
  }

  const ratio = Math.max(0, Math.min(1, timeLeftMs / timeLimitMs))
  const percent = Math.round(ratio * 100)
  const seconds = (Math.max(0, timeLeftMs) / 1000).toFixed(2)
  const isCritical = ratio <= 0.15
  const isWarning = ratio <= 0.4

  return (
    <div className="rounded-2xl bg-white/90 px-4 py-2 shadow">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1.5 text-emerald-800">
          <Timer className="h-4 w-4" aria-hidden="true" />
          TIME
        </span>
        <motion.span
          animate={isCritical ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ repeat: isCritical ? Infinity : 0, duration: 0.5 }}
          className={`tabular-nums ${
            isCritical
              ? 'text-red-600'
              : isWarning
                ? 'text-orange-500'
                : 'text-emerald-800'
          }`}
        >
          {seconds}s
        </motion.span>
      </div>
      <div
        className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Sisa waktu"
      >
        <motion.div
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
          className={`h-full rounded-full ${
            isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : isWarning
                ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                : 'bg-gradient-to-r from-sky-400 to-emerald-500'
          }`}
        />
      </div>
    </div>
  )
}
