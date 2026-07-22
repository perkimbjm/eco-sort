import type { LeaderboardEntry, Profile } from '../types/game'

const MEDALS = ['🥇', '🥈', '🥉']

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[]
  profile: Profile
}

// Papan skor lokal + perbandingan skor (PHASE 19)
export function LeaderboardPanel({ entries, profile }: LeaderboardPanelProps) {
  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        Belum ada skor tercatat.
        <br />
        Selesaikan satu permainan untuk masuk ranking! 🏆
      </p>
    )
  }

  const bestOwnScore = entries
    .filter((entry) => entry.name === profile.playerName)
    .reduce((best, entry) => Math.max(best, entry.score), 0)

  return (
    <div className="text-left">
      <ol className="space-y-1.5">
        {entries.map((entry, index) => {
          const isOwn =
            entry.name === profile.playerName && entry.score === bestOwnScore
          return (
            <li
              key={`${entry.name}-${entry.date}-${entry.score}-${index}`}
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
                {entry.score.toLocaleString('id-ID')}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
