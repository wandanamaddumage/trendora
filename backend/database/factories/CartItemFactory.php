<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CartItem>
 */
class CartItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 5);
        $unitPrice = fake()->randomFloat(2, 10, 100);
        $lineTotal = $quantity * $unitPrice;

        return [
            'cart_id' => Cart::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price_snapshot' => $unitPrice,
            'line_total' => $lineTotal,
        ];
    }

    /**
     * Create a cart item for specific cart and product.
     */
    public function forCartAndProduct(Cart $cart, Product $product): static
    {
        $quantity = fake()->numberBetween(1, 5);
        $unitPrice = $product->sell_price;
        $lineTotal = $quantity * $unitPrice;

        return $this->state(fn (array $attributes) => [
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price_snapshot' => $unitPrice,
            'line_total' => $lineTotal,
        ]);
    }
}
