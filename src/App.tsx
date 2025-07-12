import { HashRouter, Routes, Route } from 'react-router-dom'
import { useAtom } from 'jotai'
import { isAuthenticatedAtom } from '@/atoms/loginAtoms'
import Loading from './pages/Loading'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/buyer/Home'
import Catalog from './pages/buyer/Catalog'
import Cart from './pages/buyer/Cart'
import Orders from './pages/buyer/Orders'
import Profile from './pages/buyer/Profile'
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

function App() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)

  return (
    <HashRouter>
      <div className="min-h-screen bg-background">
        {isAuthenticated && <Navbar />}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/login" element={<Login />} />
            
            {/* Buyer Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            
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
        </main>
      </div>
    </HashRouter>
  )
}

export default App
