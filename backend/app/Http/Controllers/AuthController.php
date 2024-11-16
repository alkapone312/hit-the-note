<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Service\JWTService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private readonly JWTService $jwtService) {
    }

    public function register(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if($user !== null) {
            return response()->json([
                'error' => 'User with this email already exists!'
            ]);
        }

        (new User([
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]))->save();

        return response()->json([
            'success' => 'User created successfully!'
        ], 200);   
    }

    /**
     * Authenticate the user and generate a session token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $this->jwtService->generateToken([
            'email' => $user->email,
            'iat' => time(),
            'exp' => time() + 60 * 60, // Token expires in 1 hour
        ]);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
        ], 200);
    }
}
