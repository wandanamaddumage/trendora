'use client'

import { useAppSelector, useAppDispatch } from '@/store/hooks'
import signInAsync, { signOut } from '@/store/slices/auth'
import { useState, useCallback } from 'react'

interface UseAuthReturn {
  user: { id: string; userName: string } | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isAdmin, loading } = useAppSelector(state => state.auth)
  const [error, setError] = useState<string | null>(null)

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null)
        await dispatch<any>(signInAsync({ credentials: { email, password } }, false)).unwrap()
      } catch (err) {
        if (err && typeof err === 'object' && err !== null && 'message' in err) {
          setError((err as any).message || 'Login failed')
        } else {
          setError('Login failed')
        }
        throw err
      }
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(signOut())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    signIn,
    signOut: logout,
  }
}
