import { motion } from 'framer-motion'
import type { TrashItem } from '../types/game'

interface TrashQueueProps {
  upcoming: TrashItem[]
}

// Pratinjau sampah berikutnya — memberi kesan "banyak sampah datang sekaligus"
// sekaligus menjaga input tetap satu jawaban pada satu waktu (Level 6-7).
export function TrashQueue({ upcoming }: TrashQueueProps) {
  if (upcoming.length === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700/70">
        Antre
      </span>
      {upcoming.map((item, index) => (
        <motion.div
          key={`${item.id}-${index}`}
          layout
          initial={{ opacity: 0, x: 20, scale: 0.7 }}
          animate={{ opacity: 1 - index * 0.22, x: 0, scale: 1 - index * 0.12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-200 bg-white/80 text-xl shadow-sm"
          title={item.name}
        >
          <span aria-hidden="true">{item.emoji}</span>
          <span className="sr-only">{item.name}</span>
        </motion.div>
      ))}
    </div>
  )
}
