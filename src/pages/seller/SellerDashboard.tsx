import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'
import type { SellerOrder, SellerProduct } from '@/types/Seller'

interface Metrics {
  totalSales: number
  totalOrders: number
  activeListings: number
}

function SellerDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [proRes, ordRes] = await Promise.all([
        axios.get<SellerProduct[]>('/api/seller/products'),
        axios.get<SellerOrder[]>('/api/seller/orders'),
      ])
      const activeListings = proRes.data.length
      const totalOrders = ordRes.data.length
      const totalSales = ordRes.data
        .filter((o) => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total, 0)
      setMetrics({ totalSales, totalOrders, activeListings })
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Total Sales</p>
        <p className="text-2xl font-bold">{metrics.totalSales}</p>
      </div>
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Total Orders</p>
        <p className="text-2xl font-bold">{metrics.totalOrders}</p>
      </div>
      <div className="p-4 border rounded">
        <p className="text-sm text-muted-foreground">Active Listings</p>
        <p className="text-2xl font-bold">{metrics.activeListings}</p>
      </div>
    </div>
  )
}

export default SellerDashboard
