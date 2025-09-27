<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductPrivilegeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Admin has all privileges
        if ($user->role === 'admin') {
            return $next($request);
        }

        // Check if user has privileges
        $privileges = $user->privileges;
        if (!$privileges) {
            return response()->json(['message' => 'No product privileges assigned'], 403);
        }

        // Check specific privileges based on HTTP method
        $method = $request->method();
        switch ($method) {
            case 'POST':
                if (!$privileges->can_create_product) {
                    return response()->json(['message' => 'Insufficient privileges to create products'], 403);
                }
                break;
            case 'PUT':
            case 'PATCH':
                if (!$privileges->can_update_product) {
                    return response()->json(['message' => 'Insufficient privileges to update products'], 403);
                }
                break;
            case 'DELETE':
                if (!$privileges->can_delete_product) {
                    return response()->json(['message' => 'Insufficient privileges to delete products'], 403);
                }
                break;
        }

        return $next($request);
    }
}
