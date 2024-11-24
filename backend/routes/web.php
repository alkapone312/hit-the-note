<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteTrackController;

Route::get('/', function () {
    return 'Hit the note! - API';
});

Route::get('/note-tracks', [NoteTrackController::class, 'index']);
Route::get('/note-tracks/{filename}', [NoteTrackController::class, 'get']);
