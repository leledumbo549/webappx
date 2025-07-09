import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import type { AdminSeller } from '@/types/Admin'

function ManageSellers() {
  const [data, setData] = useState<AdminSeller[]>([])
  const [loading, setLoading] = useState(false)

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
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const s = row.original
        if (s.status === 'pending') {
          return (
            <div className="flex gap-1 justify-end">
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
            </div>
          )
        }
        if (s.status === 'active') {
          return (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => updateStatus(s, 'deactivate')}
            >
              Deactivate
            </Button>
          )
        }
        return (
          <Button size="sm" onClick={() => updateStatus(s, 'activate')}>
            Activate
          </Button>
        )
      },
      enableSorting: false,
      meta: { widthClass: 'w-40' },
    },
  ]

  return <DataTable columns={columns} data={data} isLoading={loading} />
}

export default ManageSellers
