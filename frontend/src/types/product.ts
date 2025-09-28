export interface Product {
  id: number
  name: string
  brand: string
  price: number
  image_url?: string
  category: string
  is_active: boolean
  stock_quantity: number
  description: string
  created_at: string
  updated_at: string
}