import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import Container from '@/components/Container'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function BuyerLayout() {
  const links = [
    { to: '/buyer', label: 'Home' },
    { to: '/buyer/catalog', label: 'Catalog' },
    { to: '/buyer/cart', label: 'Cart' },
    { to: '/buyer/orders', label: 'Orders' },
    { to: '/buyer/profile', label: 'Profile' },
  ]
  const location = useLocation()
  const navigate = useNavigate()

  const titleMap: Record<string, string> = {
    '/buyer': 'Home',
    '/buyer/catalog': 'Catalog',
    '/buyer/cart': 'Cart',
    '/buyer/checkout': 'Checkout',
    '/buyer/orders': 'Orders',
    '/buyer/profile': 'Profile',
  }
  let title = titleMap[location.pathname] || 'Product'
  const isDeep = location.pathname.split('/').length > 3
  return (
    <CartProvider>
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
        <Footer />
      </div>
    </CartProvider>
  )
}

export default BuyerLayout
