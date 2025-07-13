import { useAtom } from 'jotai'
import { userAtom } from '@/atoms/loginAtoms'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function Profile() {
  const [user] = useAtom(userAtom)
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Profile updated (mock)')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={user?.role || ''}
          disabled
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={user?.status || ''}
          disabled
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default Profile
