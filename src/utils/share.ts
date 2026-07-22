export function buildShareText(score: number, didWin: boolean): string {
  const headline = didWin
    ? 'Saya berhasil membersihkan Eco City! 🏆'
    : 'Saya sedang berjuang membersihkan Eco City! 💪'
  return `${headline}\n\n♻️ ${score} Eco Point\n\nEco Sort Battle — game edukasi pemilahan sampah\nPowered by peduli-sampah.id`
}

export type ShareOutcome = 'shared' | 'copied' | 'failed'

export async function shareResult(
  score: number,
  didWin: boolean,
): Promise<ShareOutcome> {
  const text = buildShareText(score, didWin)
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Eco Sort Battle', text })
      return 'shared'
    }
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch (error: unknown) {
    // Pengguna membatalkan dialog share — bukan kegagalan
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'shared'
    }
    try {
      await navigator.clipboard.writeText(text)
      return 'copied'
    } catch {
      return 'failed'
    }
  }
}
