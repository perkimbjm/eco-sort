import { AnimatePresence, motion } from 'framer-motion'
import type { ActiveToast } from '../hooks/useToasts'

interface ToastStackProps {
  toasts: ActiveToast[]
}

export function ToastStack({ toasts }: ToastStackProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-3 z-40 flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            className="flex items-center gap-2.5 rounded-2xl border-2 border-yellow-300 bg-white/95 px-4 py-2 shadow-xl"
          >
            <span className="text-2xl" aria-hidden="true">
              {toast.emoji}
            </span>
            <div className="text-left">
              <p className="text-sm font-extrabold text-emerald-900">
                {toast.title}
              </p>
              {toast.subtitle && (
                <p className="text-xs text-slate-500">{toast.subtitle}</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
