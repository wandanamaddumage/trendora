"use client"

import { useCallback, useMemo, useState } from "react"
import { env } from "@/configs/env"
import { getAccessToken } from "@/utils/auth"
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductActiveMutation,
  type ProductFilters,
} from "@/store/api/splits/products"

// Types used by the All Products pages/forms
export interface UiProduct {
  _id?: string
  brand: string
  name: string
  imageUrl?: string
  quantity: number
  costPrice: number
  sellPrice: number
  description?: string
  rating?: number
  isActive: boolean
  category?: string
  tags?: string[]
  createdAt?: string
}

// Map backend product to UI product shape
const mapToUiProduct = (p: any): UiProduct => ({
  _id: String(p.id ?? p._id ?? ""),
  brand: p.brand,
  name: p.name,
  imageUrl: p.image_url || p.imageUrl,
  quantity: p.stock_quantity ?? p.quantity ?? 0,
  costPrice: p.cost_price ?? p.costPrice ?? 0,
  sellPrice: p.price ?? p.sellPrice ?? 0,
  description: p.description,
  rating: p.rating,
  isActive: p.is_active ?? p.isActive ?? true,
  category: p.category,
  tags: p.tags,
  createdAt: p.created_at ?? p.createdAt,
})

// Map UI filters to API filters expected by Laravel backend
const mapFilters = (filters: any): Record<string, any> => {
  const mapped: Record<string, any> = {}
  if (filters?.search) mapped.q = filters.search
  if (filters?.brand) mapped.brand = filters.brand
  if (filters?.category) mapped.category = filters.category
  if (filters?.minPrice !== undefined && filters.minPrice !== '') mapped.min_price = Number(filters.minPrice)
  if (filters?.maxPrice !== undefined && filters.maxPrice !== '') mapped.max_price = Number(filters.maxPrice)
  if (filters?.minRating !== undefined && filters.minRating !== '') mapped.min_rating = Number(filters.minRating)
  if (filters?.isActive !== undefined) mapped.is_active = filters.isActive
  if (filters?.sortBy) mapped.sort = filters.sortBy
  if (filters?.sortOrder) mapped.sort_direction = filters.sortOrder
  if (filters?.per_page) mapped.per_page = filters.per_page
  if (filters?.page) mapped.page = filters.page
  return mapped
}

export function useProductCRUD() {
  const [queryFilters, setQueryFilters] = useState<ProductFilters>({})

  const { data, isFetching, refetch } = useGetProductsQuery(queryFilters, {
    // Always keep previous data while fetching
    refetchOnMountOrArgChange: true,
  })

  const [createProductMut] = useCreateProductMutation()
  const [updateProductMut] = useUpdateProductMutation()
  const [deleteProductMut] = useDeleteProductMutation()
  const [toggleActiveMut] = useToggleProductActiveMutation()

  const products: UiProduct[] = useMemo(() => {
    if (!data?.data) return []
    return data.data.map(mapToUiProduct)
  }, [data])

  const fetchProducts = useCallback((filters?: any) => {
    if (filters) {
      setQueryFilters(mapFilters(filters))
    } else {
      setQueryFilters({})
    }
    // RTK Query will auto refetch due to arg change
  }, [])

  // Transform UI payload to backend payload
  const toCreatePayload = (p: any) => ({
    name: p.name,
    description: p.description ?? "",
    price: Number(p.sellPrice ?? p.price ?? 0),
    cost_price: Number(p.costPrice ?? p.cost_price ?? 0),
    brand: p.brand,
    category: p.category ?? "",
    stock_quantity: Number(p.quantity ?? p.stock_quantity ?? 0),
    is_active: p.isActive ?? true,
  })

  const toUpdatePayload = (p: any) => ({
    name: p.name,
    description: p.description,
    price: Number(p.sellPrice ?? p.price ?? 0),
    cost_price: Number(p.costPrice ?? p.cost_price ?? 0),
    brand: p.brand,
    category: p.category,
    stock_quantity: Number(p.quantity ?? p.stock_quantity ?? 0),
    is_active: Boolean(p.isActive ?? p.is_active ?? true),
  })

  const createProduct = useCallback(async (payload: any) => {
    try {
      const res = await createProductMut(toCreatePayload(payload)).unwrap()
      await refetch()
      return { success: true, data: mapToUiProduct(res) }
    } catch (e: any) {
      return { success: false, error: e?.data?.message || e?.message || "Failed to create product" }
    }
  }, [createProductMut, refetch])

  const updateProduct = useCallback(async (id: string | number, payload: any) => {
    try {
      const res = await updateProductMut({ id: Number(id), ...toUpdatePayload(payload) }).unwrap()
      await refetch()
      return { success: true, data: mapToUiProduct(res) }
    } catch (e: any) {
      return { success: false, error: e?.data?.message || e?.message || "Failed to update product" }
    }
  }, [updateProductMut, refetch])

  const deleteProduct = useCallback(async (id: string | number) => {
    try {
      await deleteProductMut(Number(id)).unwrap()
      await refetch()
      return { success: true }
    } catch (e: any) {
      return { success: false, error: e?.data?.message || e?.message || "Failed to delete product" }
    }
  }, [deleteProductMut, refetch])

  const toggleProductActive = useCallback(async (id: string | number) => {
    try {
      const res = await toggleActiveMut(Number(id)).unwrap()
      await refetch()
      return { success: true, data: mapToUiProduct(res) }
    } catch (e: any) {
      return { success: false, error: e?.data?.message || e?.message || "Failed to toggle product" }
    }
  }, [toggleActiveMut, refetch])

  const uploadProductImage = useCallback(async (file: File, id?: string | number) => {
    try {
      if (!id) return { success: false, error: "Product ID is required for image upload" }
      const form = new FormData()
      form.append("image", file)

      const resp = await fetch(`${env.urls.apiUrl}/products/${id}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}` || "",
        } as any,
        body: form,
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        return { success: false, error: err?.message || "Failed to upload image" }
      }

      const json = await resp.json()
      return { success: true, url: json.image_url || json.imageUrl }
    } catch (e: any) {
      return { success: false, error: e?.message || "Failed to upload image" }
    }
  }, [])

  return {
    products,
    loading: isFetching,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    uploadProductImage,
  }
}
