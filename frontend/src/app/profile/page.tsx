"use client"

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/api/splits/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AuthGuard from '@/components/auth/auth-guard'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  contact: z.string().optional(),
  password: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery()
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        contact: profile.contact || '',
        password: '',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileForm) => {
    try {
      const payload: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact: data.contact || undefined,
      }
      if (data.password && data.password.trim().length > 0) {
        payload.password = data.password.trim()
      }
      await updateProfile(payload).unwrap()
      toast.success('Profile updated successfully')
      reset({ ...data, password: '' })
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update profile')
    }
  }

  if (isLoading) return <div className="p-6">Loading profile...</div>

  return (
    <AuthGuard requireAuth>
      <div className="max-w-3xl mx-auto p-10">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input {...register('first_name')} placeholder="First name" />
                  {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input {...register('last_name')} placeholder="Last name" />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input {...register('email')} disabled />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Contact</label>
                  <Input {...register('contact')} placeholder="Contact" />
                </div>
              </div>

              {/* Address and Date of Birth removed per backend contract */}

              <div>
                <label className="text-sm font-medium">New Password (optional)</label>
                <Input type="password" {...register('password')} placeholder="Leave blank to keep current password" />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
