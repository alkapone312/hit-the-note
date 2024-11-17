import NoteTrackMetadata from "@/note/NoteTrackMetadata.js";

class NoteTracksResponse {
    public constructor(private readonly metadata: NoteTrackMetadata[]) {}

    public getMetadata(): NoteTrackMetadata[] {
        return this.metadata;
    }
}

export default NoteTracksResponse;