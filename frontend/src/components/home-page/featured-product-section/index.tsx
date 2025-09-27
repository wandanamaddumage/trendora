'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/product-card'

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

// Mock fetch function (replace with your API)
const fetchFeaturedProducts = async (): Promise<Product[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { _id: '1', name: 'Laptop', brand: 'Dell', sellPrice: 1200, rating: 4.5, category: 'Electronics', isActive: true, quantity: 10 },
        { _id: '2', name: 'Shirt', brand: 'Nike', sellPrice: 45, rating: 4.8, category: 'Clothing', isActive: true, quantity: 20 },
        { _id: '3', name: 'Book', brand: 'Penguin', sellPrice: 20, rating: 4.9, category: 'Books', isActive: true, quantity: 50 }
      ])
    }, 1000)
  })
}

const FeaturedProductsSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts().then(products => {
      setFeaturedProducts(products)
      setLoading(false)
    })
  }, [])

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Discover our top-rated and trending products</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
            View All Products <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSection
