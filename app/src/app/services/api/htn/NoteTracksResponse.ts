import NoteTrackMetadata from "@/note/NoteTrackMetadata.js";

class NoteTrackResponse {
    public constructor(private readonly metadata: NoteTrackMetadata[]) {}

    public getMetadata(): NoteTrackMetadata[] {
        return this.metadata;
    }
}

export default NoteTrackResponse;