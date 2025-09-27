'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addItem } from '@/store/slices/cart/index'

interface Product {
  _id: string
  name: string
  brand: string
  sellPrice: number
  imageUrl?: string
  rating: number
  category: string
  description?: string
  quantity: number
}

export default function ProductPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState<Product | null>(null)

  // Simulate fetching product from API
  useEffect(() => {
    async function fetchProduct() {
      // Replace with your actual API call
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data)
    }

    fetchProduct()
  }, [id])

  if (!product) return <div className="p-4">Loading...</div>

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={20} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} />
    ))

  const handleAddToCart = () => {
    if (product.quantity === 0) {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.imageUrl || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'}
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2 text-sm">{product.brand}</p>

            <div className="flex items-center gap-2 mt-2">
              {renderStars(product.rating)}
              <span className="text-gray-600 text-sm">({product.rating})</span>
            </div>

            <p className="text-2xl text-gray-900 mt-4">${product.sellPrice}</p>
            {product.description && <p className="mt-4 text-gray-700">{product.description}</p>}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="bg-blue-600 text-white hover:bg-blue-700 flex-1"
              >
                {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button variant="destructive" className="flex-1">
                <Heart size={20} />
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              {product.quantity === 0
                ? 'Currently out of stock'
                : product.quantity <= 10
                ? `Only ${product.quantity} left in stock!`
                : 'In Stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
