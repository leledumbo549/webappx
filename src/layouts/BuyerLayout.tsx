import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'

function BuyerLayout() {
  const links = [
    { to: '/buyer', label: 'Home' },
    { to: '/buyer/catalog', label: 'Catalog' },
    { to: '/buyer/cart', label: 'Cart' },
    { to: '/buyer/orders', label: 'Orders' },
    { to: '/buyer/profile', label: 'Profile' },
  ]
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <nav className="flex items-center justify-between border-b p-4">
          <Sidebar links={links} />
        </nav>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default BuyerLayout
