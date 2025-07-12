import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as Axios from 'axios'
import type { Product } from '@/types/Product'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSetAtom } from 'jotai'
import { addToCartAtom } from '@/atoms/cartAtoms'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const add = useSetAtom(addToCartAtom)

  const fetchData = async () => {
    setLoading(true)
    try {
      setError('Products API not yet implemented')
    } catch (err) {
      if (Axios.isAxiosError(err)) setError(err.message)
      else setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Product not found.</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Price:</strong>{' '}
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(product.price)}
          </div>
          {product.description && (
            <div>
              <strong>Description:</strong> {product.description}
            </div>
          )}
          <Button onClick={() => add(product)}>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductDetail
