import { Download } from 'lucide-react'
import type { Profile } from '../types/game'
import { CATEGORIES } from '../data/trashData'
import { exportAllData } from '../utils/profile'

interface StatsPanelProps {
  profile: Profile
}

function downloadExport(): void {
  const blob = new Blob([exportAllData()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'eco-sort-battle-data.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

// Statistik perilaku pemilahan + export data (PHASE 20)
export function StatsPanel({ profile }: StatsPanelProps) {
  const totalAnswers = profile.totalCorrect + profile.totalWrong
  const accuracy =
    totalAnswers > 0
      ? Math.round((profile.totalCorrect / totalAnswers) * 100)
      : 0

  const categoryRows = CATEGORIES.map((category) => {
    const stat = profile.categoryStats[category.id]
    const answers = stat.correct + stat.wrong
    const categoryAccuracy =
      answers > 0 ? Math.round((stat.correct / answers) * 100) : null
    return { category, stat, answers, categoryAccuracy }
  })

  const hardest = categoryRows
    .filter((row) => row.answers >= 3 && row.categoryAccuracy !== null)
    .sort((a, b) => (a.categoryAccuracy ?? 0) - (b.categoryAccuracy ?? 0))[0]

  return (
    <div className="space-y-4 text-left">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-emerald-50 px-2 py-2.5">
          <p className="text-lg font-extrabold text-emerald-800 tabular-nums">
            {profile.totalCorrect}
          </p>
          <p className="text-[10px] text-slate-500">Terpilah Benar</p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-2 py-2.5">
          <p className="text-lg font-extrabold text-sky-800 tabular-nums">
            {accuracy}%
          </p>
          <p className="text-[10px] text-slate-500">Akurasi</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 px-2 py-2.5">
          <p className="text-lg font-extrabold text-yellow-700 tabular-nums">
            {profile.gamesPlayed}
          </p>
          <p className="text-[10px] text-slate-500">Permainan</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-extrabold text-emerald-800">
          📊 Akurasi per Kategori
        </p>
        <ul className="mt-2 space-y-1.5">
          {categoryRows.map(({ category, stat, categoryAccuracy }) => (
            <li key={category.id}>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>
                  {category.emoji} {category.label}
                </span>
                <span className="tabular-nums text-slate-400">
                  {categoryAccuracy === null
                    ? 'belum ada data'
                    : `${categoryAccuracy}% (${stat.correct}✔ ${stat.wrong}✘)`}
                </span>
              </div>
              <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${
                    (categoryAccuracy ?? 0) >= 80
                      ? 'bg-emerald-400'
                      : (categoryAccuracy ?? 0) >= 50
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                  }`}
                  style={{ width: `${categoryAccuracy ?? 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {hardest && (
        <p className="rounded-2xl bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700">
          💡 Kategori paling sulit buatmu: {hardest.category.emoji}{' '}
          {hardest.category.label}. Pelajari lagi contoh sampahnya ya!
        </p>
      )}

      <button
        type="button"
        onClick={downloadExport}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-sky-300 bg-sky-100 px-4 py-2.5 text-sm font-bold text-sky-800 shadow transition hover:bg-sky-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Export Data (JSON)
      </button>
      <p className="text-[10px] text-slate-400">
        Data statistik disimpan di perangkatmu dan siap diintegrasikan ke
        dashboard peduli-sampah.id.
      </p>
    </div>
  )
}
