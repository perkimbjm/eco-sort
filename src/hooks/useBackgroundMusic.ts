import { useEffect } from 'react'
import { playMusic, setMusicMuted, stopMusic, type MusicTrack } from '../utils/music'

// Menyetel backsound sesuai track yang diminta halaman.
// `null` berarti senyap (mis. saat game over).
export function useBackgroundMusic(
  track: MusicTrack | null,
  isMuted: boolean,
): void {
  useEffect(() => {
    setMusicMuted(isMuted)
  }, [isMuted])

  useEffect(() => {
    if (track) {
      playMusic(track)
    } else {
      stopMusic()
    }
  }, [track])
}
