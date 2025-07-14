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
import type { AdminSeller } from '@/types/Admin'
import { Eye } from 'lucide-react'

function ManageSellers() {
  const [data, setData] = useState<AdminSeller[]>([])
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState<{
    seller: AdminSeller
    action: 'activate' | 'deactivate'
  } | null>(null)
  const navigate = useNavigate()

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<AdminSeller[]>('/api/admin/sellers')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateStatus = async (s: AdminSeller, action: string) => {
    await axios.patch(`/api/admin/sellers/${s.id}`, { action })
    fetchData()
  }

  const columns: ColumnDef<AdminSeller>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { widthClass: 'hidden md:table-cell w-28', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/sellers/${s.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {s.status === 'pending' && (
              <>
                <Button size="sm" onClick={() => updateStatus(s, 'approve')}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => updateStatus(s, 'reject')}
                >
                  Reject
                </Button>
              </>
            )}
            {s.status === 'active' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setTarget({ seller: s, action: 'deactivate' })}
              >
                Deactivate
              </Button>
            )}
            {s.status === 'inactive' && (
              <Button
                size="sm"
                onClick={() => setTarget({ seller: s, action: 'activate' })}
              >
                Activate
              </Button>
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
              {target?.action === 'activate' ? 'Activate' : 'Deactivate'} this
              seller?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (target) updateStatus(target.seller, target.action)
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

export default ManageSellers
