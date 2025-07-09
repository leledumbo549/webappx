import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'

function BuyerLayout() {
  const links = [{ to: '/buyer', label: 'Dashboard' }]
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="flex items-center justify-between border-b p-4">
        <Sidebar links={links} />
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default BuyerLayout
