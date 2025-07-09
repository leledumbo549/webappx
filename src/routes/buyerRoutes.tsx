import BuyerLayout from '../layouts/BuyerLayout'
import Placeholder from '../components/Placeholder'
import ProtectedRoute from '../components/ProtectedRoute'

const buyerRoutes = {
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
}

export default buyerRoutes
