import { Menu, LogOut } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Navbar = ({ onOpenSidebar }) => {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-glass-border bg-black/70 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="border border-glass-border p-2 text-silver-muted hover:text-white md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={logout}
            className="btn-slide inline-flex items-center gap-2 border border-glass-border px-5 py-3 text-sm font-semibold text-silver hover:text-white"
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
