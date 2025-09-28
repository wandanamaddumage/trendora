import { Endpoints } from "../endpoints"
import { baseApi } from "../index"
import { User } from "../auth"

export interface UserFilters {
  search?: string
  role?: 'admin' | 'user' | 'customer'
  is_active?: boolean
  per_page?: number
  page?: number
}

export interface CreateUserRequest {
  role: 'admin' | 'user' | 'customer'
  first_name: string
  last_name: string
  email: string
  contact?: string
  password: string
  is_active?: boolean
  can_create_product?: boolean
  can_update_product?: boolean
  can_delete_product?: boolean
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number
}

export interface UpdatePrivilegesRequest {
  can_create_product?: boolean
  can_update_product?: boolean
  can_delete_product?: boolean
}

export interface AdminMetrics {
  total_products: number
  total_customers: number
  total_active_products: number
  total_users: number
  total_admins: number
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ data: User[]; meta: any }, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        const qs = params.toString()
        const url = qs ? `${Endpoints.AdminUsers}?${qs}` : `${Endpoints.AdminUsers}`
        return { url, method: "GET" }
      },
      transformResponse: (response: any) => response?.data ? response : { data: response, meta: undefined },
      providesTags: ["Users"],
    }),

    getCustomers: builder.query<{ data: User[]; meta: any }, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
        const qs = params.toString()
        const url = qs ? `${Endpoints.AdminCustomers}?${qs}` : `${Endpoints.AdminCustomers}`
        return { url, method: "GET" }
      },
      transformResponse: (response: any) => response?.data ? response : { data: response, meta: undefined },
      providesTags: ["Customers"],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (userData) => ({
        url: Endpoints.AdminUsers,
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...userData }) => ({
        url: `${Endpoints.AdminUsers}/${id}`,
        method: "PATCH",
        body: userData,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: (_result, _err, { id }) => [{ type: "Users", id }],
    }),

    toggleUserActive: builder.mutation<User, number>({
      query: (id) => ({
        url: `${Endpoints.AdminUsers}/${id}/toggle-active`,
        method: "PATCH",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: (_result, _err, id) => [{ type: "Users", id }],
    }),

    toggleCustomerActive: builder.mutation<User, number>({
      query: (id) => ({
        url: `${Endpoints.AdminCustomers}/${id}/toggle-active`,
        method: "PATCH",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: (_result, _err, id) => [{ type: "Customers", id }],
    }),

    updatePrivileges: builder.mutation<{ message: string }, { id: number; data: UpdatePrivilegesRequest }>({
      query: ({ id, data }) => ({
        url: `${Endpoints.AdminUsers}/${id}/privileges`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: (_result, _err, { id }) => [{ type: "Users", id }],
    }),

    deleteUser: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${Endpoints.AdminUsers}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Users"],
    }),

    deleteCustomer: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `${Endpoints.AdminCustomers}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Customers"],
    }),

    getAdminMetrics: builder.query<AdminMetrics, void>({
      query: () => ({
        url: Endpoints.AdminMetrics,
        method: "GET",
      }),
      providesTags: ["Users", "Customers"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetUsersQuery,
  useGetCustomersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useToggleUserActiveMutation,
  useToggleCustomerActiveMutation,
  useUpdatePrivilegesMutation,
  useDeleteUserMutation,
  useDeleteCustomerMutation,
  useGetAdminMetricsQuery,
} = usersApi
