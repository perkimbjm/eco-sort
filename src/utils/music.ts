// Backsound game: satu track aktif pada satu waktu, berpindah dengan crossfade.
// Berkas audio berada di public/sound sehingga dirujuk lewat path absolut.

import type { GameStatus } from '../types/game'

export type MusicTrack = 'menu' | 'gameplay' | 'highLevel' | 'combo' | 'victory'

// Mengikuti tier bonus besar (+500) agar track combo terasa langka dan track
// level tetap banyak terdengar. Hype visual pada ScoreBoard sengaja dibiarkan
// di combo 3 — visual merespons cepat, musik menandai capaian yang lebih besar.
export const COMBO_MUSIC_THRESHOLD = 5
// Mulai level ini suasana berubah ke track high-level
export const HIGH_LEVEL_START = 4

// Fungsi murni agar pemilihan track bisa diuji tanpa merender halaman.
export function selectMusicTrack(
  status: GameStatus,
  combo: number,
  level: number,
): MusicTrack | null {
  if (status === 'won') {
    return 'victory'
  }
  if (status === 'gameOver') {
    return null
  }
  if (combo >= COMBO_MUSIC_THRESHOLD) {
    return 'combo'
  }
  return level >= HIGH_LEVEL_START ? 'highLevel' : 'gameplay'
}

const TRACK_SOURCES: Record<MusicTrack, string> = {
  menu: '/sound/main-menu.mp3',
  gameplay: '/sound/main-gameplay.mp3',
  highLevel: '/sound/high-level.mp3',
  combo: '/sound/combo.mp3',
  victory: '/sound/victory.mp3',
}

// Volume dijaga rendah agar sound effect tetap terdengar di atas musik
const TRACK_VOLUME: Record<MusicTrack, number> = {
  menu: 0.35,
  gameplay: 0.3,
  highLevel: 0.32,
  combo: 0.38,
  victory: 0.5,
}

// Victory adalah jingle sekali putar, sisanya backsound berulang
const LOOPING_TRACKS: Record<MusicTrack, boolean> = {
  menu: true,
  gameplay: true,
  highLevel: true,
  combo: true,
  victory: false,
}

const FADE_STEPS = 12
const FADE_STEP_MS = 40

const elements = new Map<MusicTrack, HTMLAudioElement>()
const fadeTimers = new Map<HTMLAudioElement, number>()

let currentTrack: MusicTrack | null = null
let currentAudio: HTMLAudioElement | null = null
let isMuted = false
let isWaitingForUnlock = false

function getElement(track: MusicTrack): HTMLAudioElement {
  const existing = elements.get(track)
  if (existing) {
    return existing
  }
  const audio = new Audio(TRACK_SOURCES[track])
  audio.loop = LOOPING_TRACKS[track]
  // Berkas audio berukuran besar (~14MB total). Unduh header saja lalu
  // streaming saat diputar agar hemat kuota di perangkat sekolah.
  audio.preload = 'metadata'
  audio.volume = TRACK_VOLUME[track]
  elements.set(track, audio)
  return audio
}

function cancelFade(audio: HTMLAudioElement): void {
  const timer = fadeTimers.get(audio)
  if (timer !== undefined) {
    clearInterval(timer)
    fadeTimers.delete(audio)
  }
}

function fade(
  audio: HTMLAudioElement,
  targetVolume: number,
  onDone?: () => void,
): void {
  cancelFade(audio)
  const startVolume = audio.volume
  const delta = targetVolume - startVolume
  if (Math.abs(delta) < 0.01) {
    audio.volume = targetVolume
    onDone?.()
    return
  }
  let step = 0
  const timer = window.setInterval(() => {
    step += 1
    const next = startVolume + (delta * step) / FADE_STEPS
    audio.volume = Math.min(1, Math.max(0, next))
    if (step >= FADE_STEPS) {
      cancelFade(audio)
      onDone?.()
    }
  }, FADE_STEP_MS)
  fadeTimers.set(audio, timer)
}

// Browser memblokir autoplay sampai ada interaksi pengguna. Saat play()
// ditolak, tunggu gestur pertama lalu ulangi track yang sedang aktif.
function waitForUserGesture(): void {
  if (isWaitingForUnlock) {
    return
  }
  isWaitingForUnlock = true
  const unlock = () => {
    isWaitingForUnlock = false
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
    if (currentAudio && !isMuted) {
      void currentAudio.play().catch(() => {
        // Masih diblokir — biarkan tanpa musik
      })
    }
  }
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
}

function startPlayback(audio: HTMLAudioElement): void {
  void audio.play().catch(() => {
    waitForUserGesture()
  })
}

export function playMusic(track: MusicTrack): void {
  if (currentTrack === track) {
    // Track sama: pastikan tetap berjalan (mis. setelah unmute)
    if (currentAudio && !isMuted && currentAudio.paused) {
      startPlayback(currentAudio)
    }
    return
  }

  const previous = currentAudio
  const next = getElement(track)
  currentTrack = track
  currentAudio = next

  if (previous && previous !== next) {
    fade(previous, 0, () => {
      previous.pause()
      previous.currentTime = 0
    })
  }

  cancelFade(next)
  next.currentTime = 0
  next.volume = 0
  if (isMuted) {
    return
  }
  startPlayback(next)
  fade(next, TRACK_VOLUME[track])
}

export function stopMusic(): void {
  const audio = currentAudio
  currentTrack = null
  currentAudio = null
  if (!audio) {
    return
  }
  fade(audio, 0, () => {
    audio.pause()
    audio.currentTime = 0
  })
}

export function setMusicMuted(muted: boolean): void {
  isMuted = muted
  if (!currentAudio) {
    return
  }
  if (muted) {
    cancelFade(currentAudio)
    currentAudio.pause()
    return
  }
  if (currentTrack) {
    currentAudio.volume = 0
    startPlayback(currentAudio)
    fade(currentAudio, TRACK_VOLUME[currentTrack])
  }
}
