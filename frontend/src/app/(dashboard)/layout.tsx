'use client'

import Sidebar from '@/components/sidenav-bar'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
      <Sidebar role={user.role as 'admin' | 'staff'} onClose={() => {}} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
