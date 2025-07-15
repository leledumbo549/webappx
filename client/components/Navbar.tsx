import { useAtom } from 'jotai'
import { useNavigate, useLocation } from 'react-router-dom'
import { userAtom, logoutAtom } from '@/atoms/loginAtoms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
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
  FileText,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

function Navbar() {
  const [user] = useAtom(userAtom)
  const [, logout] = useAtom(logoutAtom)
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  const getGuestNavItems = () => [
    {
      label: 'Home',
      path: '/home',
      icon: Home,
      description: 'Browse products and discover deals',
    },
    {
      label: 'Catalog',
      path: '/catalog',
      icon: Package,
      description: 'View all available products',
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingCart,
      description: 'Manage your shopping cart',
    },
    {
      label: 'Login',
      path: '/login',
      icon: User,
      description: 'Sign in to your account',
    },
  ]

  const getBuyerNavItems = () => [
    {
      label: 'Home',
      path: '/home',
      icon: Home,
      description: 'Browse products and discover deals',
    },
    {
      label: 'Catalog',
      path: '/catalog',
      icon: Package,
      description: 'View all available products',
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingCart,
      description: 'Manage your shopping cart',
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: FileText,
      description: 'Track your order history',
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      description: 'Manage your account settings',
    },
  ]

  const getSellerNavItems = () => [
    {
      label: 'Dashboard',
      path: '/seller/dashboard',
      icon: BarChart3,
      description: 'View your store analytics',
    },
    {
      label: 'My Products',
      path: '/seller/products',
      icon: Package,
      description: 'Manage your product catalog',
    },
    {
      label: 'Orders',
      path: '/seller/orders',
      icon: FileText,
      description: 'Process customer orders',
    },
    {
      label: 'Payouts',
      path: '/seller/payouts',
      icon: Store,
      description: 'Track your earnings and payouts',
    },
    {
      label: 'Store Profile',
      path: '/seller/profile',
      icon: User,
      description: 'Update your store information',
    },
  ]

  const getAdminNavItems = () => [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: BarChart3,
      description: 'Platform overview and statistics',
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: Users,
      description: 'Manage user accounts and permissions',
    },
    {
      label: 'Sellers',
      path: '/admin/sellers',
      icon: Store,
      description: 'Approve and manage seller accounts',
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: Package,
      description: 'Review and moderate products',
    },
    {
      label: 'Reports',
      path: '/admin/reports',
      icon: FileText,
      description: 'Handle user reports and issues',
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      description: 'Configure platform settings',
    },
  ]

  const getNavItems = () => {
    if (!user) return getGuestNavItems()
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'seller':
        return 'secondary'
      case 'buyer':
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-0 h-auto"
              onClick={() => navigate('/home')}
            >
              <div className="p-1 bg-primary/10 rounded-lg">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl">MarketPlace</span>
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavigationMenuItem key={item.path}>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          navigationMenuTriggerStyle(),
                          isActive(item.path) &&
                            'bg-accent text-accent-foreground'
                        )}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => navigate(item.path)}
                          className="flex items-center space-x-2"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.name || user.username || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.name || user.username}
                      </span>
                      <Badge
                        variant={getRoleBadgeVariant(user.role || 'buyer')}
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name || user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.username}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    onClick={() => {
                      navigate(item.path)
                      setIsMobileMenuOpen(false)
                    }}
                    className="justify-start h-auto py-3"
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
