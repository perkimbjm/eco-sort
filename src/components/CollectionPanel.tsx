import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CollectionCard, Profile, TrashItem } from '../types/game'
import {
  getCollectionEntries,
  getCollectionProgress,
  RARITY_STYLES,
} from '../data/collection'

interface CollectionPanelProps {
  profile: Profile
}

// PHASE 23 — Eco Collection. Kartu terkunci hanya menampilkan siluet.
export function CollectionPanel({ profile }: CollectionPanelProps) {
  const [selected, setSelected] = useState<{
    card: CollectionCard
    trash: TrashItem
  } | null>(null)

  const entries = getCollectionEntries()
  const progress = getCollectionProgress(profile.collected)

  return (
    <div className="text-left">
      <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
        <span>🃏 Koleksi Kartu</span>
        <span className="tabular-nums">
          {progress.owned}/{progress.total} · {progress.percent}%
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          animate={{ width: `${progress.percent}%` }}
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-500"
        />
      </div>

      {selected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-3 rounded-2xl border-4 bg-white p-4 text-center ${RARITY_STYLES[selected.card.rarity].ring}`}
        >
          <span className="text-5xl" aria-hidden="true">
            {selected.trash.emoji}
          </span>
          <p className="mt-1 text-base font-extrabold text-emerald-900">
            {selected.trash.name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black ${RARITY_STYLES[selected.card.rarity].badge}`}
          >
            {RARITY_STYLES[selected.card.rarity].label.toUpperCase()}
          </span>
          <p className="mt-2 text-xs font-semibold text-slate-700">
            💡 {selected.card.fact}
          </p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mt-3 rounded-xl bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            Kembali ke koleksi
          </button>
        </motion.div>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {entries.map(({ card, trash }) => {
            const owned = profile.collected.includes(card.id)
            return (
              <button
                key={card.id}
                type="button"
                disabled={!owned}
                onClick={() => owned && trash && setSelected({ card, trash })}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border-2 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
                  owned
                    ? `${RARITY_STYLES[card.rarity].ring} bg-white hover:scale-105`
                    : 'cursor-not-allowed border-slate-200 bg-slate-100'
                }`}
                title={owned ? trash?.name : 'Belum ditemukan'}
              >
                <span
                  className={`text-2xl ${owned ? '' : 'opacity-25 grayscale'}`}
                  aria-hidden="true"
                >
                  {owned ? trash?.emoji : '❓'}
                </span>
                {owned && (
                  <span
                    className={`mt-0.5 h-1 w-6 rounded-full ${RARITY_STYLES[card.rarity].badge}`}
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {owned ? trash?.name : 'Kartu belum ditemukan'}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <p className="mt-3 text-[10px] text-slate-400">
        Kartu terbuka otomatis saat kamu memilah sampahnya dengan benar.
      </p>
    </div>
  )
}
