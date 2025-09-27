import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: number
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    price: number
    image: string
  }
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId)
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const item = state.items.find(item => item.productId === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.productId !== action.payload.productId)
        }
      }
      
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setLoading, setError } = cartSlice.actions
export default cartSlice.reducer
