<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddItemRequest;
use App\Http\Requests\Cart\UpdateItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    public function __construct(
        private CartService $cartService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/cart",
     *     tags={"Cart"},
     *     summary="Get cart",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function index(): CartResource
    {
        $cart = $this->cartService->getOrCreateCart(auth()->user());
        
        return new CartResource($cart);
    }

    /**
     * @OA\Post(
     *     path="/api/cart/items",
     *     tags={"Cart"},
     *     summary="Add item",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Created")
     * )
     */
    public function addItem(AddItemRequest $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart(auth()->user());
        $product = Product::findOrFail($request->product_id);
        
        $this->cartService->addItem($cart, $product, $request->quantity);
        
        return response()->json([
            'message' => 'Item added to cart successfully',
        ], 201);
    }

    /**
     * @OA\Patch(
     *     path="/api/cart/items/{id}",
     *     tags={"Cart"},
     *     summary="Update item",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function updateItem(UpdateItemRequest $request, CartItem $cartItem): JsonResponse
    {
        $this->cartService->updateItem($cartItem, $request->quantity);
        
        return response()->json([
            'message' => 'Cart item updated successfully',
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/cart/items/{id}",
     *     tags={"Cart"},
     *     summary="Remove item",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function removeItem(CartItem $cartItem): JsonResponse
    {
        $this->cartService->removeItem($cartItem);
        
        return response()->json([
            'message' => 'Item removed from cart successfully',
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/cart",
     *     tags={"Cart"},
     *     summary="Clear cart",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function clear(): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart(auth()->user());
        $this->cartService->clearCart($cart);
        
        return response()->json([
            'message' => 'Cart cleared successfully',
        ]);
    }
}
