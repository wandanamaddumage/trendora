'use client'

import Sidebar from '@/components/sidenav-bar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AuthGuard from '@/components/auth/auth-guard'

const user = {
  firstName: 'John',
  lastName: 'Doe',
  role: 'staff', 
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (user.role === 'staff' && pathname.startsWith('/users')) {
      router.replace('/dashboard')
    }
  }, [pathname, router])

  return (
    <div className="flex h-screen">
      <Sidebar onClose={() => {}} />
      <AuthGuard requireAuth requireStaff>
        <main className="flex-1 overflow-y-auto p-10">{children}</main>
      </AuthGuard>
    </div>
  )
}
