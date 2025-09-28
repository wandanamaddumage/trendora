import { z } from 'zod'

export const productSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  name: z.string().min(1, 'Product name is required'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive'),
  costPrice: z.coerce.number().min(0, 'Cost price must be positive'),
  sellPrice: z.coerce.number().min(0, 'Sell price must be positive'),
  description: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  category: z.string().optional(),
  tags: z.string().optional()
})

export type ProductFormData = z.infer<typeof productSchema>
