import { AnimatePresence, motion } from 'framer-motion'
import type { BossPhase } from '../types/game'
import { BOSS_MAX_HP, STORM_LENGTH } from '../hooks/useGame'

interface BossPanelProps {
  phase: BossPhase
  bossHp: number
  stormRemaining: number
  lastDamage: number
  damageKey: number
}

// Panel Raja Sampah: fase Garbage Storm dan Boss Battle (Level 7)
export function BossPanel({
  phase,
  bossHp,
  stormRemaining,
  lastDamage,
  damageKey,
}: BossPanelProps) {
  if (phase === 'storm') {
    const cleared = STORM_LENGTH - stormRemaining
    const percent = Math.round((cleared / STORM_LENGTH) * 100)
    return (
      <div className="rounded-2xl border-2 border-purple-300 bg-white/90 px-4 py-2.5 shadow">
        <div className="flex items-center justify-between text-xs font-bold text-purple-800">
          <span className="flex items-center gap-1.5">
            <motion.span
              animate={{ x: [0, -2, 2, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              aria-hidden="true"
            >
              🌪️
            </motion.span>
            Garbage Storm
          </span>
          <span className="tabular-nums">
            {cleared}/{STORM_LENGTH}
          </span>
        </div>
        <div
          className="mt-1.5 h-3 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Kemajuan bertahan dari badai sampah"
        >
          <motion.div
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-600"
          />
        </div>
        <p className="mt-1 text-[10px] font-semibold text-purple-600">
          Bertahan! Raja Sampah sedang mengumpulkan kekuatan...
        </p>
      </div>
    )
  }

  const percent = Math.round((bossHp / BOSS_MAX_HP) * 100)
  const isCritical = percent <= 25

  return (
    <div className="relative rounded-2xl border-2 border-red-300 bg-white/90 px-4 py-2.5 shadow">
      <div className="flex items-center justify-between text-xs font-bold text-red-800">
        <span className="flex items-center gap-1.5">
          <motion.span
            animate={
              isCritical
                ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
                : { y: [0, -3, 0] }
            }
            transition={{ repeat: Infinity, duration: isCritical ? 0.5 : 1.6 }}
            className="text-lg"
            aria-hidden="true"
          >
            👑
          </motion.span>
          RAJA SAMPAH
        </span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div
        className="mt-1.5 h-3.5 overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Energi Raja Sampah"
      >
        <motion.div
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className={`h-full rounded-full ${
            isCritical
              ? 'bg-gradient-to-r from-red-600 to-orange-500'
              : 'bg-gradient-to-r from-purple-600 to-red-500'
          }`}
        />
      </div>

      {/* Angka damage melayang setiap serangan berhasil */}
      <AnimatePresence>
        {lastDamage > 0 && (
          <motion.span
            key={damageKey}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="pointer-events-none absolute right-6 top-1 text-lg font-black text-red-600 drop-shadow"
          >
            -{lastDamage}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
