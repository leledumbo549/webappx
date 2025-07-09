import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { AdminUser } from '@/types/Admin'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

function ManageUsers() {
  const [data, setData] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState<AdminUser | null>(null)

  const fetchData = async () => {
    setLoading(true)
    const res = await axios.get<AdminUser[]>('/api/admin/users')
    setData(res.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleBan = async (user: AdminUser) => {
    await axios.patch(`/api/admin/users/${user.id}`, { action: 'toggleBan' })
    fetchData()
  }

  const columns: ColumnDef<AdminUser>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const u = row.original
        return (
          <Button
            variant={u.status === 'banned' ? 'secondary' : 'destructive'}
            size="sm"
            onClick={() => setTarget(u)}
          >
            {u.status === 'banned' ? 'Unban' : 'Ban'}
          </Button>
        )
      },
      enableSorting: false,
      meta: { widthClass: 'w-24' },
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data} isLoading={loading} />
      <AlertDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {target?.status === 'banned' ? 'Unban' : 'Ban'} this user?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (target) toggleBan(target)
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

export default ManageUsers
