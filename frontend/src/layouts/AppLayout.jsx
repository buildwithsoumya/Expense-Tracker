import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const pageTitle = useMemo(() => {
    const map = {
      '/dashboard': 'Dashboard',
      '/expenses': 'Expenses',
      '/analytics': 'Analytics',
      '/categories': 'Categories',
      '/settings': 'Settings',
    }
    return map[location.pathname] ?? 'Dashboard'
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-ink text-silver">
      <div className="pointer-events-none fixed inset-0 bg-radial-blue opacity-70" />
      <div className="pointer-events-none fixed inset-0 bg-radial-purple opacity-70" />
      <div className="relative flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar
            title={pageTitle}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <main className="flex-1 px-4 pb-10 pt-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
