import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  allowedRoles: string[]
}

function ProtectedRoute({ allowedRoles }: Props) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
