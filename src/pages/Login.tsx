import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await axios.post('/api/login', { username, password })
      const { token } = res.data as { token: string }
      localStorage.setItem('token', token)
      setToken(token)
      navigate('/home', { replace: true })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to login')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
      {token && <p className="text-green-700">Logged in. Token saved.</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  )
}

export default Login
