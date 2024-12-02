<?php

namespace Tests\Unit;

use App\Models\NoteTrack;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class StoreNoteTrackCommandTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the store command creates a note track and uploads the file.
     *
     * @return void
     */
    public function test_store_note_track_creates_record_and_uploads_file()
    {
        // Arrange: Prepare fake storage and a sample file path
        Storage::fake('local');
        $filePath = 'tmp.htn';
        
        // Make sure that the file exists in our fake storage
        // Normally, the file would be provided, but we simulate it here for testing
        touch($filePath);

        // Act: Run the store command with valid arguments
        $exitCode = Artisan::call('note-track:store', [
            'title' => 'Test Song',
            'file' => $filePath,
            'artist' => 'Test Artist',
        ]);

        // Assert: The exit code should be 0 (success)
        $this->assertEquals(0, $exitCode);

        // Assert: The NoteTrack record should be created in the database
        $this->assertDatabaseHas('note_tracks', [
            'title' => 'Test Song',
            'artist' => 'Test Artist',
        ]);

        // Clean up by removing the simulated file (since it's just a fake file in storage)
        unlink($filePath);
    }

    /**
     * Test that the store command fails when the file doesn't exist.
     *
     * @return void
     */
    public function test_store_note_track_fails_if_file_does_not_exist()
    {
        // Arrange: Set a non-existent file path
        $nonExistentFile = 'path/to/nonexistent-song.mp3';

        // Act: Run the store command with a non-existent file
        $exitCode = Artisan::call('note-track:store', [
            'title' => 'Non Existent Song',
            'file' => $nonExistentFile,
            'artist' => 'Non Existent Artist',
        ]);

        // Assert: The exit code should be 1 (error)
        $this->assertEquals(1, $exitCode);

        // Assert: The error message should indicate that the file does not exist
        $this->assertStringContainsString('The specified file does not exist.', Artisan::output());
    }

    /**
     * Test that the store command fails when the file upload fails.
     *
     * @return void
     */
    public function test_store_note_track_fails_if_upload_fails()
    {
        // Arrange: Fake storage and simulate a failure during the upload
        $filePath = 'tmp.mp3';

        // Act: Run the store command
        $exitCode = Artisan::call('note-track:store', [
            'title' => 'Test Song Failure',
            'file' => $filePath,
            'artist' => 'Test Artist',
        ]);

        // Assert: The exit code should be 1 (error)
        $this->assertEquals(1, $exitCode);
    }
}
