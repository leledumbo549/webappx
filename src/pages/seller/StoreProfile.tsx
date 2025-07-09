import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { SellerProfile } from '@/types/Seller'

function StoreProfile() {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    setLoading(true)
    const res = await axios.get<SellerProfile>('/api/seller/profile')
    setProfile(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    const res = await axios.put<SellerProfile>('/api/seller/profile', profile)
    setProfile(res.data)
  }

  if (!profile) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <Label htmlFor="name">Store Name</Label>
        <Input
          id="name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          value={profile.logo}
          onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Input
          id="bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="contact">Contact</Label>
        <Input
          id="contact"
          value={profile.contact}
          onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
        />
      </div>
      <Button type="submit" disabled={loading}>
        Save
      </Button>
    </form>
  )
}

export default StoreProfile
