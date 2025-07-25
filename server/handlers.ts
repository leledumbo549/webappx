import { rest } from 'msw';
import {
  validateToken,
  getSettings,
  checkAdminAccess,
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllSellers,
  getSellerById,
  updateSellerStatus,
  getAllProducts,
  getAdminProduct,
  updateProductStatus,
  getAllReports,
  resolveReport,
  getAdminSettings,
  updateAdminSettings,
  createErrorResponse,
  // Add seller product controllers
  getSellerProducts,
  getSellerProduct,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  // Add buyer controllers
  getBuyerProducts,
  getBuyerProduct,
  getBuyerOrders,
  getBuyerOrder,
  // Add seller profile controllers
  getSellerProfile,
  updateSellerProfile,
  getSellerOrders,
  getSellerPayouts,
  // Add new controllers
  createSellerPayout,
  updateSellerOrderStatus,
  getStabletokenBalance,
  mintStabletoken,
  createBuyerOrder,
  updateUserProfile,
  registerUser,
  handlePaymentWebhook,
  getTransactionsForUser,
  loginWithSiwe,
  getUserWallet,
  getWalletBalance,
  getWalletByUserId,
  getAllWallets,
} from './controllers';

// === AUTHORIZATION HELPERS ===

type AuthResult = {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  error?: { status: number; message: string };
};

/**
 * Extract and validate Bearer token from request headers
 */
async function extractToken(req: { headers: { get: (name: string) => string | null } }): Promise<AuthResult> {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return {
      success: false,
      error: { status: 401, message: 'Invalid authentication token' }
    };
  }
  
  const token = auth.split(' ')[1];
  const user = await validateToken(token);
  
  if (!user) {
    return {
      success: false,
      error: { status: 401, message: 'Invalid authentication token' }
    };
  }
  
  return { success: true, user: { ...user, token } };
}

/**
 * Check if user has admin access
 */
async function requireAdmin(req: { headers: { get: (name: string) => string | null } }): Promise<AuthResult> {
  const authResult = await extractToken(req);
  if (!authResult.success) {
    return authResult;
  }
  
  const admin = await checkAdminAccess(authResult.user.token);
  if (!admin) {
    return {
      success: false,
      error: { status: 403, message: 'Access denied' }
    };
  }
  
  return { success: true, user: admin };
}

/**
 * Check if user has seller access
 */
async function requireSeller(req: { headers: { get: (name: string) => string | null } }): Promise<AuthResult> {
  const authResult = await extractToken(req);
  if (!authResult.success) {
    return authResult;
  }
  
  if (authResult.user.role !== 'seller') {
    return {
      success: false,
      error: { status: 403, message: 'Access denied' }
    };
  }
  
  return { success: true, user: authResult.user };
}


/**
 * Check if user is authenticated (any role)
 */
async function requireAuth(req: { headers: { get: (name: string) => string | null } }): Promise<AuthResult> {
  return extractToken(req);
}

/**
 * Add a delay to simulate real API latency
 */
async function addDelay(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
}

// === HANDLERS ===
export const handlers = [
  // === AUTHENTICATION ===
  

  // POST /api/login/siwe - Authenticate via Sign-In with Ethereum
  rest.post('/api/login/siwe', async (req, res, ctx) => {
    try {
      await addDelay();
      const body = await req.json();
      const result = await loginWithSiwe(body);
      if ('MESSAGE' in result) {
        return res(ctx.status(400), ctx.json(result));
      }
      return res(ctx.status(200), ctx.json(result));
    } catch (error) {
      console.error('SIWE login error:', error);
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal server error'))
      );
    }
  }),

  // POST /api/register - Create new user account
  rest.post('/api/register', async (req, res, ctx) => {
    try {
      await addDelay();

      const body = await req.json();
      const result = await registerUser(body);

      if ('MESSAGE' in result) {
        if (result.MESSAGE.includes('required') || result.MESSAGE.includes('Invalid')) {
          return res(ctx.status(400), ctx.json(result));
        }
        if (result.MESSAGE.includes('exists')) {
          return res(ctx.status(409), ctx.json(result));
        }
        return res(ctx.status(500), ctx.json(result));
      }

      return res(ctx.status(201), ctx.json(result));
    } catch (error) {
      console.error('Register handler error:', error);
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal server error'))
      );
    }
  }),

  // GET /api/me - Get current user profile
  rest.get('/api/me', async (req, res, ctx) => {
    try {
      await addDelay();
      
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      return res(ctx.status(200), ctx.json(authResult.user));
      
    } catch (error) {
      console.error('Get user profile error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PUT /api/me - Update current user profile
  rest.put('/api/me', async (req, res, ctx) => {
    try {
      await addDelay();
      
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const body = await req.json();
      const user = await updateUserProfile(authResult.user.token, body);
      
      if (!user) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      return res(ctx.status(200), ctx.json(user));
      
    } catch (error) {
      console.error('Update user profile error:', error);
      if (error instanceof Error && error.message === 'Username already exists') {
        return res(ctx.status(409), ctx.json(createErrorResponse('Username already exists')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/wallet - Get current user's wallet
  rest.get('/api/wallet', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const wallet = await getUserWallet(authResult.user.token);
      if (!wallet) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Wallet not found')));
      }

      return res(ctx.status(200), ctx.json(wallet));
    } catch (error) {
      console.error('Get wallet error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/wallet/balance - Get wallet balance
  rest.get('/api/wallet/balance', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const balance = await getWalletBalance(authResult.user.token);
      if (balance === null) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Wallet not found')));
      }

      return res(ctx.status(200), ctx.json({ balance }));
    } catch (error) {
      console.error('Get wallet balance error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/wallet/:userId - Admin get user wallet
  rest.get('/api/wallet/:userId', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const userId = Number(req.params.userId);
      const wallet = await getWalletByUserId(authResult.user.token, userId);
      if (!wallet) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Wallet not found')));
      }

      return res(ctx.status(200), ctx.json(wallet));
    } catch (error) {
      console.error('Get wallet by user error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === SETTINGS ===
  
  // GET /api/settings - Get application settings
  rest.get('/api/settings', async (_req, res, ctx) => {
    try {
      await addDelay();
      const settings = await getSettings();
      return res(ctx.status(200), ctx.json(settings));
    } catch (error) {
      console.error('Get settings error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === ADMIN DASHBOARD ===
  
  // GET /api/admin/dashboard - Get admin dashboard statistics
  rest.get('/api/admin/dashboard', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const stats = await getDashboardStats();
      return res(ctx.status(200), ctx.json(stats));
      
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === ADMIN USERS ===
  
  // GET /api/admin/users - Get all users
  rest.get('/api/admin/users', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const users = await getAllUsers();
      return res(ctx.status(200), ctx.json(users));
      
    } catch (error) {
      console.error('Get users error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/admin/users/{id} - Get user details
  rest.get('/api/admin/users/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const id = Number(req.params.id);
      const user = await getUserById(id);
      
      if (!user) {
        return res(ctx.status(404), ctx.json(createErrorResponse('User not found')));
      }
      
      return res(ctx.status(200), ctx.json(user));
      
    } catch (error) {
      console.error('Get admin user error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PATCH /api/admin/users/{id} - Update user status
  rest.patch('/api/admin/users/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const id = Number(req.params.id);
      const body = await req.json();
      const { action } = body;
      
      if (action !== 'toggleBan') {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid action')));
      }
      
      const user = await updateUserStatus(id, action);
      
      if (!user) {
        return res(ctx.status(404), ctx.json(createErrorResponse('User not found')));
      }
      
      return res(ctx.status(200), ctx.json(user));
      
    } catch (error) {
      console.error('Update user error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === ADMIN SELLERS ===
  
  // GET /api/admin/sellers - Get all sellers
  rest.get('/api/admin/sellers', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const sellers = await getAllSellers();
      return res(ctx.status(200), ctx.json(sellers));
      
    } catch (error) {
      console.error('Get sellers error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/admin/sellers/{id} - Get seller details
  rest.get('/api/admin/sellers/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const id = Number(req.params.id);
      const seller = await getSellerById(id);
      
      if (!seller) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Seller not found')));
      }
      
      return res(ctx.status(200), ctx.json(seller));
      
    } catch (error) {
      console.error('Get admin seller error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PATCH /api/admin/sellers/{id} - Update seller status
  rest.patch('/api/admin/sellers/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const id = Number(req.params.id);
      const body = await req.json();
      const { action } = body;
      
      if (!['approve', 'reject', 'activate', 'deactivate'].includes(action)) {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid action')));
      }
      
      const seller = await updateSellerStatus(id, action);
      
      if (!seller) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Seller not found')));
      }
      
      return res(ctx.status(200), ctx.json(seller));
      
    } catch (error) {
      console.error('Update seller error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === ADMIN PRODUCTS ===
  
  // GET /api/admin/products - Get all products
  rest.get('/api/admin/products', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const products = await getAllProducts();
      return res(ctx.status(200), ctx.json(products));
      
    } catch (error) {
      console.error('Get products error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/admin/products/{id} - Get product details for admin
  rest.get('/api/admin/products/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const id = Number(req.params.id);
      const product = await getAdminProduct(id);
      
      if (!product) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Product not found')));
      }
      
      return res(ctx.status(200), ctx.json(product));
      
    } catch (error) {
      console.error('Get admin product error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PATCH /api/admin/products/{id} - Update product status
  rest.patch('/api/admin/products/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const id = Number(req.params.id);
      const body = await req.json();
      const { action } = body;
      
      if (!['approve', 'reject', 'flag', 'remove'].includes(action)) {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid action')));
      }
      
      const product = await updateProductStatus(id, action);
      
      if (action === 'remove') {
        return res(ctx.status(200));
      }
      
      if (!product) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Product not found')));
      }
      
      return res(ctx.status(200), ctx.json(product));
      
    } catch (error) {
      console.error('Update product error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/admin/wallets - Get all user wallets
  rest.get('/api/admin/wallets', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const wallets = await getAllWallets(authResult.user.token);
      if (!wallets) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }

      return res(ctx.status(200), ctx.json(wallets));
    } catch (error) {
      console.error('Get wallets error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === ADMIN REPORTS ===
  
  // GET /api/admin/reports - Get all reports
  rest.get('/api/admin/reports', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const reports = await getAllReports();
      return res(ctx.status(200), ctx.json(reports));
      
    } catch (error) {
      console.error('Get reports error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PATCH /api/admin/reports/:id - Resolve report
  rest.patch('/api/admin/reports/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      const id = Number(req.params.id);
      const body = await req.json();
      if (body.action !== 'resolve') {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid action')));
      }
      const report = await resolveReport(id);
      if (!report) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Report not found')));
      }
      return res(ctx.status(200), ctx.json(report));
    } catch (error) {
      console.error('Resolve report error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === ADMIN SETTINGS ===
  
  // GET /api/admin/settings - Get admin settings
  rest.get('/api/admin/settings', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const settings = await getAdminSettings();
      return res(ctx.status(200), ctx.json(settings));
      
    } catch (error) {
      console.error('Get admin settings error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PUT /api/admin/settings - Update admin settings
  rest.put('/api/admin/settings', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const admin = await checkAdminAccess(token);
      
      if (!admin) {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      
      const newSettings = await req.json();
      const updatedSettings = await updateAdminSettings(newSettings);
      return res(ctx.status(200), ctx.json(updatedSettings));
      
    } catch (error) {
      console.error('Update admin settings error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === SELLER PRODUCTS ===
  
  // GET /api/seller/products - Get seller's products
  rest.get('/api/seller/products', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireSeller(req);
      if (!authResult.success) {
        return res(ctx.status(authResult.error!.status), ctx.json(createErrorResponse(authResult.error!.message)));
      }
      
      const products = await getSellerProducts(authResult.user.token);
      return res(ctx.status(200), ctx.json(products));
      
    } catch (error) {
      console.error('Get seller products error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // POST /api/seller/products - Create new product
  rest.post('/api/seller/products', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const productData = await req.json();
      
      const product = await createSellerProduct(token, productData);
      return res(ctx.status(201), ctx.json(product));
      
    } catch (error) {
      console.error('Create seller product error:', error);
      if (error instanceof Error) {
        if (error.message === 'Access denied') {
          return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
        }
        if (error.message.includes('required') || error.message.includes('must be')) {
          return res(ctx.status(400), ctx.json(createErrorResponse(error.message)));
        }
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/seller/products/{id} - Get seller's product details
  rest.get('/api/seller/products/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const productId = Number(req.params.id);
      
      const product = await getSellerProduct(token, productId);
      
      if (!product) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Product not found')));
      }
      
      return res(ctx.status(200), ctx.json(product));
      
    } catch (error) {
      console.error('Get seller product error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PUT /api/seller/products/{id} - Update seller's product
  rest.put('/api/seller/products/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const productId = Number(req.params.id);
      const productData = await req.json();
      
      const product = await updateSellerProduct(token, productId, productData);
      
      if (!product) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Product not found')));
      }
      
      return res(ctx.status(200), ctx.json(product));
      
    } catch (error) {
      console.error('Update seller product error:', error);
      if (error instanceof Error) {
        if (error.message === 'Access denied') {
          return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
        }
        if (error.message.includes('must be')) {
          return res(ctx.status(400), ctx.json(createErrorResponse(error.message)));
        }
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // DELETE /api/seller/products/{id} - Delete seller's product
  rest.delete('/api/seller/products/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const productId = Number(req.params.id);
      
      const deleted = await deleteSellerProduct(token, productId);
      
      if (!deleted) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Product not found')));
      }
      
      return res(ctx.status(204));
      
    } catch (error) {
      console.error('Delete seller product error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === BUYER ENDPOINTS ===
  

  // GET /api/buyer/products - Get all products for buyers
  rest.get('/api/buyer/products', async (_req, res, ctx) => {
    try {
      await addDelay();
      const products = await getBuyerProducts();
      return res(ctx.status(200), ctx.json(products));
    } catch (error) {
      console.error('Get buyer products error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/buyer/products/{id} - Get product details for buyer
  rest.get('/api/buyer/products/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const id = Number(req.params.id);
      const product = await getBuyerProduct(id);
      
      if (!product) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Product not found')));
      }
      
      return res(ctx.status(200), ctx.json(product));
      
    } catch (error) {
      console.error('Get buyer product error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/buyer/orders - Get buyer's orders
  rest.get('/api/buyer/orders', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const orders = await getBuyerOrders(token);
      
      return res(ctx.status(200), ctx.json(orders));
      
    } catch (error) {
      console.error('Get buyer orders error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/buyer/orders/{id} - Get buyer's order details
  rest.get('/api/buyer/orders/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const orderId = Number(req.params.id);
      const order = await getBuyerOrder(token, orderId);
      
      if (!order) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Order not found')));
      }
      
      return res(ctx.status(200), ctx.json(order));
      
    } catch (error) {
      console.error('Get buyer order error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PATCH /api/seller/orders/:id - Update order status
  rest.patch('/api/seller/orders/:id', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      const token = auth.split(' ')[1];
      const orderId = Number(req.params.id);
      const body = await req.json();
      const order = await updateSellerOrderStatus(token, orderId, body);
      if (!order) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Order not found')));
      }
      return res(ctx.status(200), ctx.json(order));
    } catch (error) {
      console.error('Update seller order status error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // POST /api/buyer/orders - Create new order
  rest.post('/api/buyer/orders', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      const token = auth.split(' ')[1];
      const body = await req.json();
      const order = await createBuyerOrder(token, body);
      if (!order) {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid order request')));
      }
      return res(ctx.status(201), ctx.json(order));
    } catch (error) {
      console.error('Create buyer order error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // === SELLER PROFILE ENDPOINTS ===
  
  // GET /api/seller/profile - Get seller profile
  rest.get('/api/seller/profile', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const profile = await getSellerProfile(token);
      
      if (!profile) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Seller profile not found')));
      }
      
      return res(ctx.status(200), ctx.json(profile));
      
    } catch (error) {
      console.error('Get seller profile error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // PUT /api/seller/profile - Update seller profile
  rest.put('/api/seller/profile', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const body = await req.json();
      
      const profile = await updateSellerProfile(token, body);
      
      if (!profile) {
        return res(ctx.status(404), ctx.json(createErrorResponse('Seller profile not found')));
      }
      
      return res(ctx.status(200), ctx.json(profile));
      
    } catch (error) {
      console.error('Update seller profile error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/seller/orders - Get seller orders
  rest.get('/api/seller/orders', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      
      const token = auth.split(' ')[1];
      const orders = await getSellerOrders(token);
      
      return res(ctx.status(200), ctx.json(orders));
      
    } catch (error) {
      console.error('Get seller orders error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/seller/payouts - Get seller payouts
  rest.get('/api/seller/payouts', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      const token = auth.split(' ')[1];
      const payouts = await getSellerPayouts(token);
      return res(ctx.status(200), ctx.json(payouts));
    } catch (error) {
      console.error('Get seller payouts error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // POST /api/seller/payouts - Request new payout
  rest.post('/api/seller/payouts', async (req, res, ctx) => {
    try {
      await addDelay();
      const auth = req.headers.get('authorization');
      if (!auth || !auth.startsWith('Bearer ')) {
        return res(ctx.status(401), ctx.json(createErrorResponse('Invalid authentication token')));
      }
      const token = auth.split(' ')[1];
      const body = await req.json();
      const payout = await createSellerPayout(token, body);
      if (!payout) {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid payout request')));
      }
      return res(ctx.status(201), ctx.json(payout));
    } catch (error) {
      console.error('Create seller payout error:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        return res(ctx.status(403), ctx.json(createErrorResponse('Access denied')));
      }
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/balance - Get stabletoken balance for current user
  rest.get('/api/balance', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const balance = await getStabletokenBalance(authResult.user.id);
      return res(ctx.status(200), ctx.json({ balance }));
    } catch (error) {
      console.error('Get balance error:', error);
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal server error'))
      );
    }
  }),

  // POST /api/payments/initiate - Initiate payment via Xendit
  rest.post('/api/payments/initiate', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const body = await req.json();
      const amount = Number(body.amount);
      if (!amount || Number.isNaN(amount) || amount <= 0) {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid amount')));
      }

      const paymentId = `pay_${Date.now()}`;
      const paymentUrl = `https://checkout.xendit.co/${paymentId}`;
      return res(ctx.status(200), ctx.json({ paymentId, paymentUrl }));
    } catch (error) {
      console.error('Initiate payment error:', error);
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal server error'))
      );
    }
  }),

  // POST /api/payments/webhook - Handle payment status update
  rest.post('/api/payments/webhook', async (req, res, ctx) => {
    try {
      const body = await req.json();
      await handlePaymentWebhook(body);
      return res(ctx.status(200), ctx.json({ received: true }));
    } catch (error) {
      console.error('Payment webhook error:', error);
      return res(ctx.status(500), ctx.json(createErrorResponse('Internal server error')));
    }
  }),

  // GET /api/transactions - Get user transaction history
  rest.get('/api/transactions', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAuth(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const transactions = await getTransactionsForUser(authResult.user.id);
      return res(ctx.status(200), ctx.json({ transactions }));
    } catch (error) {
      console.error('Get transactions error:', error);
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal server error'))
      );
    }
  }),

  // POST /api/mint - Mint stabletoken (admin only)
  rest.post('/api/mint', async (req, res, ctx) => {
    try {
      await addDelay();
      const authResult = await requireAdmin(req);
      if (!authResult.success) {
        return res(
          ctx.status(authResult.error!.status),
          ctx.json(createErrorResponse(authResult.error!.message))
        );
      }

      const body = await req.json();
      const amount = Number(body.amount);
      const userId = Number(body.userId ?? authResult.user.id);

      if (!amount || Number.isNaN(amount) || amount <= 0) {
        return res(ctx.status(400), ctx.json(createErrorResponse('Invalid amount')));
      }

      const balance = await mintStabletoken(userId, amount);
      return res(ctx.status(200), ctx.json({ balance }));
    } catch (error) {
      console.error('Mint stabletoken error:', error);
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal server error'))
      );
    }
  }),
];


