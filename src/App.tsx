import { HashRouter, Routes, Route } from 'react-router-dom'
import Loading from './pages/Loading'
import Login from './pages/Login'
import Home from './pages/buyer/Home'
import SellerDashboard from './pages/seller/SellerDashboard'
import AddProduct from './pages/seller/AddProduct'
import EditProduct from './pages/seller/EditProduct'
import ViewProduct from './pages/seller/ViewProduct'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
        <Route path="/seller/view-product/:id" element={<ViewProduct />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </HashRouter>
  )
}

export default App
