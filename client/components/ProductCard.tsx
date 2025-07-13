import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { Product } from '@/types/Product'
import { Package, Eye, ShoppingCart } from 'lucide-react'

interface Props {
  product: Product
  onAdd?: () => void
  onView?: () => void
}

function ProductCard({ product, onAdd, onView }: Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price)
  }

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'pending': return 'outline'
      case 'flagged': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={getStatusBadgeVariant(product.status)} className="text-xs">
            {product.status || 'unknown'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        {product.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description available
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-0">
        {/* Price */}
        <div className="w-full">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-2">
          {onView && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onView}
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          )}
          {onAdd && (
            <Button 
              size="sm" 
              onClick={onAdd}
              className="flex-1"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
