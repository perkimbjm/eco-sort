import type { Profile } from '../types/game'
import { BADGES } from '../data/trashData'
import { ACHIEVEMENTS, getAchievementProgress } from '../data/achievements'

interface AchievementsPanelProps {
  profile: Profile
  earnedBadgeIds: string[]
}

// Badge level (MVP) + achievement jangka panjang (PHASE 15)
export function AchievementsPanel({
  profile,
  earnedBadgeIds,
}: AchievementsPanelProps) {
  return (
    <div className="space-y-4 text-left">
      <div>
        <p className="text-sm font-extrabold text-emerald-800">🎖️ Badge Level</p>
        <ul className="mt-2 space-y-2">
          {BADGES.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id)
            return (
              <li
                key={badge.id}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${
                  isEarned
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {isEarned ? badge.emoji : '🔒'}
                </span>
                <div>
                  <p className="text-sm font-bold text-emerald-900">
                    {badge.name}
                  </p>
                  <p className="text-xs text-slate-500">{badge.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <p className="text-sm font-extrabold text-emerald-800">🏅 Achievement</p>
        <ul className="mt-2 space-y-2">
          {ACHIEVEMENTS.map((achievement) => {
            const isEarned = profile.achievements.includes(achievement.id)
            const { current, target } = getAchievementProgress(
              achievement,
              profile,
            )
            const percent = Math.round((current / target) * 100)
            return (
              <li
                key={achievement.id}
                className={`rounded-2xl border-2 p-3 ${
                  isEarned
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-2xl ${isEarned ? '' : 'grayscale opacity-70'}`}
                    aria-hidden="true"
                  >
                    {achievement.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-emerald-900">
                      {achievement.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {achievement.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-slate-400 tabular-nums">
                    {isEarned ? '✅' : `${current}/${target}`}
                  </span>
                </div>
                {!isEarned && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
