import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  image?: string
}

export interface Cart {
  items: CartItem[]
  totalPrice: number
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/cart',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCartItems: builder.query<CartItem[], void>({
      query: () => '/items',
      providesTags: ['Cart'],
    }),
    addItem: builder.mutation<void, { productId: string; quantity: number }>({
      query: (body) => ({
        url: '/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateItem: builder.mutation<void, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/items/${id}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: '',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartItemsQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi
