<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\NoteTrack;

class StoreNoteTrack extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'note-track:store 
                            {title : The title of the note track} 
                            {file : The path to the file to upload}
                            {artist? : The artist of the note track (optional)}'; 

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Store a new NoteTrack with metadata and file upload';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $title = $this->argument('title');
        $artist = $this->argument('artist');
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error('The specified file does not exist.');
            return 1;
        }

        $originalFilename = pathinfo($filePath, PATHINFO_FILENAME);
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $sanitizedFilename = Str::slug($originalFilename) . '-' . Str::uuid() . '.' . $extension;
        $storedFilePath = Storage::putFileAs('note_tracks', $filePath, $sanitizedFilename);

        if (!$storedFilePath) {
            $this->error('Failed to upload the file.');
            return 1;
        }

        $noteTrack = NoteTrack::create([
            'title' => $title,
            'artist' => $artist,
            'filename' => $sanitizedFilename,
        ]);

        $this->info("NoteTrack '{$noteTrack->title}' by '{$noteTrack->artist}' id {$noteTrack->id} stored successfully.");
        $this->info("File stored at: {$storedFilePath}");

        return 0;
    }
}
