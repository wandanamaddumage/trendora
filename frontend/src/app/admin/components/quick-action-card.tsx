'use client'

import React from 'react'
import Link from 'next/link'

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ElementType
  link: string
  color: string
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon: Icon, link, color }) => {
  return (
    <Link
      href={link}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
    >
      <div className={`${color} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </Link>
  )
}

export default QuickActionCard
