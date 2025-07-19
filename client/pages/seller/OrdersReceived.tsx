import { useEffect, useState } from 'react';
import axios, { isAxiosError } from '@/lib/axios';
import type { Order } from '@/types/Seller';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatIDR } from '@/lib/utils';

function OrdersReceived() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<{
    order: Order;
    action: 'shipped' | 'delivered';
  } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Order[]>('/api/seller/orders');
      setOrders(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message);
      else setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    order: Order,
    status: 'shipped' | 'delivered'
  ) => {
    try {
      await axios.patch(`/api/seller/orders/${order.id}`, { status });
      await fetchData();
      setError(null);
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message);
      else setError('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'productName',
      header: 'Product',
      meta: { widthClass: 'w-40', cellClass: 'truncate' },
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      meta: { widthClass: 'w-12' },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => formatIDR(row.original.total),
      meta: { widthClass: 'w-28', cellClass: 'truncate' },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={`rounded-full ${getStatusColor(row.original.status || 'pending')}`}
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
        const o = row.original;
        return (
          <div className="flex gap-1">
            {o.status !== 'shipped' && o.status !== 'delivered' && (
              <Button
                size="sm"
                onClick={() => setTarget({ order: o, action: 'shipped' })}
              >
                Ship
              </Button>
            )}
            {o.status !== 'delivered' && (
              <Button
                size="sm"
                onClick={() => setTarget({ order: o, action: 'delivered' })}
              >
                Deliver
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      meta: { widthClass: 'w-40' },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={orders} isLoading={loading} />
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <AlertDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {target?.action === 'shipped'
                ? 'Mark as shipped?'
                : 'Mark as delivered?'}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (target) updateStatus(target.order, target.action);
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

export default OrdersReceived;
