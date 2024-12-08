/**
 * Model class for storing metadata of track
 */
class NoteTrackMetadata {
    public constructor(
        private name: string,
        private artist: string,
        private filename: string
    ) {
    }

    public getName(): string {
        return this.name;
    }

    public getArtist(): string {
        return this.artist;
    }

    public getFilename(): string {
        return this.filename;
    }

    public setName(name: string): void {
        this.name = name;
        this.filename = name.toLowerCase().replace(' ', '-').replace(/[^a-z\-]/g, '') + '.htn';
    }

    public setArtist(artist: string): void {
        this.artist = artist;
    }
}

export default NoteTrackMetadata;