import { useCallback, useEffect, useRef, useState } from 'react'
import type { DailyMissions, LeaderboardEntry, Profile } from '../types/game'
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

  const recordLevelComplete = useCallback((): ProgressToast[] => {
    const result = processLevelComplete(profileRef.current)
    setProfile(result.profile)
    return result.toasts
  }, [])

  const recordGameEnd = useCallback(
    (didWin: boolean, score: number, level: number): ProgressToast[] => {
      const result = processGameEnd(profileRef.current, didWin)
      setProfile(result.profile)
      if (score > 0) {
        setLeaderboard(
          addLeaderboardEntry({
            name: result.profile.playerName,
            score,
            level,
            date: todayString(),
          }),
        )
      }
      return result.toasts
    },
    [],
  )

  const addEcoPoints = useCallback((amount: number) => {
    setProfile((current) => ({
      ...current,
      ecoPoints: current.ecoPoints + amount,
    }))
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
    setPlayerName,
    toggleMuted,
  }
}
