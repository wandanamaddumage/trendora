'use client'

import { useState } from 'react'
import { Grid, List, SlidersHorizontal } from 'lucide-react'
import ProductSearch from './components/ProductSearch'
import { Button } from '@/components/ui/button'
import ProductSort from './components/ProductSort'
import ProductFilters from './components/product-filters'
import ProductGrid from './components/ProductGrid'
import { useGetProductsQuery } from '@/store/api/splits/products'

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const { data: products = [], isLoading } = useGetProductsQuery({
    searchTerm,
    category: selectedCategory,
    brand: selectedBrand,
    priceRange,
    sortBy,
    sortOrder,
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedBrand('')
    setPriceRange({ min: '', max: '' })
    setSortBy('name')
    setSortOrder('asc')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            All Products
          </h1>

          <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal size={20} />
                <span>Filters</span>
              </Button>
              <span className="text-gray-600 dark:text-gray-400">
                {products.length} products found
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <ProductSort
                sortBy={sortBy}
                sortOrder={sortOrder}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
              />

              {/* View toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  size="icon"
                >
                  <Grid size={18} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  size="icon"
                >
                  <List size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              clearFilters={clearFilters}
            />
          )}

          <ProductGrid
            products={products}
            loading={isLoading}
            viewMode={viewMode}
            clearFilters={clearFilters}
          />
        </div>
      </div>
    </div>
  )
}
