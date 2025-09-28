'use client'

import React from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { updateQuantity, removeItem } from '@/store/slices/cart'
import toast from 'react-hot-toast'

interface CartItemProps {
  id: string
  name: string
  brand: string
  price: number
  quantity: number
  image?: string
}

const CartItem: React.FC<CartItemProps> = ({ id, name, brand, price, quantity, image }) => {
  const dispatch = useAppDispatch()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeItem(id))
      toast.success('Item removed from cart')
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    }
  }

  const handleRemove = () => {
    dispatch(removeItem(id))
    toast.success(`${name} removed from cart`)
  }

  return (
    <div className="px-6 py-4 flex items-center space-x-4">
      <img
        src={image || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'}
        alt={name}
        className="w-16 h-16 object-cover rounded-lg"
      />

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{brand}</p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          ${(price * quantity).toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}

export default CartItem
