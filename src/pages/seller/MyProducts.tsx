import { useEffect, useState } from 'react'
// import axios from '@/lib/axios'
import type { SellerProduct } from '@/types/Seller'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function MyProducts() {
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // TODO: This endpoint is not defined in OpenAPI spec
      // const res = await axios.get<SellerProduct[]>('/api/seller/products')
      // setProducts(res.data)
      
      // Placeholder data until API is defined
      setProducts([])
      setError('Seller Products API not yet implemented')
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (_p: SellerProduct) => {
    try {
      // TODO: This endpoint is not defined in OpenAPI spec
      // await axios.delete(`/api/seller/products/${p.id}`)
      // await fetchData()
      
      setError('Delete Product API not yet implemented')
    } catch {
      setError('Failed to delete product')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
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
