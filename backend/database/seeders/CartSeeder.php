<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $products = Product::where('is_active', true)->get();

        // Create carts for some customers
        foreach ($customers->take(5) as $customer) {
            $cart = Cart::create([
                'customer_id' => $customer->id,
            ]);

            // Add 2-5 random products to each cart
            $cartProducts = $products->random(fake()->numberBetween(2, 5));
            
            foreach ($cartProducts as $product) {
                $quantity = fake()->numberBetween(1, 3);
                $unitPrice = $product->sell_price;
                $lineTotal = $quantity * $unitPrice;

                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price_snapshot' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);
            }
        }

        // Create one demo cart with specific products for testing
        $demoCustomer = User::where('email', 'alice.customer@example.com')->first();
        if ($demoCustomer) {
            $demoCart = Cart::create([
                'customer_id' => $demoCustomer->id,
            ]);

            // Add some specific products to demo cart
            $demoProducts = $products->take(3);
            foreach ($demoProducts as $product) {
                $quantity = fake()->numberBetween(1, 2);
                $unitPrice = $product->sell_price;
                $lineTotal = $quantity * $unitPrice;

                CartItem::create([
                    'cart_id' => $demoCart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price_snapshot' => $unitPrice,
                    'line_total' => $lineTotal,
                ]);
            }
        }
    }
}
