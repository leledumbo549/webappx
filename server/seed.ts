// seed.ts

import { drizzle } from 'drizzle-orm/sql-js'; // or drizzle-orm/better-sqlite3 for Node
import {
  users,
  sellers,
  products,
  reports,
  settings,
  orders,
  sellerPayouts,
  cart,
} from './schema';

// --- Seed data ---
const seedUsers = [
  {
    id: 1,
    name: 'Budi Santoso',
    username: 'alice',
    password: 'alice',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Sari Dewi',
    username: 'bob',
    password: 'bob',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Ahmad Rizki',
    username: 'carol',
    password: 'carol',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Dewi Sartika',
    username: 'dewi_sartika',
    password: 'dewi123',
    role: 'seller',
    status: 'banned',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Eko Prasetyo',
    username: 'eko_prasetyo',
    password: 'eko123',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    name: 'Fitri Handayani',
    username: 'fitri_handayani',
    password: 'fitri123',
    role: 'buyer',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    name: 'Gunawan Setiawan',
    username: 'gunawan_setiawan',
    password: 'gunawan123',
    role: 'seller',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
];

const seedSellers = [
  { id: 1, userId: 3, name: 'Toko Elektronik Maju', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Toko elektronik terpercaya dengan produk berkualitas tinggi', contact: 'info@tokomaju.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Ahmad owns Toko Elektronik Maju
  { id: 2, userId: 4, name: 'Warung Buah Segar', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Buah-buahan segar langsung dari petani lokal', contact: 'hello@warungbuah.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Dewi owns Warung Buah Segar
  { id: 3, userId: 5, name: 'Toko Gadget Indonesia', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Solusi teknologi terdepan untuk kebutuhan digital Anda', contact: 'info@gadgetindo.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Eko owns Toko Gadget Indonesia
  { id: 4, userId: 7, name: 'Boutique Fashion Nusantara', status: 'active', logo: 'https://via.placeholder.com/150', bio: 'Fashion lokal dengan sentuhan budaya Indonesia', contact: 'gunawan@boutiquenusantara.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Gunawan owns Boutique Fashion Nusantara
];

const seedProducts = [
  // Toko Elektronik Maju products (sellerId: 1)
  { id: 1, name: 'Headphone Wireless Sony WH-1000XM4', price: 2500000, status: 'active', sellerId: 1, description: 'Headphone wireless premium dengan noise cancellation terbaik', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Speaker Bluetooth JBL Flip 5', price: 850000, status: 'active', sellerId: 1, description: 'Speaker portable dengan suara jernih dan tahan air', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Smartwatch Samsung Galaxy Watch 5', price: 3500000, status: 'active', sellerId: 1, description: 'Smartwatch canggih dengan fitur kesehatan lengkap', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Warung Buah Segar products (sellerId: 2)
  { id: 4, name: 'Alpukat Mentega Segar', price: 25000, status: 'active', sellerId: 2, description: 'Alpukat mentega segar dari petani lokal Jawa Barat', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'Stroberi Segar Lembang', price: 45000, status: 'active', sellerId: 2, description: 'Stroberi segar dari kebun Lembang, Bandung', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'Pisang Raja Premium', price: 15000, status: 'active', sellerId: 2, description: 'Pisang raja premium kaya kalium dan vitamin', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Toko Gadget Indonesia products (sellerId: 3)
  { id: 7, name: 'Laptop Stand Aluminium Premium', price: 350000, status: 'active', sellerId: 3, description: 'Stand laptop aluminium untuk ergonomi kerja yang lebih baik', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 8, name: 'Keyboard Mechanical RGB Logitech', price: 1200000, status: 'active', sellerId: 3, description: 'Keyboard mechanical premium dengan lampu RGB yang cantik', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 9, name: 'Mouse Gaming Razer DeathAdder V3', price: 850000, status: 'active', sellerId: 3, description: 'Mouse gaming presisi tinggi dengan tombol yang dapat dikustomisasi', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Boutique Fashion Nusantara products (sellerId: 4)
  { id: 10, name: 'Tas Kulit Asli Batik', price: 1800000, status: 'active', sellerId: 4, description: 'Tas kulit asli dengan motif batik tradisional Indonesia', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 11, name: 'Selendang Sutra Batik Pesisir', price: 550000, status: 'active', sellerId: 4, description: 'Selendang sutra dengan motif batik pesisir yang elegan', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 12, name: 'Dompet Kulit Asli Garut', price: 350000, status: 'active', sellerId: 4, description: 'Dompet kulit asli dari Garut dengan kualitas terbaik', imageUrl: 'https://via.placeholder.com/300x200', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

const seedReports = [
  { id: 1, message: 'Produk palsu yang menyesatkan', status: 'open', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, message: 'Penjual melakukan penipuan', status: 'resolved', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 3, message: 'Gambar produk tidak sesuai', status: 'open', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

const seedSettings = [
  { key: 'siteName', value: 'PasarNusantara' },
  { key: 'currency', value: 'IDR' },
  { key: 'payoutDelayDays', value: '7' },
];

const seedOrders = [
  // Sari's orders (buyerId: 2)
  { id: 1, productId: 1, productName: 'Headphone Wireless Sony WH-1000XM4', quantity: 2, total: 5000000, status: 'pending', buyerId: 2, sellerId: 1, createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
  { id: 2, productId: 4, productName: 'Alpukat Mentega Segar', quantity: 5, total: 125000, status: 'shipped', buyerId: 2, sellerId: 2, createdAt: '2024-01-14T09:15:00Z', updatedAt: '2024-01-14T09:15:00Z' },
  { id: 3, productId: 7, productName: 'Laptop Stand Aluminium Premium', quantity: 1, total: 350000, status: 'delivered', buyerId: 2, sellerId: 3, createdAt: '2024-01-13T14:20:00Z', updatedAt: '2024-01-13T14:20:00Z' },
  
  // Fitri's orders (buyerId: 6)
  { id: 4, productId: 10, productName: 'Tas Kulit Asli Batik', quantity: 1, total: 1800000, status: 'pending', buyerId: 6, sellerId: 4, createdAt: '2024-01-16T11:45:00Z', updatedAt: '2024-01-16T11:45:00Z' },
  { id: 5, productId: 8, productName: 'Keyboard Mechanical RGB Logitech', quantity: 1, total: 1200000, status: 'processing', buyerId: 6, sellerId: 3, createdAt: '2024-01-15T16:30:00Z', updatedAt: '2024-01-15T16:30:00Z' },
  
  // Fitri's additional orders (buyerId: 6)
  { id: 6, productId: 3, productName: 'Smartwatch Samsung Galaxy Watch 5', quantity: 1, total: 3500000, status: 'shipped', buyerId: 6, sellerId: 1, createdAt: '2024-01-14T13:10:00Z', updatedAt: '2024-01-14T13:10:00Z' },
  { id: 7, productId: 5, productName: 'Stroberi Segar Lembang', quantity: 3, total: 135000, status: 'delivered', buyerId: 6, sellerId: 2, createdAt: '2024-01-13T10:25:00Z', updatedAt: '2024-01-13T10:25:00Z' },
];

const seedCartItems = [
  // Sari's cart (userId: 2)
  { id: 1, userId: 2, productId: 2, quantity: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Speaker Bluetooth JBL Flip 5
  { id: 2, userId: 2, productId: 9, quantity: 2, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Mouse Gaming Razer DeathAdder V3
  
  // Fitri's cart (userId: 6)
  { id: 3, userId: 6, productId: 6, quantity: 4, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Pisang Raja Premium
  { id: 4, userId: 6, productId: 11, quantity: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Selendang Sutra Batik Pesisir
  { id: 5, userId: 6, productId: 12, quantity: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }, // Dompet Kulit Asli Garut
];

const seedSellerPayouts = [
  // Toko Elektronik Maju payouts (sellerId: 1)
  { id: 1, amount: 8500000, date: '2024-01-15', sellerId: 1, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 2, amount: 12500000, date: '2024-01-10', sellerId: 1, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Warung Buah Segar payouts (sellerId: 2)
  { id: 3, amount: 5000000, date: '2024-01-15', sellerId: 2, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 4, amount: 7500000, date: '2024-01-08', sellerId: 2, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Toko Gadget Indonesia payouts (sellerId: 3)
  { id: 5, amount: 10000000, date: '2024-01-15', sellerId: 3, status: 'pending', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 6, amount: 6500000, date: '2024-01-12', sellerId: 3, status: 'completed', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  
  // Boutique Fashion Nusantara payouts (sellerId: 4)
  { id: 7, amount: 13500000, date: '2024-01-15', sellerId: 4, status: 'pending', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// --- Seed function ---
export async function seedDb(db: ReturnType<typeof drizzle>) {
  const existingUsers = await db.select().from(users).all();
  if (existingUsers.length > 0) {
    console.log('[seed] Already seeded.');
    return;
  }

  for (const u of seedUsers) {
    await db.insert(users).values(u).onConflictDoNothing().run();
  }

  for (const s of seedSellers) {
    await db.insert(sellers).values(s).onConflictDoNothing().run();
  }

  for (const p of seedProducts) {
    await db.insert(products).values(p).onConflictDoNothing().run();
  }

  for (const r of seedReports) {
    await db.insert(reports).values(r).onConflictDoNothing().run();
  }

  for (const s of seedSettings) {
    await db.insert(settings)
      .values(s)
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: s.value },
      })
      .run();
  }

  // Seed orders
  for (const o of seedOrders) {
    await db.insert(orders).values(o).onConflictDoNothing().run();
  }

  // Seed cart items
  for (const c of seedCartItems) {
    await db.insert(cart).values(c).onConflictDoNothing().run();
  }

  // Seed seller payouts
  for (const p of seedSellerPayouts) {
    await db.insert(sellerPayouts).values(p).onConflictDoNothing().run();
  }

  console.log('[seed] DB seeded successfully.');
}
