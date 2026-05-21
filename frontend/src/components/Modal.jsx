import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-panel w-full max-w-lg p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-silver">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="border border-glass-border p-2 text-silver-muted transition-none"
            >
              <X size={14} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
)

export default Modal
