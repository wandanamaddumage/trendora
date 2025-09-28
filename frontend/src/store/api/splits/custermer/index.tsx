import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Customer {
  id: string
  name: string
  isActive: boolean
}

const sampleCustomers: Customer[] = [
  { id: '1', name: 'Customer A', isActive: true },
  { id: '2', name: 'Customer B', isActive: false },
  { id: '3', name: 'Customer C', isActive: true },
]

export const customersApi = createApi({
  reducerPath: 'customersApi',
  baseQuery: async () => {
    await new Promise(res => setTimeout(res, 500))
    return { data: sampleCustomers }
  },
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => '',
    }),
  }),
})

export const { useGetCustomersQuery } = customersApi
