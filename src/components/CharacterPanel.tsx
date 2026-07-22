import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import type { Profile } from '../types/game'
import {
  RANGER_ITEMS,
  getRangerLevel,
  getUnlockedItems,
} from '../utils/profile'
import { COMPANIONS, getCompanionLevel } from '../data/companions'

interface CharacterPanelProps {
  profile: Profile
  onToggleItem: (itemId: string) => void
  onSelectCompanion: (companionId: string | null) => void
}

// PHASE 24 & 25 — Kustomisasi Eco Ranger dan pemilihan Eco Buddy
export function CharacterPanel({
  profile,
  onToggleItem,
  onSelectCompanion,
}: CharacterPanelProps) {
  const rangerLevel = getRangerLevel(profile.xp)
  const unlocked = getUnlockedItems(profile.xp)
  const equippedItems = RANGER_ITEMS.filter((item) =>
    profile.equipped.includes(item.id),
  )
  const activeBuddy = COMPANIONS.find(
    (companion) => companion.id === profile.activeCompanion,
  )

  return (
    <div className="text-left">
      {/* Pratinjau karakter */}
      <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-sky-50 to-emerald-50 p-5 text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl"
          aria-hidden="true"
        >
          🦸‍♂️
          {equippedItems.map((item) => (
            <span key={item.id} className="-ml-2 text-3xl">
              {item.emoji}
            </span>
          ))}
          {activeBuddy && (
            <span className="ml-1 text-3xl">{activeBuddy.emoji}</span>
          )}
        </motion.div>
        <p className="mt-2 text-sm font-extrabold text-emerald-900">
          {profile.playerName}
        </p>
        <p className="text-xs font-bold text-emerald-600">
          Eco Ranger Lv.{rangerLevel}
        </p>
      </div>

      {/* Item */}
      <p className="mt-4 text-sm font-extrabold text-emerald-800">
        🎽 Perlengkapan
      </p>
      <ul className="mt-2 space-y-2">
        {RANGER_ITEMS.map((item) => {
          const isUnlocked = unlocked.some((owned) => owned.id === item.id)
          const isEquipped = profile.equipped.includes(item.id)
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={!isUnlocked}
                onClick={() => onToggleItem(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-2.5 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
                  isEquipped
                    ? 'border-emerald-400 bg-emerald-50'
                    : isUnlocked
                      ? 'border-slate-200 bg-white hover:bg-slate-50'
                      : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {isUnlocked ? item.emoji : '🔒'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-emerald-900">
                    {item.name}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {isUnlocked
                      ? isEquipped
                        ? 'Sedang dipakai'
                        : 'Ketuk untuk memakai'
                      : `Terbuka di Ranger Lv.${item.unlockRangerLevel}`}
                  </span>
                </span>
                {isEquipped && (
                  <Check
                    className="h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                )}
                {!isUnlocked && (
                  <Lock
                    className="h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Companion */}
      <p className="mt-4 text-sm font-extrabold text-emerald-800">
        🐾 Eco Buddy
      </p>
      <ul className="mt-2 space-y-2">
        {COMPANIONS.map((companion) => {
          const isOwned = profile.companions.includes(companion.id)
          const isActive = profile.activeCompanion === companion.id
          const level = getCompanionLevel(profile.companionXp[companion.id] ?? 0)
          return (
            <li key={companion.id}>
              <button
                type="button"
                disabled={!isOwned}
                onClick={() =>
                  onSelectCompanion(isActive ? null : companion.id)
                }
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-2.5 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
                  isActive
                    ? 'border-emerald-400 bg-emerald-50'
                    : isOwned
                      ? 'border-slate-200 bg-white hover:bg-slate-50'
                      : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {isOwned ? companion.emoji : '🔒'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-emerald-900">
                    {companion.name}
                    {isOwned && (
                      <span className="ml-1 text-[11px] text-emerald-600">
                        Lv.{level}
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {isOwned
                      ? companion.description
                      : `Terbuka setelah mengumpulkan ${companion.unlockAtCards} kartu`}
                  </span>
                </span>
                {isActive && (
                  <Check
                    className="h-4 w-4 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
