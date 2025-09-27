import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: { id: string; userName: string } | null
  isAuthenticated: boolean
  isAdmin: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ id: string; userName: string; isAdmin?: boolean }>) => {
      state.user = { id: action.payload.id, userName: action.payload.userName }
      state.isAuthenticated = true
      state.isAdmin = !!action.payload.isAdmin
    },
    signOut: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
    },
  },
})

export const { signIn, signOut } = authSlice.actions
export default authSlice.reducer
