"use client"

import { useState } from 'react'
import {Search, Eye, EyeOff, Trash2, Users} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useUserCRUD } from '@/app/(dashboard)/hooks/useUserCRUD'
import { 
  useToggleUserActiveMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdatePrivilegesMutation,
} from '@/store/api/splits/user'
import { useAuth } from '@/app/(dashboard)/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const [roleFilter, setRoleFilter] = useState<'admin' | 'user' | 'customer' | ''>('')

  const { users, loading, fetchUsers } = useUserCRUD()
  const { hasPrivilege } = useAuth()
  const [toggleUserActive] = useToggleUserActiveMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [updatePrivileges] = useUpdatePrivilegesMutation()

  const handleSearch = () => {
    const filters = {
      search: searchTerm || undefined,
      isActive: statusFilter,
      role: roleFilter || undefined,
    }
    fetchUsers(filters)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter(undefined)
    setRoleFilter('')
    fetchUsers()
  }

  const activeUsers = users.filter((u: any) => u.isActive).length
  const inactiveUsers = users.filter((u: any) => !u.isActive).length

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await toggleUserActive(Number(id)).unwrap()
      toast.success(`User ${current ? 'deactivated' : 'activated'} successfully`)
      fetchUsers()
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to toggle user')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user ${name}?`)) return
    try {
      await deleteUser(Number(id)).unwrap()
      toast.success('User deleted')
      fetchUsers()
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to delete user')
    }
  }

  const handleRoleChange = async (id: string, role: 'admin' | 'user' | 'customer') => {
    try {
      await updateUser({ id: Number(id), role }).unwrap()
      toast.success('Role updated')
      fetchUsers({ role: roleFilter || undefined, isActive: statusFilter })
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update role')
    }
  }

  const handlePrivilegeToggle = async (
    id: string,
    key: 'can_create_product' | 'can_update_product' | 'can_delete_product',
    value: boolean
  ) => {
    try {
      await updatePrivileges({ id: Number(id), data: { [key]: value } }).unwrap()
      toast.success('Privileges updated')
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update privileges')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">
            Manage admin and staff accounts and information
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <span>Active: {activeUsers}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-red-600" />
            <span>Inactive: {inactiveUsers}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Users</span>
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

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">Staff</option>
              <option value="customer">Customer</option>
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
          <CardTitle>User List ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No customers found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  {hasPrivilege('canManageUsers') && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.contact || '-'}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? formatDate(user.createdAt) : '-'}
                    </TableCell>
                    {hasPrivilege('canManageUsers') && (
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value as any)}
                              className="flex h-8 rounded-md border border-input bg-background px-2 text-sm"
                            >
                              <option value="admin">Admin</option>
                              <option value="user">Staff</option>
                              <option value="customer">Customer</option>
                            </select>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleActive(user._id, user.isActive)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                            >
                              Delete
                            </Button>
                          </div>

                          {/* Privileges */}
                          <div className="flex items-center gap-3 text-xs">
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={Boolean(user.can_create_product)}
                                onChange={(e) => handlePrivilegeToggle(user._id, 'can_create_product', e.target.checked)}
                              />
                              canCreateProducts
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={Boolean(user.can_update_product)}
                                onChange={(e) => handlePrivilegeToggle(user._id, 'can_update_product', e.target.checked)}
                              />
                              canUpdateProducts
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={Boolean(user.can_delete_product)}
                                onChange={(e) => handlePrivilegeToggle(user._id, 'can_delete_product', e.target.checked)}
                              />
                              canDeleteProducts
                            </label>
                          </div>
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
