import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  brand: string
}

export interface CartState {
  [x: string]: any
  items: CartItem[]
}

const initialState: CartState = {
  items: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('trendora-cart') || '[]')
    : []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(i => i.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      localStorage.setItem('trendora-cart', JSON.stringify(state.items))
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload)
      localStorage.setItem('trendora-cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id)
      if (!item) return
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter(i => i.id !== action.payload.id)
      } else {
        item.quantity = action.payload.quantity
      }
      localStorage.setItem('trendora-cart', JSON.stringify(state.items))
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('trendora-cart')
    },
  },
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions

export const getTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export const getTotalPrice = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer
