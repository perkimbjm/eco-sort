import type { DailyMissions } from '../types/game'

interface MissionPanelProps {
  dailyMissions: DailyMissions
}

// Misi harian dengan progress (PHASE 16)
export function MissionPanel({ dailyMissions }: MissionPanelProps) {
  return (
    <div className="rounded-3xl border-2 border-sky-200 bg-white/90 p-4 text-left shadow-lg">
      <p className="text-sm font-extrabold text-sky-800">🎯 Misi Harian</p>
      <ul className="mt-2 space-y-2">
        {dailyMissions.missions.map((mission) => {
          const percent = Math.min(
            100,
            Math.round((mission.progress / mission.target) * 100),
          )
          return (
            <li key={mission.id}>
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                <span className={mission.isClaimed ? 'line-through opacity-60' : ''}>
                  {mission.isClaimed ? '✅' : '□'} {mission.description}
                </span>
                <span className="shrink-0 tabular-nums text-slate-400">
                  {mission.progress}/{mission.target}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    mission.isClaimed ? 'bg-green-500' : 'bg-sky-400'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-[11px] font-bold text-yellow-600">
        Hadiah: 1000 Eco Point per misi
      </p>
    </div>
  )
}
