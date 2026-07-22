import { AnimatePresence, motion } from 'framer-motion'
import type { GameEventId } from '../types/game'
import { getGameEvent } from '../data/endgame'

interface EventBannerProps {
  eventId: GameEventId | null
  hasComboShield: boolean
}

// Pengumuman event acak Chaos City (Level 6)
export function EventBanner({ eventId, hasComboShield }: EventBannerProps) {
  const event = eventId ? getGameEvent(eventId) : null
  const isVisible = Boolean(event) || hasComboShield

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={eventId ?? 'shield'}
          initial={{ opacity: 0, y: -12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          className="flex items-center gap-2.5 rounded-2xl border-2 border-amber-300 bg-amber-50 px-3.5 py-2 shadow"
        >
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xl"
            aria-hidden="true"
          >
            {event?.emoji ?? '🛡️'}
          </motion.span>
          <div className="min-w-0 text-left">
            <p className="text-xs font-extrabold text-amber-800">
              {event?.name ?? 'Perisai Combo Aktif'}
            </p>
            <p className="text-[10px] font-semibold text-amber-700/80">
              {event?.description ?? 'Satu kesalahan tidak akan mereset combo.'}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
