import AdminDashboardLayout from '../layouts/AdminDashboardLayout'
import Placeholder from '../components/Placeholder'
import ProtectedRoute from '../components/ProtectedRoute'

const adminRoutes = {
  element: <ProtectedRoute allowedRoles={['admin']} />,
  children: [
    {
      path: '/admin',
      element: <AdminDashboardLayout />,
      children: [
        { index: true, element: <Placeholder role="Admin" name="Dashboard" /> },
      ],
    },
  ],
}

export default adminRoutes
