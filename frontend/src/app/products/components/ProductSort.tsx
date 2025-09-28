'use client'

interface Props {
  sortBy: string
  sortOrder: 'asc' | 'desc'
  setSortBy: (val: string) => void
  setSortOrder: (val: 'asc' | 'desc') => void
}

export default function ProductSort({ sortBy, sortOrder, setSortBy, setSortOrder }: Props) {
  return (
    <select
      value={`${sortBy}-${sortOrder}`}
      onChange={(e) => {
        const [field, order] = e.target.value.split('-')
        setSortBy(field)
        setSortOrder(order as 'asc' | 'desc')
      }}
      className="border rounded-md px-3 py-2"
    >
      <option value="name-asc">Name A-Z</option>
      <option value="name-desc">Name Z-A</option>
      <option value="sellPrice-asc">Price Low-High</option>
      <option value="sellPrice-desc">Price High-Low</option>
      <option value="rating-desc">Rating High-Low</option>
      <option value="createdAt-desc">Newest First</option>
    </select>
  )
}
