import JSZip from 'jszip';
import type NoteTrack from './NoteTrack.js';

class NoteTrackExporter {
    public async export(noteTrack: NoteTrack): Promise<Blob> {
        const zip = new JSZip();
        
        const soundtrack = noteTrack.getSoundtrack();
        if (soundtrack) {
            const soundtrackData = await soundtrack.arrayBuffer();
            const mimeType = soundtrack.type;
            const fileExtension = this.getFileExtensionFromMimeType(mimeType);
            zip.file(`soundtrack.${fileExtension}`, soundtrackData);
        }

        const notes = noteTrack.getNotes().map(note => ({
            startTime: note.getStartTime(),
            endTime: note.getEndTime(),
            frequency: note.getNote().getFrequency(),
            name: note.getNote().getName(),
        }));

        const noteTrackData = {
            toneChange: noteTrack.getToneChange(),
            soundTrackShift: noteTrack.getSoundTrackShift(),
            notes: notes,
            name: noteTrack.getMetadata().getName(),
            artist: noteTrack.getMetadata().getArtist(),
            filename: noteTrack.getMetadata().getFilename()
        };

        zip.file('notes.json', JSON.stringify(noteTrackData, null, 2));

        return await zip.generateAsync({ type: 'blob' });
    }

    private getFileExtensionFromMimeType(mimeType: string): string {
        switch (mimeType) {
            case 'audio/wav':
            case 'audio/wave':
                return 'wav';
            case 'audio/mpeg':
                return 'mp3';
            case 'audio/ogg':
                return 'ogg';
            case 'audio/flac':
                return 'flac';
            default:
                return 'audio'; // Generic extension if the type is unknown
        }
    }
}

export default NoteTrackExporter;
