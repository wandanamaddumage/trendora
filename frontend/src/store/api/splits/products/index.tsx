import { Endpoints } from "../endpoints"
import { baseApi } from "../index"
import type { Product } from "@/types/product"

export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  min?: number
  max?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  per_page?: number
  page?: number
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  brand: string
  category: string
  stock_quantity: number
  is_active?: boolean
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: Product[]; meta: any }, ProductFilters>({
      query: (filters) => {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })

        return {
          url: `${Endpoints.Products}?${params.toString()}`,
          method: "GET",
        }
      },
      providesTags: ["Products"],
    }),

    getProductById: builder.query<Product, number>({
      query: (id) => ({
        url: `${Endpoints.Products}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Products", id }],
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (productData) => ({
        url: Endpoints.Products,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: ({ id, ...productData }) => ({
        url: `${Endpoints.Products}/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Products", id }],
    }),

    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${Endpoints.Products}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    toggleProductActive: builder.mutation<Product, number>({
      query: (id) => ({
        url: `${Endpoints.Products}/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, id) => [{ type: "Products", id }],
    }),
  }),
  overrideExisting: false,
})

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductActiveMutation,
} = productsApi
