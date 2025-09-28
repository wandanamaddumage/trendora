"use client"

import { useCallback, useMemo, useState } from "react"
import {
  useGetCustomersQuery,
  useToggleCustomerActiveMutation,
  useDeleteCustomerMutation,
  type UserFilters,
} from "@/store/api/splits/user"

export interface UiCustomer {
  _id: string
  firstName: string
  lastName: string
  email: string
  contact?: string
  address?: string
  dateOfBirth?: string
  isActive: boolean
  lastLogin?: string
  createdAt?: string
  profileImage?: string
}

const mapToUiCustomer = (u: any): UiCustomer => ({
  _id: String(u.id ?? u._id ?? ""),
  firstName: u.first_name ?? u.firstName ?? "",
  lastName: u.last_name ?? u.lastName ?? "",
  email: u.email,
  contact: u.contact,
  address: u.address,
  dateOfBirth: u.date_of_birth ?? u.dateOfBirth,
  isActive: u.is_active ?? u.isActive ?? true,
  lastLogin: u.last_login ?? u.lastLogin,
  createdAt: u.created_at ?? u.createdAt,
  profileImage: u.profile_image ?? u.profileImage,
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

export function useCustomerCRUD() {
  const [queryFilters, setQueryFilters] = useState<UserFilters | Record<string, any>>({})

  const { data, isFetching, refetch } = useGetCustomersQuery(queryFilters as UserFilters, {
    refetchOnMountOrArgChange: true,
  })

  const [toggleActiveMut] = useToggleCustomerActiveMutation()
  const [deleteCustomerMut] = useDeleteCustomerMutation()

  const customers: UiCustomer[] = useMemo(() => {
    if (!data?.data) return []
    return data.data.map(mapToUiCustomer)
  }, [data])

  const fetchCustomers = useCallback((filters?: any) => {
    if (filters) setQueryFilters(mapFilters(filters))
    else setQueryFilters({})
  }, [])

  const updateCustomerStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      await toggleActiveMut(Number(id)).unwrap()
      await refetch()
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e?.data?.message || e?.message || "Failed to update status" }
    }
  }, [toggleActiveMut, refetch])

  const deleteCustomer = useCallback(async (id: string) => {
    try {
      await deleteCustomerMut(Number(id)).unwrap()
      await refetch()
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e?.data?.message || e?.message || "Failed to delete customer" }
    }
  }, [deleteCustomerMut, refetch])

  return {
    customers,
    loading: isFetching,
    fetchCustomers,
    updateCustomerStatus,
    deleteCustomer,
  }
}
