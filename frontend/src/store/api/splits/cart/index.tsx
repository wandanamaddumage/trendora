import { Endpoints } from "../endpoints"
import { baseApi } from "../index"

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
  product: {
    id: number
    name: string
    description: string
    price: number
    brand: string
    category: string
    stock_quantity: number
    is_active: boolean
    image_url?: string
  }
}

export interface Cart {
  id: number
  customer_id: number
  total_price: number
  created_at: string
  updated_at: string
  items: CartItem[]
}

export interface AddCartItemRequest {
  product_id: number
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => ({
        url: Endpoints.Cart,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    getCartItems: builder.query<CartItem[], void>({
      query: () => ({
        url: Endpoints.CartItems,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    addCartItem: builder.mutation<CartItem, AddCartItemRequest>({
      query: (itemData) => ({
        url: Endpoints.CartItems,
        method: "POST",
        body: itemData,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<CartItem, { id: number; data: UpdateCartItemRequest }>({
      query: ({ id, data }) => ({
        url: `${Endpoints.CartItems}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${Endpoints.CartItems}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: Endpoints.Cart,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCartQuery,
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi
