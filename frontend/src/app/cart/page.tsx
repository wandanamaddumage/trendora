'use client'

import React from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useClearCartMutation, useGetCartItemsQuery, useRemoveItemMutation, useUpdateItemMutation } from '@/store/api/splits/cart'


const CartPage: React.FC = () => {
  const { data: items = [], isLoading } = useGetCartItemsQuery()
  const [updateItem] = useUpdateItemMutation()
  const [removeItem] = useRemoveItemMutation()
  const [clearCart] = useClearCartMutation()

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        await removeItem(id).unwrap()
        toast.success('Item removed from cart')
      } else {
        await updateItem({ id, quantity: newQuantity }).unwrap()
      }
    } catch (err) {
      toast.error('Failed to update cart')
    }
  }

  const handleRemove = async (id: string, name: string) => {
    try {
      await removeItem(id).unwrap()
      toast.success(`${name} removed from cart`)
    } catch (err) {
      toast.error('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart().unwrap()
        toast.success('Cart cleared')
      } catch (err) {
        toast.error('Failed to clear cart')
      }
    }
  }

  if (isLoading) return <p className="p-6 text-center">Loading cart...</p>

  if (items.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cart Items</h2>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center space-x-4">
                <img
                  src={item.image || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.brand}</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

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
        </div>
      </div>
    </div>
  )
}

export default CartPage
