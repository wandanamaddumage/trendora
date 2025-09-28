'use client'

import React from 'react'
import Link from 'next/link'

interface RecentProductsProps {
  products?: { id: string; name: string; status: string }[]
}

const RecentProducts: React.FC<RecentProductsProps> = ({ products }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Products</h3>
        <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {(products || []).map((product, index) => (
          <div
            key={product.id || index}
            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Added recently</p>
            </div>
            <span className={`text-sm font-medium ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              {product.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentProducts
