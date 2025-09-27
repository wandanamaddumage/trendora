<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'role' => $this->role,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'contact' => $this->contact,
            'is_active' => $this->is_active,
            'privileges' => $this->whenLoaded('privileges', function () {
                return [
                    'can_create_product' => $this->privileges->can_create_product,
                    'can_update_product' => $this->privileges->can_update_product,
                    'can_delete_product' => $this->privileges->can_delete_product,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
