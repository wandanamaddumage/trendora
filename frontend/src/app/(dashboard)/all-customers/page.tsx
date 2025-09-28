"use client"

import { useState } from 'react'
import {Search, Eye, EyeOff, Trash2, Users} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCustomerCRUD } from '@/app/(dashboard)/hooks/useCustomerCRUD'
import { useAuth } from '@/app/(dashboard)/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AllCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)

  const { customers, loading, fetchCustomers, updateCustomerStatus, deleteCustomer } = useCustomerCRUD()
  const { hasPrivilege } = useAuth()

  const handleSearch = () => {
    const filters = {
      search: searchTerm || undefined,
      isActive: statusFilter
    }
    fetchCustomers(filters)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter(undefined)
    fetchCustomers()
  }

  const handleToggleStatus = async (customerId: string, currentStatus: boolean) => {
    const result = await updateCustomerStatus(customerId, !currentStatus)
    if (result.success) {
      toast.success(`Customer ${currentStatus ? 'deactivated' : 'activated'} successfully`)
    } else {
      toast.error(result.error || 'Failed to update customer status')
    }
  }

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      const result = await deleteCustomer(customerId)
      if (result.success) {
        toast.success('Customer deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete customer')
      }
    }
  }

  const activeCustomers = customers.filter((c: any) => c.isActive).length
  const inactiveCustomers = customers.filter((c: any) => !c.isActive).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-2">
            Manage customer accounts and information
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <span>Active: {activeCustomers}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-red-600" />
            <span>Inactive: {inactiveCustomers}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Customers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter === undefined ? '' : statusFilter.toString()}
              onChange={(e) => setStatusFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <div className="flex space-x-2">
              <Button onClick={handleSearch} className="flex-1">Search</Button>
              <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No customers found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  {hasPrivilege('canManageCustomers') && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer: any) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      {customer.profileImage ? (
                        <img 
                          src={customer.profileImage} 
                          alt={`${customer.firstName} ${customer.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.contact}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {customer.address || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.dateOfBirth ? formatDate(customer.dateOfBirth) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {customer.lastLogin ? formatDate(customer.lastLogin) : 'Never'}
                    </TableCell>
                    <TableCell>
                      {customer.createdAt ? formatDate(customer.createdAt) : '-'}
                    </TableCell>
                    {hasPrivilege('canManageCustomers') && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(customer._id!, customer.isActive)}
                            title={customer.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {customer.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomer(customer._id!, `${customer.firstName} ${customer.lastName}`)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

