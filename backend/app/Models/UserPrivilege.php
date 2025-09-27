<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPrivilege extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'can_create_product',
        'can_update_product',
        'can_delete_product',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'can_create_product' => 'boolean',
            'can_update_product' => 'boolean',
            'can_delete_product' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the privilege.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
