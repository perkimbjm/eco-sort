import { useCallback, useRef, useState } from 'react'
import type { ProgressToast } from '../utils/progression'

const TOAST_DURATION_MS = 3200

export interface ActiveToast extends ProgressToast {
  id: number
}

export function useToasts() {
  const [toasts, setToasts] = useState<ActiveToast[]>([])
  const nextId = useRef(1)

  const pushToasts = useCallback((incoming: ProgressToast[]) => {
    if (incoming.length === 0) {
      return
    }
    const stamped = incoming.map((toast) => ({
      ...toast,
      id: nextId.current++,
    }))
    setToasts((current) => [...current, ...stamped])
    for (const toast of stamped) {
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== toast.id))
      }, TOAST_DURATION_MS)
    }
  }, [])

  return { toasts, pushToasts }
}
