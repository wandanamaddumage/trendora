'use client'

import React from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ElementType
  color: string
  details?: string
  loading?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, details, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : value}</p>
          {details && <p className="text-xs text-gray-500 dark:text-gray-500">{details}</p>}
        </div>
      </div>
    </div>
  )
}

export default StatCard
