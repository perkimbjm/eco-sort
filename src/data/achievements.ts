import type { Achievement, Profile } from '../types/game'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'pemula',
    name: 'Pemula',
    emoji: '🌿',
    description: 'Pilah 10 sampah dengan benar',
  },
  {
    id: 'recycler',
    name: 'Recycler',
    emoji: '♻️',
    description: 'Pilah 100 sampah dengan benar',
  },
  {
    id: 'combo-master',
    name: 'Combo Master',
    emoji: '🔥',
    description: 'Raih combo 10 kali berturut-turut',
  },
  {
    id: 'guardian-earth',
    name: 'Guardian Earth',
    emoji: '🌍',
    description: 'Capai Clean City 100% dan tamatkan semua level',
  },
  {
    id: 'rajin-menabung',
    name: 'Penabung Eco Point',
    emoji: '💰',
    description: 'Kumpulkan total 10.000 Eco Point',
  },
  {
    id: 'setia-bermain',
    name: 'Setia Bermain',
    emoji: '📅',
    description: 'Bermain 3 hari berturut-turut',
  },
]

// Syarat pencapaian dievaluasi dari profil pemain — dipisah dari data
// tampilan agar mudah diuji.
const CHECKS: Record<string, (profile: Profile) => boolean> = {
  pemula: (profile) => profile.totalCorrect >= 10,
  recycler: (profile) => profile.totalCorrect >= 100,
  'combo-master': (profile) => profile.maxCombo >= 10,
  'guardian-earth': (profile) => profile.wins >= 1,
  'rajin-menabung': (profile) => profile.ecoPoints >= 10000,
  'setia-bermain': (profile) => profile.dailyStreak >= 3,
}

export function findNewAchievements(profile: Profile): Achievement[] {
  return ACHIEVEMENTS.filter(
    (achievement) =>
      !profile.achievements.includes(achievement.id) &&
      CHECKS[achievement.id]?.(profile),
  )
}

export function getAchievementProgress(
  achievement: Achievement,
  profile: Profile,
): { current: number; target: number } {
  switch (achievement.id) {
    case 'pemula':
      return { current: Math.min(profile.totalCorrect, 10), target: 10 }
    case 'recycler':
      return { current: Math.min(profile.totalCorrect, 100), target: 100 }
    case 'combo-master':
      return { current: Math.min(profile.maxCombo, 10), target: 10 }
    case 'guardian-earth':
      return { current: Math.min(profile.wins, 1), target: 1 }
    case 'rajin-menabung':
      return { current: Math.min(profile.ecoPoints, 10000), target: 10000 }
    case 'setia-bermain':
      return { current: Math.min(profile.dailyStreak, 3), target: 3 }
    default:
      return { current: 0, target: 1 }
  }
}
