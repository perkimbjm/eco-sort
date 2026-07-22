// Sound effect sederhana memakai Web Audio API — tanpa file audio eksternal
let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new AudioContext()
    }
    if (audioContext.state === 'suspended') {
      void audioContext.resume()
    }
    return audioContext
  } catch {
    return null
  }
}

function playTone(
  frequency: number,
  durationMs: number,
  delayMs = 0,
  type: OscillatorType = 'square',
): void {
  const ctx = getContext()
  if (!ctx) {
    return
  }
  const start = ctx.currentTime + delayMs / 1000
  const end = start + durationMs / 1000
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.06, start)
  gain.gain.exponentialRampToValueAtTime(0.001, end)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(end)
}

export type SoundEffect = 'correct' | 'wrong' | 'levelUp' | 'gameOver'

export function playSound(effect: SoundEffect, isMuted: boolean): void {
  if (isMuted) {
    return
  }
  switch (effect) {
    case 'correct':
      playTone(660, 90)
      playTone(880, 120, 90)
      break
    case 'wrong':
      playTone(220, 180, 0, 'sawtooth')
      playTone(160, 220, 120, 'sawtooth')
      break
    case 'levelUp':
      playTone(523, 110)
      playTone(659, 110, 110)
      playTone(784, 110, 220)
      playTone(1047, 240, 330)
      break
    case 'gameOver':
      playTone(392, 160, 0, 'triangle')
      playTone(311, 160, 160, 'triangle')
      playTone(247, 320, 320, 'triangle')
      break
  }
}
