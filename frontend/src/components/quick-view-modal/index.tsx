'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Product } from '../product-card'

interface QuickViewProps {
  product: Product
  open: boolean
  onClose: () => void
}

export default function ProductQuickViewModal({ product, open, onClose }: QuickViewProps) {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={product.imageUrl || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'}
              alt={product.name}
              className="w-full md:w-1/2 object-cover rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-xl text-gray-900 mt-2">${product.sellPrice}</p>
                <div className="flex items-center gap-2 mt-2">{renderStars(product.rating)}</div>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/products/${product._id}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
