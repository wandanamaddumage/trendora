<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\UpdatePrivilegesRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserPrivilege;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/admin/customers",
     *     tags={"Admin"},
     *     summary="List customers",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="search", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="is_active", in="query", required=false, @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Insufficient permissions")
     * )
     */
    public function customers(Request $request): AnonymousResourceCollection
    {
        $query = User::where('role', 'customer');

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->get('is_active'));
        }

        $customers = $query->paginate($request->get('per_page', 15));

        return UserResource::collection($customers);
    }

    /**
     * @OA\Patch(
     *     path="/api/admin/customers/{id}/toggle-active",
     *     tags={"Admin"},
     *     summary="Toggle customer active",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function toggleCustomerActive(User $customer): UserResource
    {
        $customer->update(['is_active' => !$customer->is_active]);
        
        return new UserResource($customer->fresh());
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/customers/{id}",
     *     tags={"Admin"},
     *     summary="Delete customer",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function deleteCustomer(User $customer): JsonResponse
    {
        $customer->delete();
        
        return response()->json(['message' => 'Customer deleted successfully']);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/users",
     *     tags={"Admin"},
     *     summary="List users",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function users(Request $request): AnonymousResourceCollection
    {
        $query = User::query();

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if ($request->has('role')) {
            $query->where('role', $request->get('role'));
        }

        // Apply active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->get('is_active'));
        }

        $users = $query->paginate($request->get('per_page', 15));

        return UserResource::collection($users);
    }

    /**
     * @OA\Post(
     *     path="/api/admin/users",
     *     tags={"Admin"},
     *     summary="Create user",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"role","first_name","last_name","email","password"},
     *             @OA\Property(property="role", type="string", enum={"admin","user","customer"}),
     *             @OA\Property(property="first_name", type="string"),
     *             @OA\Property(property="last_name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="contact", type="string"),
     *             @OA\Property(property="password", type="string", format="password"),
     *             @OA\Property(property="is_active", type="boolean"),
     *             @OA\Property(property="can_create_product", type="boolean"),
     *             @OA\Property(property="can_update_product", type="boolean"),
     *             @OA\Property(property="can_delete_product", type="boolean")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Created"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Insufficient permissions")
     * )
     */
    public function createUser(CreateUserRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        // Create privileges for staff users
        if ($user->role === 'user') {
            UserPrivilege::create([
                'user_id' => $user->id,
                'can_create_product' => $request->get('can_create_product', false),
                'can_update_product' => $request->get('can_update_product', false),
                'can_delete_product' => $request->get('can_delete_product', false),
            ]);
        }

        return response()->json(new UserResource($user), 201);
    }

    /**
     * @OA\Patch(
     *     path="/api/admin/users/{id}",
     *     tags={"Admin"},
     *     summary="Update user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function updateUser(UpdateUserRequest $request, User $user): UserResource
    {
        $user->update($request->validated());
        
        return new UserResource($user->fresh());
    }

    /**
     * @OA\Patch(
     *     path="/api/admin/users/{id}/toggle-active",
     *     tags={"Admin"},
     *     summary="Toggle user active",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function toggleUserActive(User $user): UserResource
    {
        $user->update(['is_active' => !$user->is_active]);
        
        return new UserResource($user->fresh());
    }

    /**
     * @OA\Patch(
     *     path="/api/admin/users/{id}/privileges",
     *     tags={"Admin"},
     *     summary="Update privileges",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function updatePrivileges(UpdatePrivilegesRequest $request, User $user): JsonResponse
    {
        if ($user->role !== 'user') {
            return response()->json(['message' => 'Only staff users can have privileges'], 400);
        }

        $privileges = $user->privileges;
        if (!$privileges) {
            $privileges = UserPrivilege::create(['user_id' => $user->id]);
        }

        $privileges->update($request->validated());

        return response()->json(['message' => 'Privileges updated successfully']);
    }

    /**
     * @OA\Delete(
     *     path="/api/admin/users/{id}",
     *     tags={"Admin"},
     *     summary="Delete user",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function deleteUser(User $user): JsonResponse
    {
        $user->delete();
        
        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * @OA\Get(
     *     path="/api/admin/metrics",
     *     tags={"Admin"},
     *     summary="Admin metrics",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function metrics(): JsonResponse
    {
        $metrics = [
            'total_products' => \App\Models\Product::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_active_products' => \App\Models\Product::where('is_active', true)->count(),
            'total_users' => User::where('role', 'user')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
        ];

        return response()->json($metrics);
    }
}
