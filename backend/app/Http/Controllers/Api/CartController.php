<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddItemRequest;
use App\Http\Requests\Cart\UpdateItemRequest;
use App\Http\Resources\CartResource;
use App\Http\Resources\CartItemResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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
     * @OA\Get(
     *     path="/api/cart/items",
     *     tags={"Cart"},
     *     summary="Get cart items",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function items(): AnonymousResourceCollection
    {
        $cart = $this->cartService->getOrCreateCart(auth()->user());
        
        return CartItemResource::collection($cart->items);
    }

    /**
     * @OA\Post(
     *     path="/api/cart/items",
     *     tags={"Cart"},
     *     summary="Add item",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"product_id","quantity"},
     *             @OA\Property(property="product_id", type="integer", example=1),
     *             @OA\Property(property="quantity", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Created"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Insufficient permissions")
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
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"quantity"},
     *             @OA\Property(property="quantity", type="integer", example=3)
     *         )
     *     ),
     *     @OA\Response(response=200, description="OK"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Insufficient permissions")
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
