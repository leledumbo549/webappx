import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../atoms/loginAtoms'
import Footer from '../components/Footer'

function Loading() {
  const navigate = useNavigate()
  const [token] = useAtom(tokenAtom)
  const [user] = useAtom(userAtom)

  useEffect(() => {
    console.log('Loading component - token:', token, 'user:', user)
    console.log('Current location:', window.location.href)

    // Check if we have token and user from atoms
    if (token && user) {
      console.log('User authenticated, navigating to:', user.role)
      if (user.role === 'buyer') {
        console.log('Navigating to /home')
        navigate('/home', { replace: true })
      } else if (user.role === 'seller') {
        console.log('Navigating to /seller')
        navigate('/seller', { replace: true })
      } else if (user.role === 'admin') {
        console.log('Navigating to /admin')
        navigate('/admin', { replace: true })
      }
    } else {
      console.log('No authentication, redirecting to login')
      console.log('Navigating to /login')
      // No authentication, redirect to login
      navigate('/login', { replace: true })
    }
  }, [navigate, token, user])

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-transparent" />
      <Footer />
    </div>
  )
}

export default Loading
