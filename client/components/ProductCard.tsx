import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { Product } from '@/types/Product'

interface Props {
  product: Product
  onAdd?: () => void
  onView?: () => void
}

function ProductCard({ product, onAdd, onView }: Props) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 text-sm">
        {product.description}
      </CardContent>
      <CardFooter className="justify-between">
        <span className="font-semibold">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(product.price)}
        </span>
        <div className="flex gap-2">
          {onView && (
            <Button variant="secondary" size="sm" onClick={onView}>
              View
            </Button>
          )}
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              Add
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
