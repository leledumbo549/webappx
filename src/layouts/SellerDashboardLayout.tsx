import Sidebar from '@/components/Sidebar'
import Container from '@/components/Container'
import { Outlet } from 'react-router-dom'

function SellerDashboardLayout() {
  const links = [
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products', label: 'Products' },
    { to: '/seller/orders', label: 'Orders' },
    { to: '/seller/payouts', label: 'Payouts' },
    { to: '/seller/profile', label: 'Profile' },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b py-4">
        <Container className="flex items-center justify-between">
          <Sidebar links={links} />
        </Container>
      </nav>
      <main className="flex-1 py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  )
}

export default SellerDashboardLayout
