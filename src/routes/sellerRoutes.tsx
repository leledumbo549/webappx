import SellerDashboardLayout from '../layouts/SellerDashboardLayout'
import Placeholder from '../components/Placeholder'
import ProtectedRoute from '../components/ProtectedRoute'

const sellerRoutes = {
  element: <ProtectedRoute allowedRoles={['seller']} />,
  children: [
    {
      path: '/seller',
      element: <SellerDashboardLayout />,
      children: [
        {
          index: true,
          element: <Placeholder role="Seller" name="Dashboard" />,
        },
      ],
    },
  ],
}

export default sellerRoutes
