import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cartAtom, clearCartAtom } from '@/atoms/cartAtoms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function Checkout() {
  const cart = useAtomValue(cartAtom);
  const clearCart = useSetAtom(clearCartAtom);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmCheckout, setConfirmCheckout] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      // For demo, use a static shipping address and payment method
      await axios.post('/api/buyer/orders', {
        items,
        shippingAddress: '123 Main St, City, Country',
        paymentMethod: 'credit_card',
      });
      clearCart();
      navigate('/orders');
    } catch {
      setError('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.product.name}</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(total)}
                </span>
              </div>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <Button
              onClick={() => setConfirmCheckout(true)}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={confirmCheckout}
        onOpenChange={(o) => !o && setConfirmCheckout(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Place this order?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleCheckout();
                setConfirmCheckout(false);
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

export default Checkout;
