import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import type { User } from '@/contexts/AuthContext'

function Loading() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const stored = localStorage.getItem('user')
    if (token && stored) {
      const user: User = JSON.parse(stored) as User
      if (user.role === 'buyer') navigate('/buyer', { replace: true })
      else if (user.role === 'seller') navigate('/seller', { replace: true })
      else if (user.role === 'admin') navigate('/admin', { replace: true })
    } else {
      navigate('/auth/login', { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-transparent" />
      <Footer />
    </div>
  )
}

export default Loading
