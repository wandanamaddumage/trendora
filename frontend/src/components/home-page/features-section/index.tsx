'use client'

import { Truck, Shield, RefreshCw, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'Free shipping on orders over $50' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure payment processing' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Star, title: 'Premium Quality', description: 'Curated products from top brands' },
]

const FeaturesSection = () => (
  <section className="py-16 bg-white dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <feature.icon className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </section>
)

export default FeaturesSection
