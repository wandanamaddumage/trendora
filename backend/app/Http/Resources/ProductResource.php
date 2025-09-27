<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand ?? '',
            'name' => $this->name ?? '',
            'image_url' => $this->image_url,
            'quantity' => $this->quantity ?? 0,
            'cost_price' => $this->cost_price ? (string) $this->cost_price : '0.00',
            'sell_price' => $this->sell_price ? (string) $this->sell_price : '0.00',
            'description' => $this->description ?? '',
            'rating' => $this->rating ?? 0,
            'is_active' => $this->is_active ?? false,
            'created_by' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator->id,
                    'name' => $this->creator->first_name . ' ' . $this->creator->last_name,
                ];
            }),
            'updated_by' => $this->whenLoaded('updater', function () {
                return [
                    'id' => $this->updater->id,
                    'name' => $this->updater->first_name . ' ' . $this->updater->last_name,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
