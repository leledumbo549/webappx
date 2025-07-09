import Sidebar from '@/components/Sidebar'
import Container from '@/components/Container'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function SellerDashboardLayout() {
  const links = [
    { to: '/seller/dashboard', label: 'Dashboard' },
    { to: '/seller/products', label: 'Products' },
    { to: '/seller/orders', label: 'Orders' },
    { to: '/seller/payouts', label: 'Payouts' },
    { to: '/seller/profile', label: 'Profile' },
  ]
  const location = useLocation()
  const navigate = useNavigate()
  const titleMap: Record<string, string> = {
    '/seller/dashboard': 'Dashboard',
    '/seller/products': 'Products',
    '/seller/orders': 'Orders',
    '/seller/payouts': 'Payouts',
    '/seller/profile': 'Profile',
  }
  const title = titleMap[location.pathname] || 'Seller'
  const isDeep = location.pathname.split('/').length > 3
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b py-4">
        <Container className="flex items-center justify-between">
          {isDeep ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="focus-visible:ring"
            >
              <ArrowLeft className="size-5" />
            </Button>
          ) : (
            <span className="w-9" />
          )}
          <span className="flex-1 text-center font-semibold">{title}</span>
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
