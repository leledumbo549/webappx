import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

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
            <div>Price: {product.price}</div>
            <div>Status: {product.status}</div>
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
