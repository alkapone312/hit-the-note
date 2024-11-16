<?php

namespace App\Http\Controllers;

use App\Models\NoteTrack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Exception;

class NoteTrackController extends Controller
{
    public function index()
    {
        return NoteTrack::all();
    }

    public function get(string $filename) {
        try {
            return Storage::download("note_tracks/$filename", $filename, [
                'Access-Control-Allow-Origin' => '*'
            ]);
        } catch(Exception $e) {
            return response()->json(['error' => "Cannot get file $filename"]);
        }
    }
}
