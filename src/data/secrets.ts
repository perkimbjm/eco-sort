import type { Profile, Secret } from '../types/game'

// PHASE 26 — Penemuan rahasia. Petunjuk sengaja samar; isinya baru terbuka
// setelah pemain memenuhi syaratnya tanpa diberi tahu persis caranya.
export const SECRETS: Secret[] = [
  {
    id: 'kolektor-sejati',
    name: 'Kolektor Sejati',
    emoji: '🗂️',
    hint: 'Sesuatu menanti mereka yang mengumpulkan segalanya...',
    reveal:
      'Kamu melengkapi seluruh Eco Collection! Setiap jenis sampah kini kamu kenali.',
  },
  {
    id: 'tanpa-cela',
    name: 'Tanpa Cela',
    emoji: '💎',
    hint: 'Kesempurnaan meninggalkan jejak yang tak terlihat...',
    reveal:
      'Kamu menamatkan Level 7 dengan peringkat S. Hanya Eco Master sejati yang sanggup.',
  },
  {
    id: 'sahabat-setia',
    name: 'Sahabat Setia',
    emoji: '💞',
    hint: 'Persahabatan yang dirawat akan berbuah...',
    reveal:
      'Eco Buddy-mu mencapai level maksimal. Kalian benar-benar satu tim!',
  },
  {
    id: 'penjaga-bumi',
    name: 'Penjaga Bumi',
    emoji: '🌏',
    hint: 'Kota yang benar-benar bersih menyimpan hadiah...',
    reveal:
      'Kamu pernah mencapai Clean City 100%. Kota impian itu nyata di tanganmu.',
  },
  {
    id: 'area-rahasia',
    name: 'Area Rahasia',
    emoji: '✨',
    hint: 'Jalan tersembunyi terbuka bagi yang menjelajah seluruh dunia...',
    reveal:
      'SECRET AREA UNLOCKED! Seluruh Eco World terbuka — Mastery Mode kini menantimu.',
  },
]

type SecretCheck = (context: {
  profile: Profile
  collectionTotal: number
  maxCompanionLevel: number
}) => boolean

const CHECKS: Record<string, SecretCheck> = {
  'kolektor-sejati': ({ profile, collectionTotal }) =>
    profile.collected.length >= collectionTotal,
  'tanpa-cela': ({ profile }) => profile.bestRank === 'S',
  'sahabat-setia': ({ maxCompanionLevel }) => maxCompanionLevel >= 5,
  'penjaga-bumi': ({ profile }) => profile.bestCityPercent >= 100,
  'area-rahasia': ({ profile }) => profile.highestLevel >= 7,
}

export function findNewSecrets(context: {
  profile: Profile
  collectionTotal: number
  maxCompanionLevel: number
}): Secret[] {
  return SECRETS.filter(
    (secret) =>
      !context.profile.secretsFound.includes(secret.id) &&
      CHECKS[secret.id]?.(context),
  )
}
