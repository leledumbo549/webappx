import { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

export interface ProductFormValues {
  name: string
  price: number
  description: string
  imageUrl: string
}

interface Props {
  initialValues?: ProductFormValues
  onSubmit: (values: ProductFormValues) => void
  loading?: boolean
}

function ProductForm({ initialValues, onSubmit, loading }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [price, setPrice] = useState(initialValues?.price ?? 0)
  const [description, setDescription] = useState(
    initialValues?.description ?? ''
  )
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, price, description, imageUrl })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="desc">Description</Label>
        <Input
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        Save
      </Button>
    </form>
  )
}

export default ProductForm
