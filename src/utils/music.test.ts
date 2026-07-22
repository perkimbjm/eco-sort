import { describe, expect, test } from 'vitest'
import {
  COMBO_MUSIC_THRESHOLD,
  HIGH_LEVEL_START,
  selectMusicTrack,
} from './music'

describe('selectMusicTrack', () => {
  test('menang memutar jingle victory', () => {
    expect(selectMusicTrack('won', 0, 5)).toBe('victory')
  })

  test('victory menang atas combo dan high-level', () => {
    expect(selectMusicTrack('won', 10, 5)).toBe('victory')
  })

  test('kalah membuat backsound senyap', () => {
    expect(selectMusicTrack('gameOver', 0, 1)).toBe(null)
    expect(selectMusicTrack('gameOver', 10, 5)).toBe(null)
  })

  test('level 1-3 memakai track gameplay biasa', () => {
    expect(selectMusicTrack('playing', 0, 1)).toBe('gameplay')
    expect(selectMusicTrack('playing', 0, 2)).toBe('gameplay')
    expect(selectMusicTrack('playing', 0, 3)).toBe('gameplay')
  })

  test('level 4 dan 5 memakai track high-level', () => {
    expect(selectMusicTrack('playing', 0, HIGH_LEVEL_START)).toBe('highLevel')
    expect(selectMusicTrack('playing', 0, 5)).toBe('highLevel')
  })

  test('combo di bawah ambang belum mengganti track', () => {
    expect(selectMusicTrack('playing', COMBO_MUSIC_THRESHOLD - 1, 1)).toBe(
      'gameplay',
    )
    expect(selectMusicTrack('playing', COMBO_MUSIC_THRESHOLD - 1, 5)).toBe(
      'highLevel',
    )
  })

  test('combo mencapai ambang mengganti ke track combo', () => {
    expect(selectMusicTrack('playing', COMBO_MUSIC_THRESHOLD, 1)).toBe('combo')
    expect(selectMusicTrack('playing', COMBO_MUSIC_THRESHOLD + 3, 1)).toBe(
      'combo',
    )
  })

  test('combo mengalahkan high-level di level 4-5', () => {
    expect(selectMusicTrack('playing', COMBO_MUSIC_THRESHOLD, 5)).toBe('combo')
  })

  test('level selesai mempertahankan track level yang sedang berjalan', () => {
    expect(selectMusicTrack('levelComplete', 0, 2)).toBe('gameplay')
    expect(selectMusicTrack('levelComplete', 0, 4)).toBe('highLevel')
  })

  test('ambang combo mengikuti tier bonus besar', () => {
    expect(COMBO_MUSIC_THRESHOLD).toBe(5)
  })
})
