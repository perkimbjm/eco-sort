import type { Profile } from '../types/game'
import { SECRETS } from '../data/secrets'

interface SecretsPanelProps {
  profile: Profile
}

// PHASE 26 — Rahasia. Sebelum ditemukan, hanya petunjuk samar yang terlihat.
export function SecretsPanel({ profile }: SecretsPanelProps) {
  const found = profile.secretsFound.length

  return (
    <div className="text-left">
      <p className="text-xs font-bold text-purple-800">
        ✨ Rahasia ditemukan: {found}/{SECRETS.length}
      </p>
      <ul className="mt-2 space-y-2">
        {SECRETS.map((secret) => {
          const isFound = profile.secretsFound.includes(secret.id)
          return (
            <li
              key={secret.id}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${
                isFound
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-dashed border-slate-300 bg-slate-50'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {isFound ? secret.emoji : '❔'}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-sm font-bold ${
                    isFound ? 'text-purple-900' : 'text-slate-400'
                  }`}
                >
                  {isFound ? secret.name : '???'}
                </p>
                <p
                  className={`text-xs ${
                    isFound ? 'text-slate-600' : 'italic text-slate-400'
                  }`}
                >
                  {isFound ? secret.reveal : secret.hint}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
