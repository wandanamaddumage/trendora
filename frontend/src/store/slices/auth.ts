import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: number
  userName: string
  email: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true
      state.error = null
    },
    signInSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
      state.isAdmin = action.payload.isAdmin
      state.error = null
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    signOut: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.loading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { signInStart, signInSuccess, signInFailure, signOut, clearError } = authSlice.actions
export default authSlice.reducer
