import { Endpoints } from "../endpoints"
import { baseApi } from "../index"
import type { Product } from "@/types/product"

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<
      Product[],
      {
        searchTerm?: string
        category?: string
        brand?: string
        priceRange?: { min?: string; max?: string }
        sortBy?: string
        sortOrder?: "asc" | "desc"
      }
    >({
      query: ({ searchTerm, category, brand, priceRange, sortBy, sortOrder }) => {
        const params = new URLSearchParams()

        if (searchTerm) params.append("search", searchTerm)
        if (category) params.append("category", category)
        if (brand) params.append("brand", brand)
        if (priceRange?.min) params.append("min", priceRange.min)
        if (priceRange?.max) params.append("max", priceRange.max)
        if (sortBy) params.append("sortBy", sortBy)
        if (sortOrder) params.append("sortOrder", sortOrder)

        return {
          url: `${Endpoints.Products}?${params.toString()}`,
          method: "GET",
        }
      },
      providesTags: ["Products"], // 👈 optional, useful if you want cache invalidation later
    }),

    // Example: get single product by ID
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `${Endpoints.Products}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Products", id }],
    }),
  }),
  overrideExisting: false,
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi
