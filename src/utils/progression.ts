import type { Mission, Profile, TrashCategory } from '../types/game'
import { findNewAchievements } from '../data/achievements'
import { MISSION_REWARD_ECO_POINTS } from '../data/missions'
import { getRangerLevel, getUnlockedItems } from './profile'

export const XP_PER_CORRECT = 10
export const XP_PER_COMBO_MILESTONE = 50
export const XP_PER_LEVEL_COMPLETE = 200

export interface ProgressToast {
  emoji: string
  title: string
  subtitle?: string
}

export interface ProgressResult {
  profile: Profile
  missions: Mission[]
  toasts: ProgressToast[]
}

export interface AnswerEvent {
  isCorrect: boolean
  category: TrashCategory
  comboAfter: number
  bonus: number
  sessionScore: number
}

function collectMetaToasts(
  before: Profile,
  after: Profile,
  toasts: ProgressToast[],
): Profile {
  const levelBefore = getRangerLevel(before.xp)
  const levelAfter = getRangerLevel(after.xp)
  if (levelAfter > levelBefore) {
    toasts.push({
      emoji: '⭐',
      title: `Eco Ranger naik ke Lv.${levelAfter}!`,
    })
    const newItems = getUnlockedItems(after.xp).filter(
      (item) => item.unlockRangerLevel > levelBefore,
    )
    for (const item of newItems) {
      toasts.push({
        emoji: item.emoji,
        title: `Item terbuka: ${item.name}!`,
      })
    }
  }

  const earned = findNewAchievements(after)
  if (earned.length === 0) {
    return after
  }
  for (const achievement of earned) {
    toasts.push({
      emoji: achievement.emoji,
      title: `Achievement: ${achievement.name}`,
      subtitle: achievement.description,
    })
  }
  return {
    ...after,
    achievements: [
      ...after.achievements,
      ...earned.map((achievement) => achievement.id),
    ],
  }
}

function progressMissions(
  missions: Mission[],
  event: AnswerEvent,
  toasts: ProgressToast[],
): { missions: Mission[]; rewardEcoPoints: number } {
  let rewardEcoPoints = 0
  const updated = missions.map((mission) => {
    if (mission.isClaimed) {
      return mission
    }
    let progress = mission.progress
    switch (mission.type) {
      case 'sort_any':
        if (event.isCorrect) progress += 1
        break
      case 'sort_category':
        if (event.isCorrect && mission.category === event.category) {
          progress += 1
        }
        break
      case 'combo':
        progress = Math.max(progress, event.comboAfter)
        break
      case 'score':
        progress = Math.max(progress, event.sessionScore)
        break
    }
    if (progress === mission.progress) {
      return mission
    }
    const isDone = progress >= mission.target
    if (isDone) {
      rewardEcoPoints += MISSION_REWARD_ECO_POINTS
      toasts.push({
        emoji: '🎯',
        title: 'Misi harian selesai!',
        subtitle: `${mission.description} · +${MISSION_REWARD_ECO_POINTS} Eco Point`,
      })
    }
    return {
      ...mission,
      progress: Math.min(progress, mission.target),
      isClaimed: isDone,
    }
  })
  return { missions: updated, rewardEcoPoints }
}

export function processAnswer(
  profile: Profile,
  missions: Mission[],
  event: AnswerEvent,
): ProgressResult {
  const toasts: ProgressToast[] = []

  const stats = profile.categoryStats[event.category]
  const categoryStats = {
    ...profile.categoryStats,
    [event.category]: event.isCorrect
      ? { ...stats, correct: stats.correct + 1 }
      : { ...stats, wrong: stats.wrong + 1 },
  }

  let updated: Profile = event.isCorrect
    ? {
        ...profile,
        totalCorrect: profile.totalCorrect + 1,
        maxCombo: Math.max(profile.maxCombo, event.comboAfter),
        ecoPoints:
          profile.ecoPoints + 100 + event.bonus,
        xp:
          profile.xp +
          XP_PER_CORRECT +
          (event.bonus > 0 ? XP_PER_COMBO_MILESTONE : 0),
        categoryStats,
      }
    : {
        ...profile,
        totalWrong: profile.totalWrong + 1,
        categoryStats,
      }

  const missionResult = progressMissions(missions, event, toasts)
  if (missionResult.rewardEcoPoints > 0) {
    updated = {
      ...updated,
      ecoPoints: updated.ecoPoints + missionResult.rewardEcoPoints,
    }
  }

  updated = collectMetaToasts(profile, updated, toasts)
  return { profile: updated, missions: missionResult.missions, toasts }
}

export function processLevelComplete(profile: Profile): ProgressResult {
  const toasts: ProgressToast[] = []
  let updated: Profile = { ...profile, xp: profile.xp + XP_PER_LEVEL_COMPLETE }
  updated = collectMetaToasts(profile, updated, toasts)
  return { profile: updated, missions: [], toasts }
}

export function processGameEnd(profile: Profile, didWin: boolean): ProgressResult {
  const toasts: ProgressToast[] = []
  let updated: Profile = {
    ...profile,
    gamesPlayed: profile.gamesPlayed + 1,
    wins: profile.wins + (didWin ? 1 : 0),
  }
  updated = collectMetaToasts(profile, updated, toasts)
  return { profile: updated, missions: [], toasts }
}
