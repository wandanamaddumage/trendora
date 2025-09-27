<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Info(
 *     title="Trendora API",
 *     version="1.0.0",
 *     description="REST API for Trendora backend"
 * )
 *
 * @OA\Server(
 *     url="http://localhost:8080",
 *     description="Local server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="Bearer"
 * )
 */
/**
 * @OA\Tag(
 *     name="Health",
 *     description="Health check endpoints"
 * )
 */
class HealthController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/health",
     *     summary="Health check",
     *     description="Check if the API is running",
     *     tags={"Health"},
     *     @OA\Response(
     *         response=200,
     *         description="API is healthy",
     *         @OA\JsonContent(
     *             @OA\Property(property="status", type="string", example="ok"),
     *             @OA\Property(property="time", type="string", format="date-time", example="2025-09-26T13:42:36.496319Z")
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'time' => now()->toISOString(),
        ]);
    }
}
