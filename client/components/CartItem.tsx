import { Button } from './ui/button'
import { Input } from './ui/input'
import type { Product } from '@/types/Product'

interface Props {
  product: Product
  quantity: number
  onRemove?: () => void
  onChange?: (qty: number) => void
}

function CartItem({ product, quantity, onRemove, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2">
      <div className="flex-1">
        <div className="font-semibold">{product.name}</div>
        <div className="text-sm text-muted-foreground">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(product.price)}
        </div>
      </div>
      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-16 px-1 py-0.5 shadow-sm rounded"
      />
      {onRemove && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="ml-2 focus-visible:ring"
        >
          Remove
        </Button>
      )}
    </div>
  )
}

export default CartItem
