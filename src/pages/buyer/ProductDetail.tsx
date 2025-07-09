import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '@/lib/axios'
import * as Axios from 'axios'
import type { Product } from '@/types/Product'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { add } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await axios.get<Product[]>('/api/products')
        const p = res.data.find((item) => item.id === Number(id)) || null
        setProduct(p)
      } catch (err) {
        if (Axios.isAxiosError(err)) setError(err.message)
        else setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <Skeleton className="h-40" />
  if (error) return <div className="text-red-600">{error}</div>
  if (!product) return <div>Product not found.</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p className="font-semibold">
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(product.price)}
      </p>
      <Button onClick={() => add(product)}>Add to Cart</Button>
    </div>
  )
}

export default ProductDetail
