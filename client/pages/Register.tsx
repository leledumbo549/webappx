import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'
import axios from '@/lib/axios'
import { Store, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload: Record<string, unknown> = {
      name: formData.get('name'),
      username: formData.get('username'),
      password: formData.get('password'),
      role,
    }

    if (role === 'seller') {
      payload.storeName = formData.get('storeName')
      payload.contact = formData.get('contact')
      payload.bio = formData.get('bio')
    }

    try {
      await axios.post('/api/register', payload)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-2xl">MarketPlace</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Create an account
          </h2>
        </div>
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input id="name" name="name" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(val) => setRole(val as 'buyer' | 'seller')}
                  className="flex gap-4"
                >
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="buyer" /> Buyer
                  </Label>
                  <Label className="flex items-center gap-2">
                    <RadioGroupItem value="seller" /> Seller
                  </Label>
                </RadioGroup>
              </div>
              {role === 'seller' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-sm font-medium">
                      Store Name
                    </Label>
                    <Input
                      id="storeName"
                      name="storeName"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-sm font-medium">
                      Contact
                    </Label>
                    <Input id="contact" name="contact" disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Account created, redirecting...
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
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <button
            type="button"
            className="underline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
