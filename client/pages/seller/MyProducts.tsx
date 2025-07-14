import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { formatIDR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

function MyProducts() {
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<SellerProduct[]>('/api/seller/products')
      setProducts(res.data)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (product: SellerProduct) => {
    const confirmed = confirm(
      `Are you sure you want to delete ${product.name}?`
    )
    if (!confirmed) return

    try {
      await axios.delete(`/api/seller/products/${product.id}`)
      await fetchData()
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to delete product')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'flagged':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <Spinner />
  if (error) return <div className="text-red-600">{error}</div>
  if (!products.length) return <div>No products yet.</div>

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Price: {formatIDR(product.price)}</div>
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <Badge
                variant="secondary"
                className={`rounded-full ${getStatusColor(product.status || 'inactive')}`}
              >
                {product.status}
              </Badge>
            </div>
            <Button onClick={() => handleDelete(product)} variant="destructive">
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default MyProducts
