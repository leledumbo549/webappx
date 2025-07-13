import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'

interface Order {
  id: number
  total: number
  status: string
  createdAt: string
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Order[]>('/api/buyer/orders')
      setOrders(res.data)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <Skeleton className="h-20" />
  if (error) return <div className="text-red-600">{error}</div>
  if (!orders.length) return <div>No orders yet.</div>

  return (
    <ul className="space-y-2">
      {orders.map((o) => (
        <li key={o.id} className="border p-2 rounded">
          <div>ID: {o.id}</div>
          <div>Status: {o.status}</div>
          <div>
            Total:{' '}
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(o.total)}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(o.createdAt).toLocaleString('id-ID')}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Orders
