import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import type { SellerProfile } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function StoreProfile() {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<SellerProfile>('/api/seller/profile')
      setProfile(res.data)
      setError(null)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    setLoading(true)
    setError(null)
    try {
      const res = await axios.put<SellerProfile>('/api/seller/profile', profile)
      setProfile(res.data)
      setError(null)
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!profile) return <div>No profile data.</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" name="name" defaultValue={profile.name} required />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" name="bio" defaultValue={profile.bio || ''} />
          </div>
          <div>
            <Label htmlFor="contact">Contact</Label>
            <Input id="contact" name="contact" defaultValue={profile.contact || ''} />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default StoreProfile
