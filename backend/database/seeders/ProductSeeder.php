<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $staffUsers = User::where('role', 'user')->get();
        $admin = User::where('role', 'admin')->first();

        // Create products with specific brands and characteristics
        $brands = [
            'Nike' => ['Air Max', 'Jordan', 'Dunk', 'React'],
            'Adidas' => ['Ultraboost', 'Stan Smith', 'NMD', 'Yeezy'],
            'Apple' => ['iPhone', 'MacBook', 'iPad', 'AirPods'],
            'Samsung' => ['Galaxy', 'Note', 'Watch', 'Buds'],
            'Sony' => ['PlayStation', 'WH-1000XM4', 'Alpha', 'Bravia'],
            'Canon' => ['EOS', 'PowerShot', 'EF', 'RF'],
            'Dell' => ['XPS', 'Inspiron', 'Alienware', 'Precision'],
            'HP' => ['Pavilion', 'EliteBook', 'Spectre', 'Envy'],
            'Lenovo' => ['ThinkPad', 'IdeaPad', 'Yoga', 'Legion'],
            'Microsoft' => ['Surface', 'Xbox', 'Office', 'Teams'],
        ];

        foreach ($brands as $brand => $productLines) {
            foreach ($productLines as $productLine) {
                // Create 2-3 products per product line
                for ($i = 1; $i <= fake()->numberBetween(2, 3); $i++) {
                    $costPrice = fake()->randomFloat(2, 50, 1000);
                    $sellPrice = $costPrice + fake()->randomFloat(2, 10, 200);

                    Product::create([
                        'brand' => $brand,
                        'name' => $productLine . ' ' . $i,
                        'quantity' => fake()->numberBetween(0, 50),
                        'cost_price' => $costPrice,
                        'sell_price' => $sellPrice,
                        'description' => fake()->optional(0.8)->paragraph(),
                        'rating' => fake()->numberBetween(1, 5),
                        'is_active' => fake()->boolean(85),
                        'created_by' => $staffUsers->random()->id,
                        'updated_by' => fake()->optional(0.3)->randomElement($staffUsers)?->id,
                    ]);
                }
            }
        }

        // Create some additional random products
        Product::factory()
            ->count(20)
            ->create([
                'created_by' => $staffUsers->random()->id,
            ]);
    }
}
