import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import type { Order } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatIDR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

function OrdersReceived() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Order[]>('/api/seller/orders')
      setOrders(res.data)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (order: Order, action: string) => {
    const actionText =
      action === 'ship'
        ? 'mark this order as shipped'
        : 'mark this order as delivered'
    const confirmed = confirm(`Are you sure you want to ${actionText}?`)
    if (!confirmed) return

    try {
      await axios.patch(`/api/seller/orders/${order.id}`, { status: action })
      await fetchData()
      setError(null)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to update order status')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>
  if (!orders.length) return <div>No orders yet.</div>

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>{order.productName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Quantity: {order.quantity}</div>
            <div>Total: {formatIDR(order.total)}</div>
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <Badge
                variant="secondary"
                className={`rounded-full ${getStatusColor(order.status || 'pending')}`}
              >
                {order.status}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => handleUpdateStatus(order, 'ship')}>
                Mark as Shipped
              </Button>
              <Button onClick={() => handleUpdateStatus(order, 'deliver')}>
                Mark as Delivered
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default OrdersReceived
