// Mock axios module to avoid import.meta issues in tests
jest.mock('./client/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  },
  API_BASE_URL: 'http://localhost:3000',
  isAxiosError: jest.fn()
}));

// Mock @reown/appkit for tests
jest.mock('@reown/appkit/react', () => ({
  useAppKit: () => ({ open: jest.fn() }),
  useAppKitAccount: () => ({ isConnected: false, address: null }),
  useAppKitNetworkCore: () => ({ chainId: 1 }),
  useAppKitProvider: () => ({ walletProvider: null }),
}));

// Mock import.meta for tests
global.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000'
    }
  }
}; 