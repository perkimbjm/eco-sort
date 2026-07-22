import { motion } from 'framer-motion'
import type { CategoryInfo, TrashCategory } from '../types/game'

const CATEGORY_STYLES: Record<TrashCategory, string> = {
  plastik:
    'bg-yellow-400 hover:bg-yellow-300 border-yellow-600 text-yellow-950',
  organik: 'bg-green-500 hover:bg-green-400 border-green-700 text-green-950',
  kertas: 'bg-blue-400 hover:bg-blue-300 border-blue-600 text-blue-950',
  residu: 'bg-slate-400 hover:bg-slate-300 border-slate-600 text-slate-950',
  logam: 'bg-orange-400 hover:bg-orange-300 border-orange-600 text-orange-950',
  b3: 'bg-red-500 hover:bg-red-400 border-red-700 text-red-50',
}

interface CategoryButtonProps {
  category: CategoryInfo
  isDisabled: boolean
  onSelect: (category: TrashCategory) => void
}

export function CategoryButton({
  category,
  isDisabled,
  onSelect,
}: CategoryButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.92 }}
      disabled={isDisabled}
      onClick={() => onSelect(category.id)}
      className={`flex flex-col items-center gap-1 rounded-2xl border-b-4 px-2 py-3 font-bold shadow-md transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 ${CATEGORY_STYLES[category.id]}`}
      aria-label={`Buang ke tong ${category.label}`}
    >
      <span className="text-2xl sm:text-3xl" aria-hidden="true">
        {category.emoji}
      </span>
      <span className="text-xs sm:text-sm">{category.label}</span>
    </motion.button>
  )
}
