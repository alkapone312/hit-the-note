<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteTrackController;

Route::get('/', function () {
    return 'Hit the note! - API';
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/note-tracks', [NoteTrackController::class, 'index']);
Route::get('/note-tracks/{filename}', [NoteTrackController::class, 'get']);
Route::middleware('auth')->group(function () {
    // Route::post('/note-tracks', [NoteTrackController::class, 'store']);
});