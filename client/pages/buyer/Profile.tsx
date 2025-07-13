import { useAtom } from 'jotai'
import { userAtom } from '@/atoms/loginAtoms'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import axios from '@/lib/axios'
import { User, Save, AlertCircle, Loader2, UserCheck } from 'lucide-react'

function Profile() {
  const [user, setUser] = useAtom(userAtom)
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setUsername(user.username || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('User data not available')
      return
    }

    setSaving(true)
    setError(null)
    
    try {
      const res = await axios.put('/api/me', {
        name: name.trim(),
        username: username.trim()
      })
      
      // Update the user atom with new data
      setUser(res.data)
      
      toast.success('Profile updated successfully!')
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      
      if (err.response?.status === 409) {
        setError('Username already exists. Please choose a different username.')
        toast.error('Username already exists')
      } else if (err.response?.status === 400) {
        setError('Invalid data provided. Please check your input.')
        toast.error('Invalid data provided')
      } else {
        setError('Failed to update profile. Please try again.')
        toast.error('Failed to update profile')
      }
    } finally {
      setSaving(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'seller': return 'secondary'
      case 'buyer': return 'default'
      default: return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'banned': return 'destructive'
      case 'inactive': return 'secondary'
      default: return 'outline'
    }
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={saving}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={saving}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(user.role || 'buyer')}>
                    {user.role}
                  </Badge>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your account role cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(user.status || 'active')}>
                    {user.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Account status is managed by administrators
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              
              {saving && (
                <p className="text-sm text-muted-foreground">
                  Updating profile...
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
