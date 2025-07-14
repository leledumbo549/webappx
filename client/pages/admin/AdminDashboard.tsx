import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'
import { formatIDR } from '@/lib/utils'

interface Stats {
  totalUsers: number
  totalSellers: number
  totalSales: number
  openReports: number
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Stats>('/api/admin/dashboard')
        setStats(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Total Users</p>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Total Sellers</p>
        <p className="text-2xl font-bold">{stats.totalSellers}</p>
      </div>
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Total Sales</p>
        <p className="text-2xl font-bold">{formatIDR(stats.totalSales)}</p>
      </div>
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Open Reports</p>
        <p className="text-2xl font-bold">{stats.openReports}</p>
      </div>
    </div>
  )
}

export default AdminDashboard
