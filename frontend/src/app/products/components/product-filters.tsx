'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  selectedCategory: string
  setSelectedCategory: (val: string) => void
  selectedBrand: string
  setSelectedBrand: (val: string) => void
  priceRange: { min: string; max: string }
  setPriceRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>
  clearFilters: () => void
}

const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys']
const brands = ['Apple', 'Samsung', 'Nike', 'Scribner', 'Amazon']

export default function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  clearFilters
}: Props) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <Button variant="link" onClick={clearFilters} className="p-0 h-auto text-blue-600">
          Clear All
        </Button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={selectedCategory === cat}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-2"
              />
              <span className="capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Brand</h4>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>
    </div>
  )
}
