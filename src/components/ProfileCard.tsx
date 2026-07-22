import { useState } from 'react'
import { Pencil } from 'lucide-react'
import type { Profile } from '../types/game'
import {
  getRangerLevel,
  getUnlockedItems,
  getXpForLevel,
} from '../utils/profile'

interface ProfileCardProps {
  profile: Profile
  onChangeName: (name: string) => void
}

// Kartu karakter Eco Ranger: level, XP, Eco Point, streak (PHASE 14)
export function ProfileCard({ profile, onChangeName }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(profile.playerName)

  const rangerLevel = getRangerLevel(profile.xp)
  const currentFloor = getXpForLevel(rangerLevel)
  const nextTarget = getXpForLevel(rangerLevel + 1)
  const xpPercent = Math.min(
    100,
    Math.round(
      ((profile.xp - currentFloor) / (nextTarget - currentFloor)) * 100,
    ),
  )
  const unlockedItems = getUnlockedItems(profile.xp)

  const commitName = () => {
    onChangeName(draftName)
    setIsEditing(false)
  }

  return (
    <div className="rounded-3xl border-2 border-emerald-200 bg-white/90 p-4 text-left shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden="true">
          🦸‍♂️
          {unlockedItems.map((item) => (
            <span key={item.id} className="-ml-1 text-xl">
              {item.emoji}
            </span>
          ))}
        </span>
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                commitName()
              }}
              className="flex items-center gap-1.5"
            >
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                maxLength={20}
                autoFocus
                onBlur={commitName}
                className="w-full rounded-lg border-2 border-emerald-300 px-2 py-0.5 text-sm font-bold text-emerald-900 focus:outline-none"
                aria-label="Nama pemain"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraftName(profile.playerName)
                setIsEditing(true)
              }}
              className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-900"
              aria-label="Ubah nama pemain"
            >
              <span className="truncate">{profile.playerName}</span>
              <Pencil className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            </button>
          )}
          <p className="text-xs font-bold text-emerald-600">
            Eco Ranger Lv.{rangerLevel}
          </p>
          <div
            className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-valuenow={xpPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`XP menuju level berikutnya ${xpPercent} persen`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="mt-0.5 text-[10px] text-slate-400 tabular-nums">
            {profile.xp} / {nextTarget} XP
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold text-yellow-600 tabular-nums">
            💰 {profile.ecoPoints.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-400">Eco Point</p>
          {profile.dailyStreak > 1 && (
            <p className="mt-1 text-xs font-bold text-orange-500">
              🔥 {profile.dailyStreak} hari
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
