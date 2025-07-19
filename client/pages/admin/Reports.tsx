import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ColumnDef } from '@tanstack/react-table';
import type { AdminReport } from '@/types/Admin';

function Reports() {
  const [data, setData] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState<AdminReport | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get<AdminReport[]>('/api/admin/reports');
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resolve = async (r: AdminReport) => {
    await axios.patch(`/api/admin/reports/${r.id}`, { action: 'resolve' });
    fetchData();
  };

  const columns: ColumnDef<AdminReport>[] = [
    {
      accessorKey: 'message',
      header: 'Message',
      meta: {
        widthClass: 'w-64',
        cellClass: 'whitespace-normal break-words',
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { widthClass: 'hidden md:table-cell w-24', cellClass: 'truncate' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const rep = row.original;
        return rep.status === 'open' ? (
          <Button size="sm" onClick={() => setTarget(rep)}>
            Resolve
          </Button>
        ) : null;
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
            <AlertDialogTitle>Resolve this report?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (target) resolve(target);
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

export default Reports;
