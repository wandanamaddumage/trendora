import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../api/splits/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload.token)
      }
    },
    
    signOut: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.token = null
      state.loading = false
      
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
})

export const { setCredentials, signOut, setLoading, updateUser } = authSlice.actions
export default authSlice.reducer