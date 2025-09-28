'use client'

import { Star, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAddCartItemMutation } from '@/store/api/splits/cart'
import { useAppSelector } from '@/store/hooks'
import ProductQuickViewModal from '../quick-view-modal'

import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [addToCart, { isLoading }] = useAddCartItemMutation()
  const { isAuthenticated, user } = useAppSelector(state => state.auth)

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated || user?.role !== 'customer') {
      toast.error('Please sign in as a customer to add items to cart')
      return
    }

    if (!product.is_active || product.stock_quantity === 0) {
      toast.error('Product is out of stock')
      return
    }

    try {
      await addToCart({
        product_id: product.id,
        quantity: 1,
      }).unwrap()
      toast.success('Added to cart!')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add to cart')
    }
  }

  const renderStars = (rating: number = 4.5) =>
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
            src={product.image_url || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'}
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
              disabled={!product.is_active || product.stock_quantity === 0 || isLoading}
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
            {renderStars(4.5)}
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-2 dark:bg-blue-200 dark:text-blue-800">
              4.5
            </span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            <Button
              onClick={handleAddToCart}
              disabled={!product.is_active || product.stock_quantity === 0 || isLoading}
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
