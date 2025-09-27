import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import cartReducer from './slices/cart'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
})

// types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
