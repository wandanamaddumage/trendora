"use client"

import { useCallback, useMemo, useState } from "react"
import {
  useGetUsersQuery,
  type UserFilters,
} from "@/store/api/splits/user"

export interface UiUser {
  _id: string
  role: 'admin' | 'user' | 'customer'
  firstName: string
  lastName: string
  email: string
  contact?: string
  isActive: boolean
  createdAt?: string
}

const mapToUiUser = (u: any): UiUser => ({
  _id: String(u.id ?? u._id ?? ""),
  role: u.role ?? 'user',
  firstName: u.first_name ?? u.firstName ?? "",
  lastName: u.last_name ?? u.lastName ?? "",
  email: u.email,
  contact: u.contact,
  isActive: u.is_active ?? u.isActive ?? true,
  createdAt: u.created_at ?? u.createdAt,
})

const mapFilters = (filters: any): Record<string, any> => {
  const mapped: Record<string, any> = {}
  if (filters?.search) mapped.search = filters.search
  if (filters?.role) mapped.role = filters.role
  if (filters?.isActive !== undefined) mapped.is_active = filters.isActive
  if (filters?.per_page) mapped.per_page = filters.per_page
  if (filters?.page) mapped.page = filters.page
  return mapped
}

export function useUserCRUD() {
  const [queryFilters, setQueryFilters] = useState<UserFilters | Record<string, any>>({})
  const { data, isFetching, refetch } = useGetUsersQuery(queryFilters as UserFilters, {
    refetchOnMountOrArgChange: true,
  })

  const users: UiUser[] = useMemo(() => {
    if (!data?.data) return []
    return data.data.map(mapToUiUser)
  }, [data])

  const fetchUsers = useCallback((filters?: any) => {
    if (filters) setQueryFilters(mapFilters(filters))
    else setQueryFilters({})
  }, [])

  return {
    users,
    loading: isFetching,
    fetchUsers,
    refetch,
  }
}
