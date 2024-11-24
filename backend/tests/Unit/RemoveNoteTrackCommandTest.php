<?php

namespace Tests\Unit;

use App\Models\NoteTrack;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RemoveNoteTrackCommandTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the remove command deletes the note track and its associated file.
     *
     * @return void
     */
    public function test_remove_note_track_deletes_file_and_record()
    {
        // Arrange: Create a NoteTrack and a mock file
        Storage::fake('local');
        $noteTrack = NoteTrack::create([
            'title' => 'Test Song',
            'artist' => 'Test Artist',
            'filename' => 'test-song.mp3',
        ]);
        
        // Fake the file in storage
        Storage::put("note_tracks/{$noteTrack->filename}", 'test content');
        
        // Assert that the file exists before running the command
        Storage::assertExists("note_tracks/{$noteTrack->filename}");
        
        // Act: Run the command to remove the note track
        $exitCode = Artisan::call('note-track:remove', ['id' => $noteTrack->id]);

        // Assert: Check if the exit code is successful
        $this->assertEquals(0, $exitCode);

        // Assert: Verify the file was deleted
        Storage::assertMissing("note_tracks/{$noteTrack->filename}");

        // Assert: Verify the NoteTrack record is deleted from the database
        $this->assertDatabaseMissing('note_tracks', ['id' => $noteTrack->id]);
    }

    /**
     * Test the remove command handles case where NoteTrack does not exist.
     *
     * @return void
     */
    public function test_remove_note_track_handles_non_existent_record()
    {
        // Arrange: Ensure no NoteTrack exists with this ID
        $nonExistentId = 999;

        // Act: Run the command with a non-existent ID
        $exitCode = Artisan::call('note-track:remove', ['id' => $nonExistentId]);

        // Assert: The command should fail and return an error exit code
        $this->assertEquals(1, $exitCode);
        $this->assertStringContainsString('No NoteTrack found with UUID', Artisan::output());
    }

    /**
     * Test the remove command handles case where the file does not exist.
     *
     * @return void
     */
    public function test_remove_note_track_handles_missing_file()
    {
        // Arrange: Create a NoteTrack with a non-existent file
        $noteTrack = NoteTrack::create([
            'title' => 'Test Song',
            'artist' => 'Test Artist',
            'filename' => 'nonexistent-song.mp3',
        ]);
        
        // Act: Run the command to remove the note track
        $exitCode = Artisan::call('note-track:remove', ['id' => $noteTrack->id]);

        // Assert: The exit code should be successful even if the file does not exist
        $this->assertEquals(0, $exitCode);
        $this->assertStringContainsString("File '{$noteTrack->filename}' does not exist in storage.", Artisan::output());

        // Assert: The NoteTrack record should still be deleted
        $this->assertDatabaseMissing('note_tracks', ['id' => $noteTrack->id]);
    }
}
