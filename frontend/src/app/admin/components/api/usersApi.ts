import { baseApi } from '@/store/api/splits'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  isActive: boolean
  createdAt: string
}

const sampleUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@trendora.com', role: 'admin', isActive: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Regular User', email: 'user@trendora.com', role: 'user', isActive: true, createdAt: '2024-01-02' },
  { id: '3', name: 'Test User', email: 'test@trendora.com', role: 'user', isActive: false, createdAt: '2024-01-03' },
]

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: 'users',
        method: 'GET',
      }),
      transformResponse: () => sampleUsers,
    }),
  }),
})

export const { useGetUsersQuery } = usersApi
