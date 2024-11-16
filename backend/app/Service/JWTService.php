<?php

namespace App\Service;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTService
{
    private static $secretKey = 'hit-the-note';

    /**
     * Generate a JWT token for the given payload.
     */
    public static function generateToken(array $payload): string
    {
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    /**
     * Validate a JWT token and return the decoded payload.
     */
    public static function validateToken(string $token): object
    {
        return JWT::decode($token, new Key(self::$secretKey, 'HS256'));
    }
}
