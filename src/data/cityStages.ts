import type { CityStage } from '../types/game'

export const CITY_STAGES: CityStage[] = [
  { index: 0, name: 'Kota Tercemar', emoji: '🏭', minPercent: 0 },
  { index: 1, name: 'Mulai Bersih', emoji: '🌱', minPercent: 20 },
  { index: 2, name: 'Kota Hijau', emoji: '🌳', minPercent: 40 },
  { index: 3, name: 'Eco City', emoji: '🏙️', minPercent: 70 },
  { index: 4, name: 'Perfect Environment', emoji: '🌈', minPercent: 90 },
]

export function getCityStage(percent: number): CityStage {
  let current = CITY_STAGES[0]
  for (const stage of CITY_STAGES) {
    if (percent >= stage.minPercent) {
      current = stage
    }
  }
  return current
}
