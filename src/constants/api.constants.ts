export const API = {
  AUTH: {
    LOGIN:   '/auth/login',          // POST
    LOGOUT:  '/auth/logout',         // POST
    REGISTER: '/auth/register',      // POST
    CHANGE_PASSWORD: '/auth/change-password', // PUT
    FORGOT_PASSWORD: '/auth/forgot-password', // POST
    RESET_PASSWORD: '/auth/reset-password',   // POST
    UNLOCK: (username: string) => `/auth/unlock/${username}`, // PUT
    PROFILE: '/auth/me',             // GET (assumed)
  },
  PRODUCTS: {
    BASE:    '/products',            // GET (list), POST (create)
    BY_ID:   (id: string | number) => `/products/${id}`,   // GET, PUT, DELETE
    LOW_STOCK: '/products/low-stock', // GET
    UPDATE_STOCK: (id: string | number) => `/products/update-stock/${id}`, // PUT (query ?stock=N)
    SEARCH: '/products/search',      // GET (query ?name=X)
    BY_CATEGORY: (cat: string) => `/products/category/${cat}`, // GET
  },
  BATCHES: {
    BASE:    '/batches',
    BY_ID:   (id: string | number) => `/batches/${id}`,
    BY_PRODUCT: (productId: string) => `/batches/product/${productId}`, // GET
    ALLOCATE: '/batches/allocate',   // POST
    REDUCE: (id: string | number) => `/batches/reduce/${id}`, // POST
    SPOIL: (id: string | number) => `/batches/${id}/spoil`, // PUT
    RECALL: (id: string | number) => `/batches/${id}/recall`, // PUT
    EXPIRING_SOON: '/batches/expiring-soon', // GET (query ?days=N)
    COUNT: '/batches/count',         // GET
    EXPIRING_COUNT: '/batches/expiring/count', // GET
  },
  INVENTORY: {
    BASE:    '/inventory',
    ADJUST:  '/inventory/adjust',
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview', // GET
  },
  SUPPLIERS: {
    BASE: '/suppliers', // GET, POST
    BY_ID: (id: string | number) => `/suppliers/${id}`, // GET, PUT, DELETE
    COUNT: '/suppliers/count', // GET
    RATING: (id: string | number) => `/suppliers/${id}/rating`, // PUT
    ASSIGN_PRODUCT: '/suppliers/assign-product', // POST
    PRODUCTS: (id: string | number) => `/suppliers/${id}/products`, // GET
    BEST: (productId: string) => `/suppliers/best/${productId}`, // GET
  },
  LOCATIONS: {
    BASE: '/location', // GET, POST
    BY_ID: (id: string | number) => `/location/${id}`, // GET
    COUNT: '/location/count', // GET (assumed from get-warehouse-count)
    ASSIGN: '/location/assign', // POST
    MOVE: '/location/move', // POST
    INVENTORY: (id: string | number) => `/location/${id}/inventory`, // GET
    BY_BATCH: (batchId: string | number) => `/location/batch/${batchId}`, // GET
  },
  NOTIFICATIONS: {
    BASE: '/notifications', // GET
    UNREAD_COUNT: '/notifications/unread/count', // GET
    COUNT: '/notifications/count', // GET
  },
  REORDERS: {
    BASE: '/reorders', // POST
    PENDING_COUNT: '/reorders/pending/count', // GET
  },
  ANALYTICS: {
    MONTHLY: '/analytics/monthly', // GET
  }
};
