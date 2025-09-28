'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft } from 'lucide-react'

const EmptyCart: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link
          href="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <ArrowLeft size={20} className="mr-2" />
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default EmptyCart
