import JSZip from 'jszip';
import NoteTrack from './NoteTrack.js';
import NoteFactory from './NoteFactory.js';
import NoteInTrack from './NoteInTrack.js';
import NoteTrackMetadata from './NoteTrackMetadata.js';

class NoteTrackImporter {
    private noteFactory: NoteFactory;

    public constructor() {
        this.noteFactory = new NoteFactory();
    }

    public async import(zipBlob: Blob): Promise<NoteTrack> {
        const zip = await JSZip.loadAsync(zipBlob);

        const notesJsonFile = zip.file('notes.json');
        if (!notesJsonFile) {
            throw new Error('The ZIP file does not contain notes.json.');
        }

        const notesJson = await notesJsonFile.async('text');
        const noteTrackData = JSON.parse(notesJson);

        const notes = noteTrackData.notes.map((noteData: any) => {
            return this.noteFactory.createNoteInTimeForName(
                noteData.name,
                noteData.startTime,
                noteData.endTime
            );
        });

        const noteTrack = new NoteTrack(notes, null, new NoteTrackMetadata(noteTrackData.name, noteTrackData.artist, noteTrackData.filename));

        noteTrack.changeTone(noteTrackData.toneChange ?? 0);
        noteTrack.setSoundTrackShift(noteTrackData.soundTrackShift ?? 0);

        const soundtrackFile = zip.file(/soundtrack\.(wav|mp3|ogg|flac)/);
        if (soundtrackFile[0]) {
            const soundtrackData = await soundtrackFile[0].async('blob');
            const fileExtension = this.getFileExtensionFromFilename(soundtrackFile[0].name);
            const mimeType = this.getMimeTypeFromExtension(fileExtension);

            const soundtrack = new File([soundtrackData], `soundtrack.${fileExtension}`, { type: mimeType });
            noteTrack.setSoundtrack(soundtrack);
        }

        return noteTrack;
    }

    private getFileExtensionFromFilename(filename: string): string {
        return filename.split('.').pop() || '';
    }

    private getMimeTypeFromExtension(extension: string): string {
        switch (extension) {
            case 'wav':
                return 'audio/wav';
            case 'mp3':
                return 'audio/mpeg';
            case 'ogg':
                return 'audio/ogg';
            case 'flac':
                return 'audio/flac';
            default:
                return 'application/octet-stream';
        }
    }
}

export default NoteTrackImporter;
