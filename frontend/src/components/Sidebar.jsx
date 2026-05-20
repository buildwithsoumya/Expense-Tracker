import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ReceiptText,
  LineChart,
  Layers,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/expenses', label: 'Expenses', icon: <ReceiptText size={18} /> },
  { to: '/analytics', label: 'Analytics', icon: <LineChart size={18} /> },
  { to: '/categories', label: 'Categories', icon: <Layers size={18} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

const Sidebar = ({ open, onClose }) => (
  <>
    <aside className="hidden min-h-screen w-64 border-r border-glass-border bg-black/30 p-6 md:flex md:flex-col">
      <div className="flex items-center gap-3 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-electric-blue to-deep-purple">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-silver-muted">SmartSpend AI</p>
          <p className="text-lg font-semibold">Vault</p>
        </div>
      </div>
      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-glass-fill text-white shadow-glow'
                  : 'text-silver-muted hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="glass-card mt-6 p-4 text-xs text-silver-muted">
        AI insights curated for premium spending control.
      </div>
    </aside>

    <div
      className={`fixed inset-0 z-40 bg-black/70 transition-opacity md:hidden ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    />
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-glass-border bg-black/80 p-6 transition-transform md:hidden ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-electric-blue to-deep-purple">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-silver-muted">SmartSpend AI</p>
            <p className="text-lg font-semibold">Vault</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-glass-border p-2 text-silver-muted hover:text-white"
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
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-glass-fill text-white shadow-glow'
                  : 'text-silver-muted hover:text-white'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
)

export default Sidebar
