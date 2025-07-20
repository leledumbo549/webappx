import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AdminUser } from '@/types/Admin';
import { Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function ManageUsers() {
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const navigate = useNavigate();

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'seller':
        return 'bg-blue-100 text-blue-800';
      case 'buyer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get<AdminUser[]>('/api/admin/users');
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBan = async (user: AdminUser) => {
    await axios.patch(`/api/admin/users/${user.id}`, { action: 'toggleBan' });
    fetchData();
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'ethereumAddress',
      header: 'Address',
      meta: { widthClass: 'hidden md:table-cell w-64', cellClass: 'truncate' },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={`capitalize rounded-full ${getRoleBadgeClass(
            row.original.role || 'buyer'
          )}`}
        >
          {row.original.role}
        </Badge>
      ),
      meta: { widthClass: 'hidden md:table-cell w-24', cellClass: 'truncate' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={`capitalize rounded-full ${getStatusBadgeClass(
            row.original.status || 'active'
          )}`}
        >
          {row.original.status}
        </Badge>
      ),
      meta: { widthClass: 'w-24', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex gap-1 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/users/${u.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant={u.status === 'banned' ? 'secondary' : 'destructive'}
              size="sm"
              onClick={() => setTarget(u)}
            >
              {u.status === 'banned' ? 'Unban' : 'Ban'}
            </Button>
          </div>
        );
      },
      enableSorting: false,
      meta: { widthClass: 'w-24' },
    },
  ];

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
                if (target) toggleBan(target);
                setTarget(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ManageUsers;
