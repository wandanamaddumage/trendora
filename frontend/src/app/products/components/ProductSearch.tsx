'use client'

import { Search } from 'lucide-react'

interface Props {
  searchTerm: string
  setSearchTerm: (val: string) => void
}

export default function ProductSearch({ searchTerm, setSearchTerm }: Props) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-2 mb-6"
    >
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, brands, or categories..."
          className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-gray-800"
        />
      </div>
    </form>
  )
}
