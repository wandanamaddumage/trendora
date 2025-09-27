'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const categories = [
  { name: 'Electronics', image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', count: '500+ Products' },
  { name: 'Clothing', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', count: '1000+ Products' },
  { name: 'Books', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', count: '300+ Products' },
  { name: 'Home', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', count: '750+ Products' },
]

const CategoriesSection = () => (
  <section className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">Explore our wide range of product categories</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div key={category.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="group cursor-pointer">
            <Link href={`/products?category=${category.name.toLowerCase()}`}>
              <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <img src={category.image} alt={category.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default CategoriesSection
