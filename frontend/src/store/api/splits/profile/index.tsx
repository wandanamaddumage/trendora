import { Endpoints } from "../endpoints"
import { baseApi } from "../index"

export interface Profile {
  id: number
  first_name: string
  last_name: string
  email: string
  contact?: string
  role: 'admin' | 'user' | 'customer'
  profile_image?: string
  address?: string
  date_of_birth?: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
  contact?: string
  address?: string
  date_of_birth?: string
  profile_image?: string
  password?: string
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => ({
        url: Endpoints.Profile,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),

    updateProfile: builder.mutation<Profile, UpdateProfileRequest>({
      query: (data) => ({
        url: Endpoints.Profile,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi
