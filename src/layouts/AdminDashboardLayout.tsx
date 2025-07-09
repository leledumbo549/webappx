import Sidebar from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

function AdminDashboardLayout() {
  const links = [
    { to: '/admin', label: 'Dashboard' },
  ]
  return (
    <div className="flex min-h-screen">
      <aside className="border-r p-4">
        <Sidebar links={links} />
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminDashboardLayout
