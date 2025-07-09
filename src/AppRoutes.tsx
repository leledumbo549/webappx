import { RouterProvider, createHashRouter } from 'react-router-dom'
import Login from './pages/Login'
import Loading from './pages/Loading'
import Placeholder from './components/Placeholder'
import ProtectedRoute from './components/ProtectedRoute'
import BuyerLayout from './layouts/BuyerLayout'
import SellerDashboardLayout from './layouts/SellerDashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import Forbidden from './pages/Forbidden'
import NotFound from './pages/NotFound'

const router = createHashRouter([
  { path: '/', element: <Loading /> },
  { path: '/auth/login', element: <Login /> },
  { path: '/auth/register', element: <Placeholder role="Public" name="Register" /> },
  {
    element: <ProtectedRoute allowedRoles={['buyer']} />,
    children: [
      {
        path: '/buyer',
        element: <BuyerLayout />,
        children: [
          { index: true, element: <Placeholder role="Buyer" name="Dashboard" /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['seller']} />,
    children: [
      {
        path: '/seller',
        element: <SellerDashboardLayout />,
        children: [
          { index: true, element: <Placeholder role="Seller" name="Dashboard" /> },
        ],
      },
    ],
  },
  {
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
  },
  { path: '/forbidden', element: <Forbidden /> },
  { path: '*', element: <NotFound /> },
])

function AppRoutes() {
  return <RouterProvider router={router} />
}

export default AppRoutes
