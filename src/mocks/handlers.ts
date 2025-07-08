import { rest } from 'msw'
import type { Product } from '../types/Product'

let products: Product[] = [
  {
    id: 1,
    name: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan ayam dan telur',
    price: 25000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Kopi Luwak',
    description: 'Kopi premium asli Indonesia',
    price: 75000,
    category: 'Minuman',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Sate Ayam',
    description: 'Sate ayam bumbu kacang lezat',
    price: 20000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Teh Botol',
    description: 'Minuman teh manis dalam botol',
    price: 5000,
    category: 'Minuman',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Keripik Pisang',
    description: 'Camilan keripik pisang renyah',
    price: 10000,
    category: 'Camilan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Bakso Malang',
    description: 'Bakso daging sapi dengan kuah gurih',
    price: 18000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'Es Cendol',
    description: 'Minuman tradisional dengan santan dan gula merah',
    price: 12000,
    category: 'Minuman',
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'Mi Aceh',
    description: 'Mi pedas khas Aceh dengan irisan daging sapi',
    price: 30000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: 'Rendang Padang',
    description: 'Rendang sapi bumbu khas Padang',
    price: 45000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    name: 'Gudeg Jogja',
    description: 'Nangka muda dimasak manis khas Yogyakarta',
    price: 35000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 11,
    name: 'Laptop Lokal',
    description: 'Laptop buatan produsen lokal dengan spesifikasi mumpuni',
    price: 5500000,
    category: 'Elektronik',
    createdAt: new Date().toISOString(),
  },
  {
    id: 12,
    name: 'Kaos Batik',
    description: 'Kaos dengan motif batik modern',
    price: 80000,
    category: 'Fashion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 13,
    name: 'Sneakers Lokal',
    description: 'Sepatu sneakers produksi lokal',
    price: 350000,
    category: 'Fashion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 14,
    name: 'Tas Rotan',
    description: 'Tas anyaman rotan khas Bali',
    price: 150000,
    category: 'Fashion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 15,
    name: 'Kamera Aksi',
    description: 'Kamera aksi tahan air untuk petualangan',
    price: 900000,
    category: 'Elektronik',
    createdAt: new Date().toISOString(),
  },
  {
    id: 16,
    name: 'Minyak Telon',
    description: 'Minyak telon hangat untuk bayi',
    price: 25000,
    category: 'Kesehatan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 17,
    name: 'Balsem Gosok',
    description: 'Balsem gosok untuk meredakan pegal',
    price: 18000,
    category: 'Kesehatan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 18,
    name: 'Jas Hujan',
    description: 'Jas hujan model ponco tahan air',
    price: 50000,
    category: 'Olahraga',
    createdAt: new Date().toISOString(),
  },
  {
    id: 19,
    name: 'Raket Badminton',
    description: 'Raket ringan untuk bermain badminton',
    price: 220000,
    category: 'Olahraga',
    createdAt: new Date().toISOString(),
  },
  {
    id: 20,
    name: 'Matras Yoga',
    description: 'Matras yoga anti slip',
    price: 150000,
    category: 'Olahraga',
    createdAt: new Date().toISOString(),
  },
  {
    id: 21,
    name: 'Makeup Remover',
    description: 'Pembersih makeup yang lembut di kulit',
    price: 60000,
    category: 'Kecantikan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 22,
    name: 'Lipstik Merah',
    description: 'Lipstik warna merah klasik tahan lama',
    price: 75000,
    category: 'Kecantikan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 23,
    name: 'Serum Wajah',
    description: 'Serum wajah untuk kulit glowing',
    price: 120000,
    category: 'Kecantikan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 24,
    name: 'Sambal Roa',
    description: 'Sambal khas Manado pedas gurih',
    price: 35000,
    category: 'Makanan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 25,
    name: 'Kerupuk Udang',
    description: 'Kerupuk udang renyah ukuran besar',
    price: 20000,
    category: 'Camilan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 26,
    name: 'Baju Koko',
    description: 'Baju koko pria lengan panjang',
    price: 180000,
    category: 'Fashion',
    createdAt: new Date().toISOString(),
  },
  {
    id: 27,
    name: 'Tablet Lokal',
    description: 'Tablet Android untuk belajar online',
    price: 2500000,
    category: 'Elektronik',
    createdAt: new Date().toISOString(),
  },
  {
    id: 28,
    name: 'Kopi Tubruk',
    description: 'Kopi hitam khas Indonesia',
    price: 15000,
    category: 'Minuman',
    createdAt: new Date().toISOString(),
  },
  {
    id: 29,
    name: 'Dodol Garut',
    description: 'Camilan manis khas Garut',
    price: 25000,
    category: 'Camilan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 30,
    name: 'Batik Tulis',
    description: 'Kain batik tulis motif klasik',
    price: 650000,
    category: 'Fashion',
    createdAt: new Date().toISOString(),
  },
]

export const handlers = [
  rest.post('/api/login', async (req, res, ctx) => {
    const { username, password } = await req.json()
    // Example: accept any username/password, return a fake token
    if (username && password) {
      return res(ctx.status(200), ctx.json({ token: 'my-secret-token' }))
    }
    return res(ctx.status(400), ctx.json({ message: 'access denied' }))
  }),
  rest.get('/api/version', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json({ value: 1 }))
  }),
  rest.get('/api/products', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(products))
  }),
  rest.post('/api/products', async (req, res, ctx) => {
    const data = (await req.json()) as Omit<Product, 'id' | 'createdAt'>
    const newProduct: Product = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      ...data,
    }
    products.push(newProduct)
    return res(ctx.status(201), ctx.json(newProduct))
  }),
  rest.put('/api/products/:id', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ message: 'Product not found' }))
    }
    const data = (await req.json()) as Partial<Product>
    products[index] = { ...products[index], ...data }
    return res(ctx.status(200), ctx.json(products[index]))
  }),
  rest.delete('/api/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    products = products.filter((p) => p.id !== id)
    return res(ctx.status(204))
  }),
]
