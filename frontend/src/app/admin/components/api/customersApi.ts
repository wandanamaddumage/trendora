import { baseApi } from '@/store/api/splits'

export interface Customer {
  id: string
  name: string
  email: string
  isActive: boolean
  createdAt: string
}

const sampleCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', isActive: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', isActive: true, createdAt: '2024-01-02' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', isActive: false, createdAt: '2024-01-03' },
]

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => ({
        url: 'customers',
        method: 'GET',
      }),
      transformResponse: () => sampleCustomers,
    }),
  }),
})

export const { useGetCustomersQuery } = customersApi
