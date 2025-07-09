import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import AdminDashboardLayout from '../layouts/AdminDashboardLayout'
import ProtectedRoute from '../components/ProtectedRoute'

const Dashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'))
const ManageSellers = lazy(() => import('../pages/admin/ManageSellers'))
const ManageProducts = lazy(() => import('../pages/admin/ManageProducts'))
const Reports = lazy(() => import('../pages/admin/Reports'))
const Settings = lazy(() => import('../pages/admin/SiteSettings'))

const adminRoutes = {
  element: <ProtectedRoute allowedRoles={['admin']} />,
  children: [
    {
      path: '/admin',
      element: <AdminDashboardLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'users', element: <ManageUsers /> },
        { path: 'sellers', element: <ManageSellers /> },
        { path: 'products', element: <ManageProducts /> },
        { path: 'reports', element: <Reports /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ],
}

export default adminRoutes
