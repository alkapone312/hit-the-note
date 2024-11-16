<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\NoteTrack;

class RemoveNoteTrack extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'note-track:remove {id : The ID of the note track to remove}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove a NoteTrack and its associated file from storage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->argument('id');

        $noteTrack = NoteTrack::where('id', $id)->first();

        if (!$noteTrack) {
            $this->error("No NoteTrack found with UUID: {$id}");
            return 1;
        }

        if (Storage::exists("note_tracks/$noteTrack->filename")) {
            if (Storage::delete("note_tracks/$noteTrack->filename")) {
                $this->info("File '{$noteTrack->filename}' deleted successfully.");
            } else {
                $this->error("Failed to delete file '{$noteTrack->filename}'.");
                return 1;
            }
        } else {
            $this->warn("File '{$noteTrack->filename}' does not exist in storage.");
        }

        $noteTrack->delete();

        $this->info("NoteTrack '{$noteTrack->title}' removed successfully.");

        return 0;
    }
}
