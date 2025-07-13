import { HashRouter, Routes, Route } from 'react-router-dom'
import { useAtom } from 'jotai'
import { isAuthenticatedAtom, tokenAtom, userAtom } from '@/atoms/loginAtoms'
import { useEffect } from 'react'
import axios from '@/lib/axios'
import Loading from './pages/Loading'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/buyer/Home'
import Catalog from './pages/buyer/Catalog'
import Cart from './pages/buyer/Cart'
import Orders from './pages/buyer/Orders'
import Profile from './pages/buyer/Profile'
import ProductDetail from './pages/buyer/ProductDetail'
import SellerDashboard from './pages/seller/SellerDashboard'
import AddProduct from './pages/seller/AddProduct'
import EditProduct from './pages/seller/EditProduct'
import ViewProduct from './pages/seller/ViewProduct'
import MyProducts from './pages/seller/MyProducts'
import OrdersReceived from './pages/seller/OrdersReceived'
import Payouts from './pages/seller/Payouts'
import StoreProfile from './pages/seller/StoreProfile'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageSellers from './pages/admin/ManageSellers'
import ManageProducts from './pages/admin/ManageProducts'
import Reports from './pages/admin/Reports'
import SiteSettings from './pages/admin/SiteSettings'
import { Toaster } from './components/ui/sonner'

function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [token] = useAtom(tokenAtom)
  const [, setUser] = useAtom(userAtom)

  // Validate stored token on app startup
  useEffect(() => {
    const validateStoredToken = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/me')
          setUser(res.data)
        } catch {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          window.location.hash = '/login'
        }
      }
    }

    validateStoredToken()
  }, [token, setUser])

  return (
    <HashRouter>
      <div className="min-h-screen bg-background">
        {isAuthenticated && <Navbar />}
        <main className="flex justify-center px-4 py-6">
          <div className="w-full max-w-7xl">
            <Routes>
              <Route path="/" element={<Loading />} />
              <Route path="/login" element={<Login />} />
              
              {/* Buyer Routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/buyer/product/:id" element={<ProductDetail />} />
              
              {/* Seller Routes */}
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<MyProducts />} />
              <Route path="/seller/add-product" element={<AddProduct />} />
              <Route path="/seller/edit-product/:id" element={<EditProduct />} />
              <Route path="/seller/view-product/:id" element={<ViewProduct />} />
              <Route path="/seller/orders" element={<OrdersReceived />} />
              <Route path="/seller/payouts" element={<Payouts />} />
              <Route path="/seller/profile" element={<StoreProfile />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/sellers" element={<ManageSellers />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<SiteSettings />} />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster />
    </HashRouter>
  )
}

export default App
