import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';
import { isAxiosError } from '@/lib/axios';
import type { Order } from '@/server/schema';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { formatIDR } from '@/lib/utils';

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Order[]>('/api/buyer/orders');
      setOrders(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message);
      else setError('Failed to load orders');
    } finally {
      setLoading(false);
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

  if (loading) return <Skeleton className="h-20" />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!orders.length) return <div>No orders yet.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Orders</h2>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-semibold">Order #{o.id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status: </span>
                    <Badge
                      variant="secondary"
                      className={`rounded-full ${getStatusColor(o.status || 'pending')}`}
                    >
                      {o.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Total: </span>
                  <span className="font-semibold">{formatIDR(o.total)}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString('en-US')
                    : 'N/A'}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/orders/${o.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
