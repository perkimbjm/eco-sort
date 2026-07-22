import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DecisionOption } from '../types/game'
import { DECISION_OPTIONS, DECISION_PROMPT } from '../data/endgame'

interface DecisionPanelProps {
  onDecide: (isBest: boolean) => void
}

// Fase 3 Level 7 — Ultimate Decision dengan penjelasan edukatif
export function DecisionPanel({ onDecide }: DecisionPanelProps) {
  const [chosen, setChosen] = useState<DecisionOption | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm rounded-3xl border-4 border-purple-300 bg-white p-5 shadow-xl"
    >
      <div className="text-center">
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-4xl"
          aria-hidden="true"
        >
          👑
        </motion.span>
        <h2 className="mt-1 text-lg font-extrabold text-purple-900">
          Ultimate Decision
        </h2>
        <p className="mt-1 text-xs text-slate-600">{DECISION_PROMPT}</p>
      </div>

      {!chosen ? (
        <div className="mt-4 space-y-2.5">
          {DECISION_OPTIONS.map((option) => (
            <motion.button
              key={option.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setChosen(option)}
              className="flex w-full items-center gap-3 rounded-2xl border-b-4 border-purple-300 bg-purple-50 px-4 py-3 text-left font-bold text-purple-900 shadow transition hover:bg-purple-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm text-white">
                {option.label}
              </span>
              <span className="text-sm">{option.text}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div
            className={`rounded-2xl border-2 p-3.5 text-center ${
              chosen.isBest
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-red-300 bg-red-50'
            }`}
          >
            <p
              className={`text-lg font-black ${
                chosen.isBest ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {chosen.isBest ? '🌎 PERFECT CHOICE' : '⚠️ Bukan Pilihan Terbaik'}
            </p>
            {chosen.isBest && (
              <p className="text-sm font-extrabold text-emerald-600">
                Earth Recovery +50%
              </p>
            )}
            <p className="mt-2 text-xs font-semibold text-slate-700">
              {chosen.explanation}
            </p>
          </div>

          {!chosen.isBest && (
            <p className="mt-2.5 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
              💡 Jawaban terbaik: <b>B — Daur ulang dan kurangi sampah</b>.{' '}
              {DECISION_OPTIONS.find((option) => option.isBest)?.explanation}
            </p>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onDecide(chosen.isBest)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-green-700 bg-green-500 px-4 py-3 font-extrabold text-white shadow transition hover:bg-green-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            Selamatkan Eco World 🌎
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
