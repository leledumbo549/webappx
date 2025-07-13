import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { AdminSettings } from '@/types/Admin'

function SiteSettings() {
  const [data, setData] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<AdminSettings>('/api/admin/settings')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    const res = await axios.put<AdminSettings>('/api/admin/settings', data)
    setData(res.data)
  }

  if (!data) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <Label htmlFor="fees">Marketplace Fee (%)</Label>
        <Input
          id="fees"
          type="number"
          value={data.fees}
          onChange={(e) => setData({ ...data, fees: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="payout">Payout Delay (days)</Label>
        <Input
          id="payout"
          type="number"
          value={data.payoutDelay}
          onChange={(e) =>
            setData({ ...data, payoutDelay: Number(e.target.value) })
          }
        />
      </div>
      <Button type="submit" disabled={loading}>
        Save
      </Button>
    </form>
  )
}

export default SiteSettings
