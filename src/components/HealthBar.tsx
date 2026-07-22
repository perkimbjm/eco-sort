import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { MAX_HEALTH } from '../hooks/useGame'

interface HealthBarProps {
  health: number
  /** Mode tertentu punya nyawa maksimum berbeda, mis. Perfect Mode hanya 1 */
  maxHealth?: number
}

export function HealthBar({ health, maxHealth = MAX_HEALTH }: HealthBarProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Nyawa tersisa ${health} dari ${maxHealth}`}
    >
      {Array.from({ length: maxHealth }, (_, index) => {
        const isAlive = index < health
        return (
          <motion.span
            key={index}
            animate={isAlive ? { scale: 1 } : { scale: [1, 1.4, 0.9] }}
            transition={{ duration: 0.35 }}
          >
            <Heart
              className={`h-6 w-6 ${
                isAlive
                  ? 'fill-red-500 text-red-600'
                  : 'fill-slate-300 text-slate-400'
              }`}
              aria-hidden="true"
            />
          </motion.span>
        )
      })}
    </div>
  )
}
