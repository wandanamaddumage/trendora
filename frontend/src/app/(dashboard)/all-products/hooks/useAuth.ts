"use client"

import { useAppSelector } from "@/store/hooks"

// Simple role-based privileges. Extend as needed.
const ROLE_PRIVILEGES: Record<string, string[]> = {
  admin: [
    "canAddProducts",
    "canUpdateProducts",
    "canDeleteProducts",
    "canManageCustomers",
    "canViewDashboard",
  ],
  user: [
    // Treat 'user' as staff here
    "canAddProducts",
    "canUpdateProducts",
    "canViewDashboard",
  ],
  customer: [
    // basic customer, no admin/staff privileges
  ],
}

export function useAuth() {
  const { user, isAuthenticated, token } = useAppSelector((s) => s.auth)

  const hasPrivilege = (privilege: string) => {
    if (!user) return false
    const role = user.role || "customer"
    const list = ROLE_PRIVILEGES[role] || []
    return list.includes(privilege)
  }

  return {
    user,
    isAuthenticated,
    token,
    role: user?.role ?? "customer",
    hasPrivilege,
  }
}
