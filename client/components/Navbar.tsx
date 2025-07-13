import { useAtom } from 'jotai'
import { useNavigate, useLocation } from 'react-router-dom'
import { userAtom, logoutAtom } from '@/atoms/loginAtoms'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  ShoppingCart, 
  Store, 
  Settings, 
  User, 
  LogOut, 
  Home,
  Package,
  BarChart3,
  Users,
  FileText
} from 'lucide-react'

function Navbar() {
  const [user] = useAtom(userAtom)
  const [, logout] = useAtom(logoutAtom)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  if (!user) return null

  const getBuyerNavItems = () => [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Catalog', path: '/catalog', icon: Package },
    { label: 'Cart', path: '/cart', icon: ShoppingCart },
    { label: 'Orders', path: '/orders', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  const getSellerNavItems = () => [
    { label: 'Dashboard', path: '/seller/dashboard', icon: BarChart3 },
    { label: 'My Products', path: '/seller/products', icon: Package },
    { label: 'Orders', path: '/seller/orders', icon: FileText },
    { label: 'Payouts', path: '/seller/payouts', icon: Store },
    { label: 'Store Profile', path: '/seller/profile', icon: User },
  ]

  const getAdminNavItems = () => [
    { label: 'Dashboard', path: '/admin', icon: BarChart3 },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Sellers', path: '/admin/sellers', icon: Store },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  const getNavItems = () => {
    switch (user.role) {
      case 'buyer':
        return getBuyerNavItems()
      case 'seller':
        return getSellerNavItems()
      case 'admin':
        return getAdminNavItems()
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-center px-4">
        <div className="w-full max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/home')}
              >
                <Store className="h-6 w-6" />
                <span className="font-bold text-xl">MarketPlace</span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className="justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 