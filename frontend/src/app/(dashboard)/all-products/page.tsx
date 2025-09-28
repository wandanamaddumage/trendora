"use client"

import { useState } from 'react'
import {Plus, Search, Filter, Edit, Trash2, Eye, EyeOff} from 'lucide-react'
import { useProductCRUD } from '@/app/(dashboard)/hooks/useProductCRUD'
import { useAuth } from '@/app/(dashboard)/hooks/useAuth'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ProductForm from './components/ProductForm'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Product {
  _id?: string
  brand: string
  name: string
  imageUrl?: string
  quantity: number
  costPrice: number
  sellPrice: number
  description?: string
  rating?: number
  isActive: boolean
  category?: string
  tags?: string[]
  createdAt?: string
}

export default function Products() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined)

  const { products, loading, fetchProducts, deleteProduct, updateProduct } = useProductCRUD()
  const { hasPrivilege } = useAuth()

  const handleSearch = () => {
    const filters = {
      search: searchTerm || undefined,
      brand: brandFilter || undefined,
      category: categoryFilter || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      isActive: activeFilter
    }
    fetchProducts(filters)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setBrandFilter('')
    setCategoryFilter('')
    setMinPrice('')
    setMaxPrice('')
    setActiveFilter(undefined)
    fetchProducts()
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const result = await deleteProduct(product._id!)
      if (result.success) {
        toast.success('Product deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete product')
      }
    }
  }

  const handleToggleStatus = async (product: Product) => {
    const result = await updateProduct(product._id!, { isActive: !product.isActive })
    if (result.success) {
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'} successfully`)
    } else {
      toast.error(result.error || 'Failed to update product status')
    }
  }

  const handleFormSuccess = () => {
    fetchProducts()
  }

  // Get unique brands and categories for filter dropdowns
  const uniqueBrands: string[] = [...new Set(products.map((p: any) => p.brand))].filter(Boolean) as string[]
  const uniqueCategories: string[] = [...new Set(products.map((p: any) => p.category))].filter(Boolean) as string[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory and pricing
          </p>
        </div>
        
        {hasPrivilege('canAddProducts') && (
          <Button onClick={handleAddProduct} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search & Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Brands</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={activeFilter === undefined ? '' : activeFilter.toString()}
              onChange={(e) => setActiveFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Min Price"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No products found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCurrency(product.sellPrice)}</p>
                        <p className="text-sm text-gray-500">Cost: {formatCurrency(product.costPrice)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {product.rating ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ {product.rating}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.createdAt ? formatDate(product.createdAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {hasPrivilege('canUpdateProducts') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {hasPrivilege('canUpdateProducts') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(product)}
                          >
                            {product.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {hasPrivilege('canDeleteProducts') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <ProductForm
        open={showForm}
        onClose={() => setShowForm(false)}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
