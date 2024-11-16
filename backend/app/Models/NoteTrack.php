<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteTrack extends Model
{
    /** @use HasFactory<\Database\Factories\NoteTrackFactory> */
    use HasFactory;

    protected $fillable = ['title', 'artist', 'filename'];
}
