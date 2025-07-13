import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
} from '../components/ui/card'
import axios from '@/lib/axios'
import { useAtom } from 'jotai';
import { tokenAtom, userAtom } from '../atoms/loginAtoms';
import { Store } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [token] = useAtom(tokenAtom);
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
        let res = await axios.get('/api/settings')
        console.log(res.data)
        res = await axios.post('/api/login', { username, password })
        console.log(res.data)
        const token = res.data.token
        
        // Set token in atoms first so axios interceptor can use it
        setToken(token)
        
        res = await axios.get('/api/me')
        console.log(res.data)
        const user = res.data;

        // Set user in atoms
        setUser(user)

        if (user.role === 'admin') {
          console.log('navigate..')
          navigate('/admin', { replace: true })
        } else if (user.role === 'buyer') {
          navigate('/home', { replace: true })
        } else if (user.role === 'seller') {
          navigate('/seller', { replace: true })
        }
        
      // const user = await login(username, password)
      // if (user && user.role === 'buyer') navigate('/buyer', { replace: true })
      // if (user && user.role === 'seller') navigate('/seller', { replace: true })
      // if (user && user.role === 'admin') navigate('/admin', { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to login')
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Store className="h-5 w-5" />
            <span className="font-bold text-lg">MarketPlace</span>
          </div>
          <h2 className="text-lg font-semibold">Sign in to your account</h2>
        </div>

        {/* Login Form */}
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-1">
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
                <div className="text-red-600 text-xs text-center p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
              {token && (
                <div className="text-green-700 text-xs text-center p-2 bg-green-50 rounded">
                  Logged in. Token saved.
                </div>
              )}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
