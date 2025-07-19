import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import type { SellerPayout } from '@/types/Seller';
import { DataTable } from '@/components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

function Payouts() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<SellerPayout[]>('/api/seller/payouts');
      setPayouts(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load payouts:', err);
      setError('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestError(null);

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const bankAccount = formData.get('bankAccount') as string;

    try {
      await axios.post('/api/seller/payouts', {
        amount,
        bankAccount,
      });

      // Refresh the payouts list
      await fetchData();
      setIsDialogOpen(false);

      // Reset form
      e.currentTarget.reset();
    } catch (err) {
      console.error('Failed to request payout:', err);
      setRequestError('Failed to request payout');
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<SellerPayout>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      meta: { widthClass: 'w-16' },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatIDR(row.original.amount ?? 0),
      meta: { widthClass: 'w-28', cellClass: 'truncate' },
    },
    {
      accessorKey: 'processedAt',
      header: 'Date',
      cell: ({ row }) =>
        row.original.processedAt
          ? new Date(row.original.processedAt).toLocaleDateString()
          : row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : 'N/A',
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
      meta: { widthClass: 'w-28', cellClass: 'truncate' },
    },
  ];

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payouts</h2>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        </DialogTrigger>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Payout</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestPayout} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="bankAccount">Bank Account Details</Label>
              <Textarea
                id="bankAccount"
                name="bankAccount"
                required
                placeholder="Enter your bank account information"
                rows={3}
              />
            </div>
            {requestError && (
              <div className="text-red-600 text-sm">{requestError}</div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                disabled={requestLoading}
                className="flex-1"
              >
                {requestLoading ? 'Requesting...' : 'Request Payout'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={payouts} isLoading={loading} />
    </div>
  );
}

export default Payouts;
