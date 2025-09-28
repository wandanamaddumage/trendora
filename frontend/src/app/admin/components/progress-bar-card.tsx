'use client'

import React from 'react'

interface ProgressBarProps {
  label: string
  value: number
  color: string
}

const ProgressBarCard: React.FC<ProgressBarProps> = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-gray-900 dark:text-white">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

export default ProgressBarCard
