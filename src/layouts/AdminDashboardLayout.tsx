import Sidebar from '@/components/Sidebar'
import Container from '@/components/Container'
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
      <aside className="border-r py-4">
        <Container className="flex justify-between">
          <Sidebar links={links} />
        </Container>
      </aside>
      <main className="flex-1 py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  )
}

export default AdminDashboardLayout
