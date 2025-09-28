"use client"

import { useEffect, useState } from 'react'
import {
  Package,
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  ShoppingCart
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useProductCRUD } from '@/app/(dashboard)/hooks/useProductCRUD'
import { useCustomerCRUD } from '@/app/(dashboard)/hooks/useCustomerCRUD'
import { useUserCRUD } from '@/app/(dashboard)/hooks/useUserCRUD'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalCustomers: number
  activeCustomers: number
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  averageRating: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    averageRating: 0
  })

  const { products } = useProductCRUD()
  const { customers } = useCustomerCRUD()
  const { users } = useUserCRUD()

  useEffect(() => {
    if (!products.length && !customers.length && !users.length) return

    const activeProducts = products.filter((p: any) => p.isActive)
    const activeCustomers = customers.filter((c: any) => c.isActive)
    const activeUsers = users.filter((u: any) => u.isActive)

    const totalRevenue = products.reduce(
      (sum: number, product: any) => sum + product.sellPrice * product.quantity,
      0
    )

    const averageRating =
      products.length > 0
        ? products.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) /
          products.length
        : 0

    setStats({
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      totalCustomers: customers.length,
      activeCustomers: activeCustomers.length,
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      totalRevenue,
      averageRating
    })
  }, [products, customers, users])

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      description: `${stats.activeProducts} active`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      description: `${stats.activeCustomers} active`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      description: `${stats.activeUsers} active`,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      description: 'Estimated value',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      description: 'Product ratings',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Inventory Items',
      value: products.reduce((sum, p) => sum + p.quantity, 0).toString(),
      description: 'Total stock',
      icon: ShoppingCart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to your e-commerce admin dashboard. Here's an overview of
          your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <CardDescription className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Value</CardTitle>
            <CardDescription>
              Products with highest inventory value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .sort(
                  (a, b) =>
                    b.sellPrice * b.quantity - a.sellPrice * a.quantity
                )
                .slice(0, 5)
                .map(product => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.brand} • Qty: {product.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.sellPrice * product.quantity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(product.sellPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Latest customer registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || '').getTime() -
                    new Date(a.createdAt || '').getTime()
                )
                .slice(0, 5)
                .map(customer => (
                  <div
                    key={customer._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {customer.profileImage ? (
                          <img
                            src={customer.profileImage}
                            alt={`${customer.firstName} ${customer.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-blue-600">
                            {customer.firstName[0]}
                            {customer.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
