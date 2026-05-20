import { Menu, LogOut, Sparkles } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Navbar = ({ title, onOpenSidebar }) => {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-glass-border bg-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-full border border-glass-border p-2 text-silver-muted hover:text-white md:hidden"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
              {title}
            </p>
            <h2 className="text-lg font-semibold text-silver">Expense Command</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-glass-border px-3 py-2 text-xs text-silver-muted md:flex">
            <Sparkles size={14} />
            AI Sync Enabled
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2 text-xs font-semibold text-silver hover:text-white"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
