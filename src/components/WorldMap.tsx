import { motion } from 'framer-motion'
import { Lock, Play } from 'lucide-react'
import type { Profile } from '../types/game'
import {
  getAreaProgress,
  isAreaUnlocked,
  WORLD_AREAS,
} from '../data/worlds'
import { getLevelConfig } from '../data/trashData'

interface WorldMapProps {
  profile: Profile
  onStartLevel: (level: number) => void
}

// PHASE 21 — Peta Eco World. Jalur vertikal ala world map Nintendo klasik.
export function WorldMap({ profile, onStartLevel }: WorldMapProps) {
  return (
    <div className="text-left">
      <p className="text-center text-xs font-semibold text-slate-500">
        Perjalananmu menyelamatkan Eco World
      </p>

      <ol className="relative mt-4 space-y-3">
        {/* Garis penghubung antar area */}
        <span
          className="absolute left-[27px] top-4 bottom-4 w-1 rounded-full bg-emerald-200"
          aria-hidden="true"
        />

        {WORLD_AREAS.map((area, index) => {
          const unlocked = isAreaUnlocked(area, profile.highestLevel)
          const progress = getAreaProgress(area, profile.highestLevel)
          const isComplete = progress === 100

          return (
            <motion.li
              key={area.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex gap-3"
            >
              <div
                className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 text-2xl shadow ${
                  isComplete
                    ? 'border-yellow-400 bg-yellow-50'
                    : unlocked
                      ? 'border-emerald-400 bg-white'
                      : 'border-slate-300 bg-slate-100'
                }`}
              >
                {unlocked ? (
                  <span aria-hidden="true">{area.emoji}</span>
                ) : (
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                )}
                {isComplete && (
                  <span className="absolute -right-1.5 -top-1.5 text-sm">
                    ⭐
                  </span>
                )}
              </div>

              <div
                className={`flex-1 rounded-2xl border-2 p-3 ${
                  unlocked
                    ? 'border-emerald-200 bg-white/90'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm font-extrabold ${
                      unlocked ? 'text-emerald-900' : 'text-slate-400'
                    }`}
                  >
                    {area.name}
                  </p>
                  <span className="shrink-0 text-[10px] font-bold text-slate-400">
                    Lv {area.levels[0]}
                    {area.levels.length > 1 &&
                      `-${area.levels[area.levels.length - 1]}`}
                  </span>
                </div>

                {unlocked ? (
                  <>
                    <p className="mt-1 text-xs text-slate-600">
                      {isComplete ? area.outro : area.intro}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {area.levels.map((level) => {
                        const playable = profile.highestLevel >= level
                        return (
                          <button
                            key={level}
                            type="button"
                            disabled={!playable}
                            onClick={() => onStartLevel(level)}
                            className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
                              playable
                                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                                : 'cursor-not-allowed bg-slate-200 text-slate-400'
                            }`}
                          >
                            {playable ? (
                              <Play className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <Lock className="h-3 w-3" aria-hidden="true" />
                            )}
                            Lv {level} · {getLevelConfig(level).name}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">
                    Terkunci — capai Level {area.unlockAtLevel} untuk membuka.
                  </p>
                )}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
