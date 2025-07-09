import Sidebar from '@/components/Sidebar'
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
      <nav className="flex items-center justify-between border-b p-4">
        <Sidebar links={links} />
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default SellerDashboardLayout
