import { useAtom, useSetAtom } from 'jotai'
import { cartAtom, removeFromCartAtom, updateCartQuantityAtom, cartTotalAtom, loadCartAtom } from '@/atoms/cartAtoms'
import CartItem from '@/components/CartItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ShoppingCart, Package, AlertCircle, ArrowRight, Trash2 } from 'lucide-react'

function Cart() {
  const [items] = useAtom(cartAtom)
  const total = useAtom(cartTotalAtom)[0]
  const remove = useSetAtom(removeFromCartAtom)
  const update = useSetAtom(updateCartQuantityAtom)
  const loadCart = useSetAtom(loadCartAtom)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true)
      setError(null)
      try {
        await loadCart()
      } catch (error) {
        console.error('Failed to load cart:', error)
        setError('Failed to load your cart. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [loadCart])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  const handleClearCart = () => {
    items.forEach(item => remove(item.productId))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Start shopping to add items to your cart
          </p>
        </div>
        <Button onClick={() => navigate('/catalog')}>
          <Package className="mr-2 h-4 w-4" />
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{items.length} items</span>
            </div>
            <Badge variant="secondary">
              {items.reduce((acc, item) => acc + item.quantity, 0)} total items
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearCart}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            product={item.product}
            quantity={item.quantity}
            onRemove={() => remove(item.productId)}
            onChange={(q) => update({ productId: item.productId, quantity: q })}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
          
          <Button 
            onClick={() => navigate('/buyer/checkout')} 
            className="w-full"
            size="lg"
          >
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Cart
