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