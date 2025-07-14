import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import axios from '@/lib/axios'
import type { SellerProduct, Order } from '@/types/Seller'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { sellerProductsRefreshAtom } from '@/atoms/sellerAtoms'

function SellerDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshCounter] = useAtom(sellerProductsRefreshAtom)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch seller products from the API
      const productsRes = await axios.get<SellerProduct[]>(
        '/api/seller/products'
      )
      setProducts(productsRes.data)
      // Fetch seller orders from the API
      const ordersRes = await axios.get<Order[]>('/api/seller/orders')
      setOrders(ordersRes.data)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleManageProducts = () => {
    navigate('/seller/products')
  }

  useEffect(() => {
    fetchData()
  }, [refreshCounter]) // Refresh when the counter changes

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total products</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Total orders</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleManageProducts}>Manage Products</Button>
      </div>
    </div>
  )
}

export default SellerDashboard
