export function isNestedRoute(path: string): boolean {
  return path.split('/').filter(Boolean).length > 3
}

export function getPageTitle(path: string): string {
  if (path.startsWith('/seller/products/new')) return 'Add Product'
  if (/^\/seller\/products\/[^/]+\/edit/.test(path)) return 'Edit Product'
  if (path.startsWith('/seller/orders')) return 'Orders'
  if (path.startsWith('/admin/users')) return 'Manage Users'
  return 'Dashboard'
}
