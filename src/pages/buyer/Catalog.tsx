import { useEffect, useState } from 'react'
import * as Axios from 'axios'
import type { Product } from '@/types/Product'
import ProductCard from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useSetAtom } from 'jotai'
import { addToCartAtom } from '@/atoms/cartAtoms'
import { useNavigate } from 'react-router-dom'

function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const add = useSetAtom(addToCartAtom)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      // TODO: This endpoint is not defined in OpenAPI spec
      // const res = await axios.get<Product[]>('/api/products')
      // setProducts(res.data)
      
      // Placeholder data until API is defined
      setProducts([])
      setError('Products API not yet implemented')
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  if (error) return <div className="text-red-600">{error}</div>

  if (!products.length) return <div>No products found.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
