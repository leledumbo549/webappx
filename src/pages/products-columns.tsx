import type { ColumnDef } from '@tanstack/react-table'
import type { Product } from '@/types/Product'
import { Button } from '@/components/ui/button'
import { Info, Pencil, Trash } from 'lucide-react'

export type ProductTableHandlers = {
  onDetail: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function getColumns(handlers: ProductTableHandlers): ColumnDef<Product>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { widthClass: 'w-40' },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      meta: { widthClass: 'w-48' },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      meta: { widthClass: 'w-32' },
    },
    {
      accessorKey: 'price',
      header: 'Price (IDR)',
      cell: ({ getValue }) => {
        const value = getValue<number>()
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
      },
      meta: { widthClass: 'w-36' },
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { widthClass: 'w-28' },
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => handlers.onDetail(product)}>
              <Info className="size-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => handlers.onEdit(product)}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => handlers.onDelete(product)}>
              <Trash className="size-4" />
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
