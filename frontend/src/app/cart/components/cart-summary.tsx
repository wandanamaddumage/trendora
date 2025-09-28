'use client'

import React from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/store/hooks'
import { getTotalPrice, getTotalItems } from '@/store/slices/cart'

const CartSummary: React.FC = () => {
  const totalPrice = useAppSelector(getTotalPrice)
  const totalItems = useAppSelector(getTotalItems)

  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-medium text-gray-900 dark:text-white">Subtotal:</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Shipping and taxes calculated at checkout
      </p>

      <div className="flex space-x-3">
        <Link
          href="/products"
          className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-center font-medium"
        >
          Continue Shopping
        </Link>
        <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default CartSummary
