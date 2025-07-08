import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

function Loading() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/home', { replace: true })
    } else {
      navigate('/login', { replace: true })
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
