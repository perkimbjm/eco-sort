import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  DailyMissions,
  LeaderboardEntry,
  Profile,
  RankGrade,
} from '../types/game'
import { UNLOCK_LABELS } from '../data/endgame'
import { isBetterRank } from '../utils/ranking'
import {
  addLeaderboardEntry,
  loadDailyMissions,
  loadLeaderboard,
  loadProfile,
  saveDailyMissions,
  saveProfile,
  touchDailyStreak,
} from '../utils/profile'
import {
  processAnswer,
  processGameEnd,
  processLevelComplete,
  type AnswerEvent,
  type ProgressToast,
} from '../utils/progression'
import { todayString } from '../data/missions'

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() =>
    touchDailyStreak(loadProfile()),
  )
  const [dailyMissions, setDailyMissions] = useState<DailyMissions>(
    loadDailyMissions,
  )
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(
    loadLeaderboard,
  )

  // Ref agar handler event gameplay selalu membaca nilai terbaru
  // tanpa membuat callback berubah setiap render.
  const profileRef = useRef(profile)
  const missionsRef = useRef(dailyMissions)

  useEffect(() => {
    profileRef.current = profile
    saveProfile(profile)
  }, [profile])

  useEffect(() => {
    missionsRef.current = dailyMissions
    saveDailyMissions(dailyMissions)
  }, [dailyMissions])

  const recordAnswer = useCallback((event: AnswerEvent): ProgressToast[] => {
    const result = processAnswer(
      profileRef.current,
      missionsRef.current.missions,
      event,
    )
    setProfile(result.profile)
    setDailyMissions({ date: missionsRef.current.date, missions: result.missions })
    return result.toasts
  }, [])

  const recordLevelComplete = useCallback(
    (levelReached?: number, cityPercent?: number): ProgressToast[] => {
      const result = processLevelComplete(
        profileRef.current,
        levelReached,
        cityPercent,
      )
      setProfile(result.profile)
      return result.toasts
    },
    [],
  )

  const recordGameEnd = useCallback(
    (
      didWin: boolean,
      score: number,
      level: number,
      combo = 0,
      cityPercent = 0,
    ): ProgressToast[] => {
      const result = processGameEnd(profileRef.current, didWin)
      setProfile(result.profile)
      if (score > 0) {
        setLeaderboard(
          addLeaderboardEntry({
            name: result.profile.playerName,
            score,
            level,
            date: todayString(),
            combo,
            cityPercent,
          }),
        )
      }
      return result.toasts
    },
    [],
  )

  /** Membuka kemampuan baru (Speed Sorting, New Game+) — anti duplikat */
  const unlockAbility = useCallback(
    (unlockId: string): ProgressToast[] => {
      if (profileRef.current.unlocks.includes(unlockId)) {
        return []
      }
      const label = UNLOCK_LABELS[unlockId]
      setProfile((current) =>
        current.unlocks.includes(unlockId)
          ? current
          : { ...current, unlocks: [...current.unlocks, unlockId] },
      )
      return label
        ? [{ emoji: label.emoji, title: `Terbuka: ${label.name}!` }]
        : []
    },
    [],
  )

  const recordRank = useCallback((grade: RankGrade) => {
    setProfile((current) =>
      isBetterRank(grade, current.bestRank)
        ? { ...current, bestRank: grade }
        : current,
    )
  }, [])

  const addEcoPoints = useCallback((amount: number) => {
    setProfile((current) => ({
      ...current,
      ecoPoints: current.ecoPoints + amount,
    }))
  }, [])

  /** Pasang/lepas perlengkapan Eco Ranger */
  const toggleEquipped = useCallback((itemId: string) => {
    setProfile((current) => ({
      ...current,
      equipped: current.equipped.includes(itemId)
        ? current.equipped.filter((id) => id !== itemId)
        : [...current.equipped, itemId],
    }))
  }, [])

  const selectCompanion = useCallback((companionId: string | null) => {
    setProfile((current) => ({ ...current, activeCompanion: companionId }))
  }, [])

  const recordMasteryScore = useCallback(
    (modeId: string, score: number) => {
      setProfile((current) =>
        score > (current.masteryScores[modeId] ?? 0)
          ? {
              ...current,
              masteryScores: { ...current.masteryScores, [modeId]: score },
            }
          : current,
      )
    },
    [],
  )

  const markEndingSeen = useCallback(() => {
    setProfile((current) =>
      current.hasSeenEnding ? current : { ...current, hasSeenEnding: true },
    )
  }, [])

  const setPlayerName = useCallback((playerName: string) => {
    const cleaned = playerName.trim().slice(0, 20)
    setProfile((current) => ({
      ...current,
      playerName: cleaned || 'Eco Ranger',
    }))
  }, [])

  const toggleMuted = useCallback(() => {
    setProfile((current) => ({ ...current, isMuted: !current.isMuted }))
  }, [])

  return {
    profile,
    dailyMissions,
    leaderboard,
    recordAnswer,
    recordLevelComplete,
    recordGameEnd,
    addEcoPoints,
    unlockAbility,
    recordRank,
    toggleEquipped,
    selectCompanion,
    recordMasteryScore,
    markEndingSeen,
    setPlayerName,
    toggleMuted,
  }
}
