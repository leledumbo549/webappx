# WebAppX Development Specification

## Data Contracts

```ts
// Shared database models from server/schema.ts
export interface User {
  id: number
  name: string | null
  username: string
  password: string | null
  role: 'admin' | 'buyer' | 'seller' | null
  status: 'active' | 'banned' | 'inactive' | null
  createdAt: string | null
  updatedAt: string | null
}

export type PublicUser = Omit<User, 'password'>

export interface Seller {
  id: number
  userId: number
  name: string
  logo: string | null
  bio: string | null
  contact: string | null
  address: string | null
  website: string | null
  status: 'active' | 'inactive' | 'pending' | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Product {
  id: number
  name: string
  price: number
  description: string | null
  imageUrl: string | null
  sellerId: number | null
  status: 'active' | 'inactive' | 'pending' | 'flagged' | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Order {
  id: number
  productId: number
  productName: string
  quantity: number
  items: string | null // JSON of cart items
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | null
  shippingAddress: string | null
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery' | null
  trackingNumber: string | null
  buyerId: number | null
  sellerId: number | null
  createdAt: string | null
  updatedAt: string | null
}

export interface SellerPayout {
  id: number
  amount: number
  bankAccount: string | null
  processedAt: string | null
  sellerId: number | null
  status: 'pending' | 'completed' | 'failed' | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Report {
  id: number
  message: string | null
  status: 'open' | 'closed' | 'resolved' | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Setting {
  key: string
  value: string | null
}

export interface Wallet {
  id: number
  userId: number
  balance: string
  createdAt: string | null
  updatedAt: string | null
}

export interface DashboardStats {
  totalUsers: number
  totalSellers: number
  totalSales: number
  openReports: number
}

// Additional client side
export interface CartItemWithProduct {
  id: number
  userId: number
  productId: number
  quantity: number
  product: Product
}
```

## API Specification
_All endpoints are described in `openapi.yaml` and must conform to that file._

### Authentication
| Method | Path | Request | Response |
|-------|------|---------|----------|
|POST|`/api/login`|`LoginRequest`|`LoginResponse`|
|POST|`/api/login/siwe`|`SiweLoginRequest`|`LoginResponse`|
|POST|`/api/register`|`RegisterRequest`|`LoginResponse`|
|GET|`/api/me`|Bearer token|`PublicUser`|
|PUT|`/api/me`|`{name?:string; username?:string;}`|`PublicUser`|
|GET|`/api/wallet`|Bearer token|`Wallet`|
|GET|`/api/wallet/balance`|Bearer token|`WalletBalance`|

### Settings
| GET | `/api/settings` | - | `Setting[]` |

### Admin
| Method | Path | Request | Response |
|-------|------|---------|----------|
|GET|`/api/admin/dashboard`|Bearer|`DashboardStats`|
|GET|`/api/admin/users`|Bearer|`PublicUser[]`|
|GET|`/api/admin/users/{id}`|Bearer|`PublicUser`|
|PATCH|`/api/admin/users/{id}`|`{action:'toggleBan'}`|`PublicUser`|
|GET|`/api/admin/sellers`|Bearer|`Seller[]`|
|GET|`/api/admin/sellers/{id}`|Bearer|`Seller`|
|PATCH|`/api/admin/sellers/{id}`|`{action:'approve'|'reject'|'activate'|'deactivate'}`|`Seller`|
|GET|`/api/admin/products`|Bearer|`Product[]`|
|GET|`/api/admin/products/{id}`|Bearer|`Product`|
|PATCH|`/api/admin/products/{id}`|`{action:'approve'|'reject'|'flag'|'remove'}`|`Product` or 200 empty on remove|
|GET|`/api/admin/wallets`|Bearer|`Wallet[]`|
|GET|`/api/wallet/{userId}`|Bearer|`Wallet`|
|GET|`/api/admin/reports`|Bearer|`Report[]`|
|PATCH|`/api/admin/reports/{id}`|`{action:'resolve'}`|`Report`|
|GET|`/api/admin/settings`|Bearer|`Record<string,string>`|
|PUT|`/api/admin/settings`|`Record<string,string>`|`Record<string,string>`|

### Seller
| Method | Path | Request | Response |
|-------|------|---------|----------|
|GET|`/api/seller/products`|Bearer|`Product[]`|
|POST|`/api/seller/products`|`{name:string; price:number; description?:string; imageUrl?:string;}`|`Product`|
|GET|`/api/seller/products/{id}`|Bearer|`Product`|
|PUT|`/api/seller/products/{id}`|Partial product fields|`Product`|
|DELETE|`/api/seller/products/{id}`|Bearer|`204 No Content`|
|GET|`/api/seller/orders`|Bearer|`Order[]`|
|PATCH|`/api/seller/orders/{id}`|`{status:'processing'|'shipped'|'delivered'; trackingNumber?:string}`|`Order`|
|GET|`/api/seller/profile`|Bearer|`Seller`|
|PUT|`/api/seller/profile`|`Seller` fields|`Seller`|
|GET|`/api/seller/payouts`|Bearer|`SellerPayout[]`|
|POST|`/api/seller/payouts`|`{amount:number; bankAccount:string}`|`SellerPayout`|

### Buyer
| Method | Path | Request | Response |
|-------|------|---------|----------|
|GET|`/api/buyer/products`|Query params pagination/search|`Product[]`|
|GET|`/api/buyer/products/{id}`|Bearer|`Product`|
|GET|`/api/buyer/orders`|Bearer|`Order[]`|
|GET|`/api/buyer/orders/{id}`|Bearer|`Order`|
|POST|`/api/buyer/orders`|`{items:{productId:number;quantity:number}[]; shippingAddress:string; paymentMethod?:'credit_card'|'bank_transfer'|'cash_on_delivery';}`|`Order`|

All endpoints require Bearer authentication unless noted otherwise.

## Socket Events
*(Sockets not implemented yet – these describe the contract for future realtime features.)*

| Event | Payload | Emitted By | Listeners |
|-------|---------|-----------|-----------|
|`orderCreated`|`Order`|Server after new order|Buyer client, Seller client|
|`orderUpdated`|`Order`|Server when order status changes|Buyer client, Seller client|
|`productUpdated`|`Product`|Server on product edit or status change|All clients|

## Component Contracts

### ProductCard
```ts
interface ProductCardProps {
  product: Product
  onAdd?: () => void
  onView?: () => void
}
```

### DataTable
```ts
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  filterColumnId?: string
  filterOptions?: string[]
  onRowClick?: (row: Row<TData>) => void
}
```

### CartItem
```ts
interface CartItemProps {
  product: Product
  quantity: number
  onRemove?: () => void
  onChange?: (qty: number) => void
}
```

### SectionTitle
```ts
interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}
```

### Title
```ts
interface TitleProps {
  onClick?: () => void
  className?: string
}
```

Navbar does not take props; it reads auth atoms internally.

## Jotai State Shape

```ts
// Authentication state
const tokenAtom = atom<string | null>(localStorage.getItem('auth_token'))
const userAtom = atom<User | null>(storedUser)
const loginAtom = atom(null, (_get, set, {token, user}:{token:string; user:User}) => {...})
const logoutAtom = atom(null, (_get, set) => {...})
const isAuthenticatedAtom = atom((get) => !!get(tokenAtom) && !!get(userAtom))

// Cart state
const cartAtom = atom<CartItemWithProduct[]>(getStoredCart())
const cartTotalAtom = atom(get => get(cartAtom).reduce((s,i)=>s+i.product.price*i.quantity,0))
const loadCartAtom = atom(null, async (_get,set)=>{...})
const addToCartAtom = atom(null, async (get,set,product:Product)=>{...})
const removeFromCartAtom = atom(null, async (get,set,id:number)=>{...})
const updateCartQuantityAtom = atom(null, async (get,set,{productId,quantity})=>{...})
const clearCartAtom = atom(null, async (_get,set)=>{...})

// Seller products refresh signal
const sellerProductsRefreshAtom = atom(0)
const refreshSellerProductsAtom = atom(null, (get,set)=> set(sellerProductsRefreshAtom, get(sellerProductsRefreshAtom)+1))
```

## File Structure

```
client/
  atoms/          # Jotai state definitions
  components/     # Reusable React components
  lib/            # Axios instance and utilities
  mocks/          # MSW setup
  pages/          # Route components (buyer, seller, admin)
  main.tsx        # App bootstrap with MSW
server/
  schema.ts       # Database schema and shared types (single source)
  db.ts           # sql.js setup and seed
  controllers.ts  # Business logic for handlers
  handlers.ts     # MSW REST handlers
  seed.ts         # Seed data for sql.js
openapi.yaml      # HTTP API specification (source of truth)
public/           # Static assets and service worker
spec.md           # This specification
```

## Development Rules
- **Shared types** must be imported from `server/schema.ts` throughout the project.
- **API endpoints** must match definitions in `openapi.yaml`.
- Keep `spec.md`, `openapi.yaml`, and `server/schema.ts` synchronized when models change.
- Use Jotai atoms for global state as outlined above.
- Realtime features should follow the socket event contracts once implemented.
