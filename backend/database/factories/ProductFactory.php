<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Sony', 'Canon', 'Dell', 'HP', 'Lenovo', 'Microsoft'];
        $costPrice = fake()->randomFloat(2, 10, 500);
        $sellPrice = $costPrice + fake()->randomFloat(2, 5, 100); // Ensure sell price > cost price

        return [
            'brand' => fake()->randomElement($brands),
            'name' => fake()->words(3, true),
            'image_path' => null, // Will be set in seeder if needed
            'quantity' => fake()->numberBetween(0, 100),
            'cost_price' => $costPrice,
            'sell_price' => $sellPrice,
            'description' => fake()->optional(0.8)->paragraph(),
            'rating' => fake()->numberBetween(1, 5),
            'is_active' => fake()->boolean(85), // 85% chance of being active
            'created_by' => User::factory(),
            'updated_by' => null,
        ];
    }

    /**
     * Create an active product.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Create an inactive product.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a product with specific brand.
     */
    public function brand(string $brand): static
    {
        return $this->state(fn (array $attributes) => [
            'brand' => $brand,
        ]);
    }

    /**
     * Create a product with high rating.
     */
    public function highRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(4, 5),
        ]);
    }

    /**
     * Create a product with low rating.
     */
    public function lowRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->numberBetween(1, 2),
        ]);
    }
}
