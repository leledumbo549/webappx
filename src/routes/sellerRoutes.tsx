import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import SellerDashboardLayout from '../layouts/SellerDashboardLayout'
import ProtectedRoute from '../components/ProtectedRoute'

const Dashboard = lazy(() => import('../pages/seller/SellerDashboard'))
const Products = lazy(() => import('../pages/seller/MyProducts'))
const AddProduct = lazy(() => import('../pages/seller/AddProduct'))
const EditProduct = lazy(() => import('../pages/seller/EditProduct'))
const Orders = lazy(() => import('../pages/seller/OrdersReceived'))
const Payouts = lazy(() => import('../pages/seller/Payouts'))
const Profile = lazy(() => import('../pages/seller/StoreProfile'))

const sellerRoutes = {
  element: <ProtectedRoute allowedRoles={['seller']} />,
  children: [
    {
      path: '/seller',
      element: <SellerDashboardLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'products', element: <Products /> },
        { path: 'products/new', element: <AddProduct /> },
        { path: 'products/:id/edit', element: <EditProduct /> },
        { path: 'orders', element: <Orders /> },
        { path: 'payouts', element: <Payouts /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
  ],
}

export default sellerRoutes
