import { lazy } from 'react'
import BuyerLayout from '../layouts/BuyerLayout'
import PrivateRoute from '../components/PrivateRoute'
import { Navigate } from 'react-router-dom'

const Home = lazy(() => import('../pages/buyer/Home'))
const Catalog = lazy(() => import('../pages/buyer/Catalog'))
const ProductDetail = lazy(() => import('../pages/buyer/ProductDetail'))
const Cart = lazy(() => import('../pages/buyer/Cart'))
const Checkout = lazy(() => import('../pages/buyer/Checkout'))
const Orders = lazy(() => import('../pages/buyer/Orders'))
const Profile = lazy(() => import('../pages/buyer/Profile'))

const buyerRoutes = {
  element: <PrivateRoute allowedRoles={['buyer']} />,
  children: [
    {
      path: '/buyer',
      element: <BuyerLayout />,
      children: [
        { index: true, element: <Navigate to="home" replace /> },
        { path: 'home', element: <Home /> },
        { path: 'catalog', element: <Catalog /> },
        { path: 'product/:id', element: <ProductDetail /> },
        { path: 'cart', element: <Cart /> },
        { path: 'checkout', element: <Checkout /> },
        { path: 'orders', element: <Orders /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
  ],
}

export default buyerRoutes
