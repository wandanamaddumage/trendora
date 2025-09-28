'use client'

import React from 'react'
import { Package, Users, ShoppingCart, TrendingUp, Plus, Settings, BarChart3 } from 'lucide-react'
import RecentProducts from './components/recent-products'
import ProgressBarCard from './components/progress-bar-card'
import QuickActionCard from './components/quick-action-card'
import StatCard from './components/stat-card'
import { useGetProductsQuery } from '@/store/api/splits/products'
import { useGetCustomersQuery, useGetUsersQuery, useGetAdminMetricsQuery } from '@/store/api/splits/user'
import AuthGuard from '@/components/auth/auth-guard'

const AdminDashboardPage: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({})
  const { data: customersData, isLoading: customersLoading } = useGetCustomersQuery({})
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({})
  const { data: metrics, isLoading: metricsLoading } = useGetAdminMetricsQuery()

  const statsLoading = productsLoading || customersLoading || usersLoading || metricsLoading
  const products = productsData?.data || []
  const customers = customersData?.data || []
  const users = usersData?.data || []
  
  const totalProducts = metrics?.total_products || 0
  const totalCustomers = metrics?.total_customers || 0
  const totalUsers = metrics?.total_users || 0
  const totalAdmins = metrics?.total_admins || 0
  const activeProducts = metrics?.total_active_products || 0
  const inactiveProducts = totalProducts - activeProducts
  const activeCustomers = customers?.filter((c) => c.is_active)?.length || 0
  const inactiveCustomers = totalCustomers - activeCustomers

  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      details: `${activeProducts} active, ${inactiveProducts} inactive`,
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-green-500',
      details: `${activeCustomers} active, ${inactiveCustomers} inactive`,
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      details: `${totalAdmins} admins, ${totalUsers - totalAdmins} staff`,
    },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: TrendingUp,
      color: 'bg-orange-500',
      details: 'This month',
    },
  ]

  const quickActions = [
    { title: 'Add Product', description: 'Add a new product', icon: Plus, link: '/admin/products/add', color: 'bg-blue-600' },
    { title: 'Manage Products', description: 'View/edit products', icon: Package, link: '/admin/products', color: 'bg-green-600' },
    { title: 'Manage Customers', description: 'Manage customers', icon: Users, link: '/admin/customers', color: 'bg-purple-600' },
    { title: 'Manage Users', description: 'Manage users', icon: Settings, link: '/admin/users', color: 'bg-orange-600' },
  ]

  const progressStats = [
    { label: 'Sales', value: 75, color: 'bg-blue-600' },
    { label: 'Traffic', value: 60, color: 'bg-green-600' },
    { label: 'Conversion', value: 45, color: 'bg-purple-600' },
  ]

  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your store.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => <StatCard key={idx} {...card} loading={statsLoading} />)}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, idx) => <QuickActionCard key={idx} {...action} />)}
            </div>
          </div>

          {/* Recent & Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentProducts products={products.map(p => ({ id: p.id.toString(), name: p.name, status: p.is_active ? 'active' : 'inactive' }))} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h3>
                <BarChart3 className="text-gray-400" size={20} />
              </div>
              {progressStats.map(stat => <ProgressBarCard key={stat.label} {...stat} />)}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default AdminDashboardPage
