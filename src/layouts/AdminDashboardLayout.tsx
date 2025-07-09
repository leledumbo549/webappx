import Sidebar from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

function AdminDashboardLayout() {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/sellers', label: 'Sellers' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/settings', label: 'Settings' },
  ]
  return (
    <div className="flex flex-col min-h-screen">
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
