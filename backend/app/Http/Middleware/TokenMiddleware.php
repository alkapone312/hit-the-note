<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\Models\User;
use App\Service\JWTService;

class TokenMiddleware
{
    public function __construct(private readonly JWTService $jwt) {
    }

    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        try {
            $decoded = $this->jwt->validateToken($token);
            $request->attributes->set('user', User::where('email', $decoded->email)->first());
        } catch (Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}
