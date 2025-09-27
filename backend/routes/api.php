<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\HealthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check (no auth required)
Route::get('/health', [HealthController::class, 'index']);

// Auth routes (public)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Profile routes (auth required)
Route::middleware('auth:sanctum')->prefix('profile')->group(function () {
    Route::get('/', [ProfileController::class, 'show']);
    Route::patch('/', [ProfileController::class, 'update']);
});

// Product routes
Route::prefix('products')->group(function () {
    // Public routes
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'show']);
    
    // Staff routes (auth + role + privilege)
    Route::middleware(['auth:sanctum', 'role:admin,user', 'product.privilege'])->group(function () {
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::patch('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
        Route::patch('/{id}/toggle-active', [ProductController::class, 'toggleActive']);
        Route::post('/{id}/image', [ProductController::class, 'uploadImage']);
    });
});

// Cart routes (customer auth)
Route::middleware(['auth:sanctum', 'role:customer'])->prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/items', [CartController::class, 'addItem']);
    Route::patch('/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/items/{id}', [CartController::class, 'removeItem']);
    Route::delete('/', [CartController::class, 'clear']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Customer management
    Route::prefix('customers')->group(function () {
        Route::get('/', [AdminController::class, 'customers']);
        Route::patch('/{id}/toggle-active', [AdminController::class, 'toggleCustomerActive']);
        Route::delete('/{id}', [AdminController::class, 'deleteCustomer']);
    });
    
    // User management
    Route::prefix('users')->group(function () {
        Route::get('/', [AdminController::class, 'users']);
        Route::post('/', [AdminController::class, 'createUser']);
        Route::put('/{id}', [AdminController::class, 'updateUser']);
        Route::patch('/{id}', [AdminController::class, 'updateUser']);
        Route::patch('/{id}/toggle-active', [AdminController::class, 'toggleUserActive']);
        Route::patch('/{id}/privileges', [AdminController::class, 'updatePrivileges']);
        Route::delete('/{id}', [AdminController::class, 'deleteUser']);
    });
    
    // Metrics
    Route::get('/metrics', [AdminController::class, 'metrics']);
});
