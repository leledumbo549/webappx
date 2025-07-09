import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../components/ui/card'
import Title from '../components/Title'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const user = await login(username, password)
      setToken(localStorage.getItem('token'))
      if (user && user.role === 'buyer') navigate('/buyer', { replace: true })
      if (user && user.role === 'seller') navigate('/seller', { replace: true })
      if (user && user.role === 'admin') navigate('/admin', { replace: true })
    } catch (err) {
      if (Axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to login')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2 portrait:px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2 border-b mb-2 pb-4">
          <Title />
          <CardTitle className="text-2xl font-bold">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            {token && (
              <div className="text-green-700 text-sm text-center">
                Logged in. Token saved.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
