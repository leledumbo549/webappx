import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import * as Axios from 'axios'
import type { Product } from '@/types/Product'
import ProductCard from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/contexts/CartContext'
import { useNavigate } from 'react-router-dom'

function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { add } = useCart()
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Product[]>('/api/products')
      setProducts(res.data)
    } catch (err) {
      if (Axios.isAxiosError(err)) setError(err.message)
      else setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (error) return <div className="text-red-600">{error}</div>

  if (!products.length) return <div>No products found.</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAdd={() => add(p)}
          onView={() => navigate(`/buyer/product/${p.id}`)}
        />
      ))}
    </div>
  )
}

export default Catalog
