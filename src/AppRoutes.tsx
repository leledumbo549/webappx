import { RouterProvider, createHashRouter } from 'react-router-dom'
import Login from './pages/Login'
import Loading from './pages/Loading'
import Placeholder from './components/Placeholder'
import buyerRoutes from './routes/buyerRoutes'
import sellerRoutes from './routes/sellerRoutes'
import adminRoutes from './routes/adminRoutes'
import Forbidden from './pages/Forbidden'
import NotFound from './pages/NotFound'

const router = createHashRouter([
  { path: '/', element: <Loading /> },
  { path: '/auth/login', element: <Login /> },
  {
    path: '/auth/register',
    element: <Placeholder role="Public" name="Register" />,
  },
  buyerRoutes,
  sellerRoutes,
  adminRoutes,
  { path: '/forbidden', element: <Forbidden /> },
  { path: '*', element: <NotFound /> },
])

function AppRoutes() {
  return <RouterProvider router={router} />
}

export default AppRoutes
