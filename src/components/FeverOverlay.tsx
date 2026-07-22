import { motion } from 'framer-motion'

interface FeverOverlayProps {
  combo: number
}

// Lapisan visual Eco Fever — nyala membara di tepi layar saat POINT x2 aktif.
// PENTING: komponen ini harus mengembalikan SATU elemen akar. AnimatePresence
// tidak bisa melacak siklus keluar dari Fragment, sehingga overlay akan
// tersangkut di DOM setelah fever berakhir.
export function FeverOverlay({ combo }: FeverOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    >
      <motion.div
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(249,115,22,0.55)_100%)]"
      />
      <div className="absolute inset-x-0 top-16 flex justify-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 0.7 }}
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-1.5 shadow-lg"
        >
          <span className="text-sm font-black tracking-wide text-white">
            🔥 ECO FEVER! POINT x2 · combo {combo}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
