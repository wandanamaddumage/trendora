import { Endpoints } from "../endpoints"
import { baseApi } from "../index"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  contact: string
  password: string
  password_confirmation: string
}

export interface User {
  id: number
  role: 'admin' | 'user' | 'customer'
  first_name: string
  last_name: string
  email: string
  contact?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: Endpoints.Login,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: Endpoints.Register,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: Endpoints.Logout,
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    
    getMe: builder.query<User, void>({
      query: () => ({
        url: Endpoints.Me,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi
