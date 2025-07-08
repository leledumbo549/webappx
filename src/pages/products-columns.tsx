import { ColumnDef } from '@tanstack/react-table'
import { Product } from '@/types/Product'
import { Button } from '@/components/ui/button'

export type ProductTableHandlers = {
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function getColumns(handlers: ProductTableHandlers): ColumnDef<Product>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'price',
      header: 'Price (IDR)',
      cell: ({ getValue }) => {
        const value = getValue<number>()
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => handlers.onEdit(product)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handlers.onDelete(product)}>
              Delete
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
