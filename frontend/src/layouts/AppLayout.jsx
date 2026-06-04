import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink text-silver">
      <div className="relative flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 pb-10 pt-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
