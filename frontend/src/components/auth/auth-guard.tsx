'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useGetMeQuery } from '@/store/api/splits/auth'
import { setCredentials, signOut } from '@/store/slices/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  requireStaff?: boolean
  requireCustomer?: boolean
}

export default function AuthGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireStaff = false,
  requireCustomer = false,
}: AuthGuardProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, token } = useAppSelector(state => state.auth)
  
  const { data: userData, error, isLoading } = useGetMeQuery(undefined, {
    skip: !token || isAuthenticated,
  })

  useEffect(() => {
    if (token && userData && !isAuthenticated) {
      dispatch(setCredentials({ user: userData, token }))
    }
  }, [token, userData, isAuthenticated, dispatch])

  useEffect(() => {
    if (error) {
      dispatch(signOut())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (isLoading) return

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push('/sign-in')
      return
    }

    // Check role requirements
    if (isAuthenticated && user) {
      if (requireAdmin && user.role !== 'admin') {
        router.push('/')
        return
      }
      
      if (requireStaff && !['admin', 'user'].includes(user.role)) {
        router.push('/')
        return
      }
      
      if (requireCustomer && user.role !== 'customer') {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, user, requireAuth, requireAdmin, requireStaff, requireCustomer, router, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
