import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { isAxiosError } from '@/lib/axios'
import type { Product } from '@/types/Product'
import ProductCard from '@/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useSetAtom, useAtom } from 'jotai'
import { addToCartAtom, cartAtom } from '@/atoms/cartAtoms'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const add = useSetAtom(addToCartAtom)
  const [cart] = useAtom(cartAtom)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get<Product[]>('/api/buyer/products')
      setProducts(res.data)
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message)
      else setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddToCart = async (product: Product) => {
    try {
      // Check if product already exists in cart before adding
      const existingItem = cart.find(item => item.productId === product.id)
      
      await add(product)
      
      if (existingItem) {
        toast.success(`${product.name} quantity updated in cart!`)
      } else {
        toast.success(`${product.name} added to cart!`)
      }
    } catch {
      toast.error('Failed to add item to cart')
    }
  }

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
          onAdd={() => handleAddToCart(p)}
          onView={() => navigate(`/buyer/product/${p.id}`)}
        />
      ))}
    </div>
  )
}

export default Catalog
