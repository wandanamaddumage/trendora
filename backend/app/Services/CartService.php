<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

class CartService
{
    public function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['customer_id' => $user->id]);
    }

    public function addItem(Cart $cart, Product $product, int $quantity): CartItem
    {
        $existingItem = $cart->items()->where('product_id', $product->id)->first();
        
        if ($existingItem) {
            $existingItem->quantity += $quantity;
            $existingItem->calculateLineTotal();
            $existingItem->save();
            
            return $existingItem;
        }
        
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'unit_price_snapshot' => $product->sell_price,
        ]);
        
        $cartItem->calculateLineTotal();
        $cartItem->save();
        
        return $cartItem;
    }

    public function updateItem(CartItem $cartItem, int $quantity): CartItem
    {
        $cartItem->quantity = $quantity;
        $cartItem->calculateLineTotal();
        $cartItem->save();
        
        return $cartItem;
    }

    public function removeItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }
}
