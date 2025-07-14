import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminProduct } from '@/types/Admin'
import { Eye } from 'lucide-react'
import { formatIDR } from '@/lib/utils'

function ManageProducts() {
  const [data, setData] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState<{
    product: AdminProduct
    action: 'approve' | 'reject' | 'flag' | 'remove' | 'unflag'
  } | null>(null)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<AdminProduct[]>('/api/admin/products')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateStatus = async (p: AdminProduct, action: string) => {
    await axios.patch(`/api/admin/products/${p.id}`, { action })
    fetchData()
  }

  const columns: ColumnDef<AdminProduct>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => formatIDR(row.original.price),
      meta: { widthClass: 'hidden md:table-cell w-24', cellClass: 'truncate' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { widthClass: 'w-24', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/products/${p.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {p.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => setTarget({ product: p, action: 'approve' })}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setTarget({ product: p, action: 'reject' })}
                >
                  Reject
                </Button>
              </>
            )}
            {p.status === 'active' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTarget({ product: p, action: 'flag' })}
                >
                  Flag
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setTarget({ product: p, action: 'remove' })}
                >
                  Remove
                </Button>
              </>
            )}
          </div>
        )
      },
      enableSorting: false,
      meta: { widthClass: 'w-40' },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data} isLoading={loading} />
      <AlertDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {(() => {
                if (!target) return ''
                const label =
                  target.action === 'unflag'
                    ? 'Unflag'
                    : target.action.charAt(0).toUpperCase() +
                      target.action.slice(1)
                return `${label} this product?`
              })()}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (target)
                  updateStatus(
                    target.product,
                    target.action === 'unflag' ? 'approve' : target.action
                  )
                setTarget(null)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ManageProducts
