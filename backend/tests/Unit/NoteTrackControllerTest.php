<?php

namespace Tests\Unit;

use App\Models\NoteTrack;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NoteTrackControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Testuje metodę `index`, aby zwrócić wszystkie ścieżki.
     *
     * @return void
     */
    public function test_index_returns_all_note_tracks()
    {
        // Arrange: Tworzymy dane mock (3 utwory) w bazie danych
        NoteTrack::create([
            'title' => 'Song One',
            'artist' => 'Artist A',
            'filename' => 'song-one.mp3',
        ]);
        NoteTrack::create([
            'title' => 'Song Two',
            'artist' => 'Artist B',
            'filename' => 'song-two.mp3',
        ]);
        NoteTrack::create([
            'title' => 'Song Three',
            'artist' => 'Artist C',
            'filename' => 'song-three.mp3',
        ]);

        // Act: Wysyłamy żądanie GET do endpointu index
        $response = $this->getJson('/note-tracks');

        // Assert: Sprawdzamy, czy odpowiedź zawiera wszystkie 3 utwory
        $response->assertStatus(200)
                 ->assertJsonCount(3)
                 ->assertJsonFragment(['title' => 'Song One'])
                 ->assertJsonFragment(['artist' => 'Artist A'])
                 ->assertJsonFragment(['filename' => 'song-one.mp3']);
    }

    /**
     * Testuje metodę `get`, aby zwrócić plik, jeśli istnieje.
     *
     * @return void
     */
    public function test_get_returns_file_if_exists()
    {
        // Arrange: Przygotowujemy "plik" w Storage
        $filename = 'test-file.mp3';
        Storage::fake('local');
        Storage::put("note_tracks/$filename", 'test content');

        // Act: Wysyłamy żądanie GET do endpointu `get`
        $response = $this->get("/note-tracks/$filename");

        // Assert: Sprawdzamy, czy plik został zwrócony
        $response->assertStatus(200);
        $response->assertHeader('Content-Disposition', 'attachment; filename=' . $filename);
        Storage::assertExists("note_tracks/$filename");
    }

    /**
     * Testuje metodę `get`, aby zwrócić błąd, jeśli plik nie istnieje.
     *
     * @return void
     */
    public function test_get_returns_error_if_file_not_found()
    {
        // Arrange: Podajemy nazwę pliku, który nie istnieje
        $filename = 'non-existent-file.mp3';
        Storage::fake('local');

        // Act: Wysyłamy żądanie GET do endpointu `get`
        $response = $this->get("/note-tracks/$filename");

        // Assert: Sprawdzamy, czy odpowiedź zawiera odpowiedni błąd
        $response->assertStatus(200); // Zakładamy, że kontroler zwraca kod 200 z treścią błędu
        $response->assertJson(['error' => "Cannot get file $filename"]);
    }
}
