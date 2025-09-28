export const Endpoints = {
  // Auth endpoints
  Login: "/auth/login",
  Register: "/auth/register",
  Logout: "/auth/logout",
  Me: "/auth/me",
  RefreshToken: "/auth/refresh",
  
  // Product endpoints
  Products: "/products",
  
  // Cart endpoints
  Cart: "/cart",
  CartItems: "/cart/items",
  
  // Admin endpoints
  AdminCustomers: "/admin/customers",
  AdminUsers: "/admin/users",
  AdminMetrics: "/admin/metrics",
  
  // Profile endpoints
  Profile: "/profile",
} as const
  