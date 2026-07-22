import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'

interface CityProgressProps {
  cleanCity: number
  levelTarget: number
}

export function CityProgress({ cleanCity, levelTarget }: CityProgressProps) {
  const percent = Math.min(100, Math.round((cleanCity / levelTarget) * 100))

  return (
    <div className="rounded-2xl bg-white/90 px-4 py-2.5 shadow">
      <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
        <span className="flex items-center gap-1.5">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Clean City
        </span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div
        className="mt-1.5 h-3 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Kemajuan kota bersih"
      >
        <motion.div
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600"
        />
      </div>
    </div>
  )
}
