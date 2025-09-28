"use client"

import { useAppSelector } from "@/store/hooks"

const ROLE_PRIVILEGES: Record<string, string[]> = {
  admin: [
    "canAddProducts",
    "canUpdateProducts",
    "canDeleteProducts",
    "canManageCustomers",
    "canViewDashboard",
  ],
  user: [
    "canAddProducts",
    "canUpdateProducts",
    "canViewDashboard",
  ],
  customer: [],
}

export function useAuth() {
  const { user, isAuthenticated, token } = useAppSelector((s) => s.auth)

  const hasPrivilege = (privilege: string) => {
    if (!user) return false
    const role = user.role || "customer"
    return (ROLE_PRIVILEGES[role] || []).includes(privilege)
  }

  return {
    user,
    isAuthenticated,
    token,
    role: user?.role ?? "customer",
    hasPrivilege,
  }
}
