import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import axios from '@/lib/axios'
import { useAtom } from 'jotai'
import { tokenAtom, userAtom } from '../atoms/loginAtoms'
import { Store, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [token] = useAtom(tokenAtom)
  const [, setToken] = useAtom(tokenAtom)
  const [, setUser] = useAtom(userAtom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

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
      const user = res.data

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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-2xl">MarketPlace</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The digital trade nexus
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            Sign in to your account
          </h2>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {token && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <span>Logged in successfully</span>
                      <Badge variant="secondary" className="text-xs">
                        Token saved
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            className="underline"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
