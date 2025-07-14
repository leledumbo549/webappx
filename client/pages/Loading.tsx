import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../atoms/loginAtoms'
import Footer from '../components/Footer'

// Redirect users based on authentication. Guests are sent to the public home
// page while authenticated users land on their respective dashboards.
function Loading() {
  const navigate = useNavigate()
  const [token] = useAtom(tokenAtom)
  const [user] = useAtom(userAtom)

  useEffect(() => {
    console.log('Loading component - token:', token, 'user:', user)
    console.log('Current location:', window.location.href)

    // If authenticated, route to the proper dashboard
    if (token && user) {
      console.log('User authenticated, navigating to:', user.role)
      if (user.role === 'buyer') {
        navigate('/home', { replace: true })
      } else if (user.role === 'seller') {
        navigate('/seller', { replace: true })
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      }
    } else {
      // Guests should land on the public home page
      navigate('/home', { replace: true })
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
