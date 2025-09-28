import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface User {
  id: string
  name: string
}

const sampleUsers: User[] = [
  { id: '1', name: 'Admin' },
  { id: '2', name: 'Staff A' },
  { id: '3', name: 'Staff B' },
]

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: async () => {
    await new Promise(res => setTimeout(res, 500))
    return { data: sampleUsers }
  },
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '',
    }),
  }),
})

export const { useGetUsersQuery } = usersApi
