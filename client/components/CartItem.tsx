import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import type { Product } from '@/types/Product'
import { Package, Minus, Plus, Trash2 } from 'lucide-react'

interface Props {
  product: Product
  quantity: number
  onRemove?: () => void
  onChange?: (qty: number) => void
}

function CartItem({ product, quantity, onRemove, onChange }: Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      onChange?.(newQuantity)
    }
  }

  const totalPrice = product.price * quantity

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {product.status || 'unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <Input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-16 h-8 text-center text-sm"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-right min-w-0">
            <div className="font-semibold text-sm">
              {formatPrice(totalPrice)}
            </div>
            {quantity > 1 && (
              <div className="text-xs text-muted-foreground">
                {quantity} × {formatPrice(product.price)}
              </div>
            )}
          </div>

          {/* Remove Button */}
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CartItem
