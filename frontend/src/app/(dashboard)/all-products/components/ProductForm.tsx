"use client"

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { productSchema } from './schema'
import { z } from 'zod'
import { useProductCRUD } from '../hooks/useProductCRUD'
import InputText from '@/components/input-fields/input-text'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Product {
  _id?: string
  brand: string
  name: string
  imageUrl?: string
  quantity: number
  costPrice: number
  sellPrice: number
  description?: string
  rating?: number
  isActive: boolean
  category?: string
  tags?: string[]
}

interface ProductFormProps {
  open: boolean
  onClose: () => void
  product?: Product | null
  onSuccess: () => void
}

export default function ProductForm({ open, onClose, product, onSuccess }: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const { createProduct, updateProduct, uploadProductImage } = useProductCRUD()

  const methods = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema) as any,
  })

  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods

  useEffect(() => {
    if (product) {
      setValue('brand', product.brand)
      setValue('name', product.name)
      setValue('quantity', product.quantity)
      setValue('costPrice', product.costPrice)
      setValue('sellPrice', product.sellPrice)
      setValue('description', product.description || '')
      setValue('rating', product.rating || 0)
      setValue('category', product.category || '')
      setValue('tags', product.tags?.join(', ') || '')
      setImagePreview(product.imageUrl || '')
    } else {
      reset()
      setImagePreview('')
      setImageFile(null)
    }
  }, [product, setValue, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      // Step 1: Create or update base product fields
      const basePayload = {
        ...data,
        isActive: product?.isActive ?? true,
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
      }

      let workingId = product?._id
      let op = null as any
      if (product?._id) {
        op = await updateProduct(product._id, basePayload)
        if (!op.success) {
          toast.error(op.error || 'Failed to update product')
          return
        }
        workingId = product._id
      } else {
        op = await createProduct(basePayload)
        if (!op.success) {
          toast.error(op.error || 'Failed to create product')
          return
        }
        workingId = op.data?._id
      }

      // Step 2: If an image is selected, upload it and update the product with returned URL
      if (imageFile && workingId) {
        setUploading(true)
        const uploadResult = await uploadProductImage(imageFile, workingId)
        setUploading(false)
        if (uploadResult.success && uploadResult.url) {
          await updateProduct(workingId, { imageUrl: uploadResult.url })
        } else if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload image')
          return
        }
      }

      toast.success(product ? 'Product updated successfully' : 'Product created successfully')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-500">Upload an image</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inputs using InputText */}
            <div className="grid grid-cols-2 gap-4">
              <InputText label="Brand *" name="brand" placeholder="Enter brand name" />
              <InputText label="Product Name *" name="name" placeholder="Enter product name" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <InputText label="Quantity *" name="quantity" type="number" placeholder="0" />
              <InputText label="Cost Price *" name="costPrice" type="number" step="0.01" placeholder="0.00" />
              <InputText label="Sell Price *" name="sellPrice" type="number" step="0.01" placeholder="0.00" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputText label="Category" name="category" placeholder="Enter category" />
              <InputText label="Rating (1-5)" name="rating" type="number" min={1} max={5} step={0.1} placeholder="4.5" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...methods.register('description')}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                placeholder="Enter product description"
              />
            </div>

            <InputText label="Tags (comma-separated)" name="tags" placeholder="tag1, tag2, tag3" />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || uploading}>
                {uploading ? 'Uploading...' : isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
