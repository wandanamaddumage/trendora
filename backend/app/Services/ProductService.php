<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function getFilteredProducts(array $filters)
    {
        $query = Product::query();

        // Apply filters
        if (isset($filters['brand'])) {
            $query->byBrand($filters['brand']);
        }

        if (isset($filters['q'])) {
            $query->search($filters['q']);
        }

        if (isset($filters['min_price']) && isset($filters['max_price'])) {
            $query->byPriceRange($filters['min_price'], $filters['max_price']);
        }

        if (isset($filters['min_rating'])) {
            $query->byRating($filters['min_rating']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Apply sorting
        $sortBy = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        return $query->get();
    }

    public function createProduct(array $data): Product
    {
        $data['created_by'] = auth()->id();
        
        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data): Product
    {
        $data['updated_by'] = auth()->id();
        
        $product->update($data);
        
        return $product->fresh();
    }

    public function deleteProduct(Product $product): void
    {
        // Delete associated image if exists
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        
        $product->delete();
    }

    public function toggleActive(Product $product): Product
    {
        $product->update(['is_active' => !$product->is_active]);
        
        return $product->fresh();
    }

    public function uploadImage(Product $product, UploadedFile $image): string
    {
        // Delete old image if exists
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        // Store new image
        $path = $image->store("products/{$product->id}", 'public');
        
        $product->update(['image_path' => $path]);
        
        return Storage::url($path);
    }
}
