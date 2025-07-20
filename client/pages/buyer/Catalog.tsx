import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { isAxiosError } from '@/lib/axios';
import type { Product } from '@/types/Product';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { useSetAtom, useAtom } from 'jotai';
import { addToCartAtom, cartAtom } from '@/atoms/cartAtoms';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Search, Package, AlertCircle, ShoppingCart } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const add = useSetAtom(addToCartAtom);
  const [cart] = useAtom(cartAtom);
  const navigate = useNavigate();
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Product[]>('/api/buyer/products');
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) setError(err.message);
      else setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddToCart = async (product: Product) => {
    try {
      // Check if product already exists in cart before adding
      const existingItem = cart.find((item) => item.productId === product.id);

      await add(product);

      if (existingItem) {
        toast.success(`${product.name} quantity updated in cart!`);
      } else {
        toast.success(`${product.name} added to cart!`);
      }
    } catch {
      toast.error('Failed to add item to cart');
    }
  };

  const getStatusCount = () => {
    const activeProducts = products.filter((p) => p.status === 'active');
    return activeProducts.length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{products.length} products</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{cart.length} items in cart</span>
            </div>
            <Badge variant="secondary">
              {getStatusCount()} active products
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results */}
      {!filteredProducts.length && products.length > 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or browse all products
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : !products.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No products available
            </h3>
            <p className="text-muted-foreground text-center">
              Check back later for new products
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => setTargetProduct(product)}
              onView={() => navigate(`/buyer/product/${product.id}`)}
            />
          ))}
        </div>
      )}
      <AlertDialog
        open={!!targetProduct}
        onOpenChange={(o) => !o && setTargetProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add this item to cart?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (targetProduct) handleAddToCart(targetProduct);
                setTargetProduct(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Catalog;
