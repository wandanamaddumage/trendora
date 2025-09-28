'use client'

import { Star, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { addItem } from '@/store/slices/cart/index'
import ProductQuickViewModal from '../quick-view-modal'

export interface Product {
  _id: string
  name: string
  brand: string
  sellPrice: number
  imageUrl?: string
  rating: number
  category: string
  isActive: boolean
  quantity: number
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch()
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.isActive || product.quantity === 0) {
      toast.error('Product is out of stock')
      return
    }

    dispatch(
      addItem({
        id: product._id,
        name: product.name,
        price: product.sellPrice,
        brand: product.brand,
        image: product.imageUrl,
      })
    )

    toast.success('Added to cart!')
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ))

  return (
    <>
      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border-5 border-blue-900 shadow-2xl rounded-3xl max-w-sm overflow-hidden transition hover:shadow-lg">
        {/* Product Image */}
        <div className="relative group">
          <img
            src={product.imageUrl || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'}
            alt={product.name}
            className="w-full h-56 object-cover p-4 rounded-t-lg"
          />

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition bg-black/20">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setQuickViewOpen(true)
              }}
              size="sm"
              variant="secondary"
              className="rounded-lg flex items-center gap-1"
            >
              <Eye size={16} /> Quick View
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={!product.isActive || product.quantity === 0}
              size="sm"
              className="rounded-lg flex items-center gap-1"
            >
              <ShoppingCart size={16} /> Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-5 pb-5">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
            {product.brand}
          </span>
          <h3 className="text-gray-900 dark:text-white font-semibold text-lg tracking-tight mt-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mt-2.5 mb-4">
            {renderStars(product.rating)}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-2 dark:bg-blue-200 dark:text-blue-800">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.sellPrice}
            </span>
            <Button
              onClick={handleAddToCart}
              disabled={!product.isActive || product.quantity === 0}
              size="sm"
              className="rounded-lg"
            >
              <ShoppingCart size={18} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  )
}

export default ProductCard
