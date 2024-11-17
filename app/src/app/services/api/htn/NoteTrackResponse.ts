import NoteTrack from "@/note/NoteTrack.js";

class NoteTrackResponse {
    public constructor(private readonly noteTrack: NoteTrack) {}

    public getNoteTrack(): NoteTrack {
        return this.noteTrack;
    }
}

export default NoteTrackResponse;