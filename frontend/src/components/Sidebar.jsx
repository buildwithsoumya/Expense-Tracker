import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ReceiptText,
  LineChart,
  Layers,
  Settings,
  X,
} from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import Modal from './Modal'
import FeedbackCard from './FeedbackCard'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/expenses', label: 'Expenses', icon: <ReceiptText size={18} /> },
  { to: '/analytics', label: 'Analytics', icon: <LineChart size={18} /> },
  { to: '/categories', label: 'Categories', icon: <Layers size={18} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

const Sidebar = ({ open, onClose }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
  <>
    <aside className="hidden min-h-screen w-64 border-r border-glass-border bg-charcoal/70 p-6 md:flex md:flex-col">
      <Logo
        variant="full"
        className="text-silver"
        wordmarkClassName="text-base"
        singleLineWordmark
      />
      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-graphite text-silver border border-glass-border'
                  : 'text-silver-muted hover:text-silver'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-4">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="px-4 py-3 text-xs text-silver-muted transition hover:text-silver text-left"
        >
          We'd love your feedback!
        </button>
        <div className="border border-glass-border bg-graphite/60 p-4 text-xs text-silver-muted">
          Precision finance, refined for quiet confidence.
        </div>
      </div>
    </aside>

    <div
      className={`fixed inset-0 z-40 bg-black/70 transition-opacity md:hidden ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-glass-border bg-charcoal/90 p-6 transition-transform md:hidden ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between">
        <Logo variant="compact" className="text-silver" wordmarkClassName="text-base" />
        <button
          type="button"
          onClick={onClose}
          className="border border-glass-border p-2 text-silver-muted hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      <nav className="mt-10 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-graphite text-silver border border-glass-border'
                  : 'text-silver-muted hover:text-silver'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="px-4 py-3 text-xs text-silver-muted transition hover:text-silver w-full text-left"
        >
          We'd love your feedback!
        </button>
      </div>
    </aside>

    <Modal
      open={feedbackOpen}
      onClose={() => setFeedbackOpen(false)}
      title=""
    >
      <FeedbackCard />
    </Modal>
  </>
  )
}

export default Sidebar
