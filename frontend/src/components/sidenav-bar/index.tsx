'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, UserCheck, X, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onClose: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const user = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
  }

  const hasPrivilege = (privilege: string) => {
    const privileges = ['canAddProducts', 'canUpdateProducts', 'canManageCustomers', 'canManageUsers']
    return privileges.includes(privilege)
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
      show: true,
    },
    {
      icon: Package,
      label: 'Products',
      path: '/products',
      show: hasPrivilege('canAddProducts') || hasPrivilege('canUpdateProducts'),
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/customers',
      show: hasPrivilege('canManageCustomers'),
    },
    {
      icon: UserCheck,
      label: 'Users',
      path: '/users',
      show: hasPrivilege('canManageUsers'),
    },
  ]

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Store className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.filter((item) => item.show).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
