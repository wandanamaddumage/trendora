import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Async login thunk (simulate API call / demo credentials)
export const signInAsync = createAsyncThunk(
  'auth/signInAsync',
  async (payload: { email: string; password: string }) => {
    const demoUsers = [
      { id: '1', userName: 'Admin', email: 'admin@trendora.com', password: 'admin123', isAdmin: true },
      { id: '2', userName: 'Staff', email: 'staff@trendora.com', password: 'staff123', isAdmin: false },
    ]
    const user = demoUsers.find(u => u.email === payload.email && u.password === payload.password)
    if (!user) throw new Error('Invalid credentials')
    return { id: user.id, userName: user.userName, isAdmin: user.isAdmin }
  }
)

interface AuthState {
  user: { id: string; userName: string } | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(
        signInAsync.fulfilled,
        (state, action: PayloadAction<{ id: string; userName: string; isAdmin: boolean }>) => {
          state.user = { id: action.payload.id, userName: action.payload.userName }
          state.isAuthenticated = true
          state.isAdmin = action.payload.isAdmin
          state.loading = false
        }
      )
      .addCase(signInAsync.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isAdmin = false
        state.loading = false
      })
  },
})

export const { signOut } = authSlice.actions
export default authSlice.reducer