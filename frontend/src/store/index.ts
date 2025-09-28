import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import cartReducer from './slices/cart'
import { baseApi } from './api/splits'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
