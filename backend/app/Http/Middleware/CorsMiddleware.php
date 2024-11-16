<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if(method_exists($response, 'header')) {
            $response->header('Access-Control-Allow-Origin', '*');
        }

        return $response;
    }
}
