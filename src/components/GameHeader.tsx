import { Home, Volume2, VolumeX } from 'lucide-react'

interface GameHeaderProps {
  levelName: string
  isMuted: boolean
  onToggleMute: () => void
  onExit: () => void
}

export function GameHeader({
  levelName,
  isMuted,
  onToggleMute,
  onExit,
}: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <button
        type="button"
        onClick={onExit}
        className="rounded-xl bg-white/90 p-2 text-emerald-800 shadow transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label="Kembali ke beranda"
      >
        <Home className="h-5 w-5" aria-hidden="true" />
      </button>
      <h1 className="rounded-xl bg-white/90 px-4 py-1.5 text-sm font-extrabold text-emerald-900 shadow sm:text-base">
        {levelName}
      </h1>
      <button
        type="button"
        onClick={onToggleMute}
        className="rounded-xl bg-white/90 p-2 text-emerald-800 shadow transition hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Volume2 className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </header>
  )
}
