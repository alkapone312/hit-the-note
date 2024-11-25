import NoteFactory from '@/note/NoteFactory.js';
import NoteTrack from '@/note/NoteTrack.js';
import NoteTrackExporter from '@/note/NoteTrackExporter.js';
import NoteTrackImporter from '@/note/NoteTrackImporter.js';
import JSZip from 'jszip';
import { describe, it, expect, beforeEach } from 'vitest';
import NoteTrackMetadata from '@/note/NoteTrackMetadata.js';

let noteTrack;
const noteFactory = new NoteFactory();
const defaultNotes = [
    noteFactory.createNoteInTimeForName('G3', 0, 1),
    noteFactory.createNoteInTimeForName('G3', 1, 2),
    noteFactory.createNoteInTimeForName('A3', 2, 3),
    noteFactory.createNoteInTimeForName('G3', 3, 4),
    noteFactory.createNoteInTimeForName('C4', 4, 5),
    noteFactory.createNoteInTimeForName('B3', 5, 6),
    
    noteFactory.createNoteInTimeForName('G3', 7, 8),
    noteFactory.createNoteInTimeForName('G3', 8, 9),
    noteFactory.createNoteInTimeForName('A3', 9, 10),
    noteFactory.createNoteInTimeForName('G3', 10, 11),
    noteFactory.createNoteInTimeForName('D4', 11, 12),
    noteFactory.createNoteInTimeForName('C4', 12, 13)
]

beforeEach(() => {
    noteTrack = new NoteTrack(defaultNotes, new NoteTrackMetadata('a', 'b', 'c'));
})

describe('NoteTrack', () => {
    it('should correctly add a note', () => {
        const newNote = noteFactory.createNoteInTimeForName('C0', 120, 122)

        noteTrack.addNote(newNote);
        expect(noteTrack.getNote(121).noteInTime).toEqual(newNote);
    });
    
    it('should correctly remove a note', () => {
        const noteToRemove = noteFactory.createNoteInTimeForName('C0', 120, 122);

        noteTrack.addNote(noteToRemove);
        expect(noteTrack.getNote(121).noteInTime).toEqual(noteToRemove);

        noteTrack.removeNote(noteTrack.getNote(121));
        expect(noteTrack.getNote(121)).toBeNull();
    });


    it('should throw error when adding overlapping notes', () => {
        const newNote = noteFactory.createNoteInTimeForName('C0', 0.5, 1.5)
        expect(() => noteTrack.addNote(newNote)).toThrow('Cannot have two same notes at one time');
    });

    it('should get the correct note by time or return null', () => {
        const newNote = noteFactory.createNoteInTimeForName('C0', 120, 122);
        noteTrack.addNote(newNote);

        expect(noteTrack.getNote(121).noteInTime).toEqual(newNote);
        expect(noteTrack.getNote(6.5)).toBeNull();
    });

    it('should change the tone of all notes', () => {
        const toneChange = 1;
        noteTrack.changeTone(toneChange);
        const changedNotes = noteTrack.getNotes();
        const changed = defaultNotes.every((note, index) => {
            return changedNotes[index].getNote().getFrequency() === noteFactory.createNoteInTimeInDifferentTone(note, toneChange).getNote().getFrequency()
        })
        expect(changed).toBeTruthy()
    });
});

describe('NoteTrackExporter', () => {
    let noteTrackExporter;

    beforeEach(() => {
        noteTrackExporter = new NoteTrackExporter();
    });

    it('should export NoteTrack to a zip file', async () => {
        const blob = await noteTrackExporter.export(noteTrack);

        expect(blob).toBeInstanceOf(Blob);

        const zip = await JSZip.loadAsync(blob);
        const notesJson = zip.file('notes.json');
        expect(notesJson).toBeDefined();

        // Check if notes.json content is correct
        const jsonContent = await notesJson!.async('text');
        const parsedData = JSON.parse(jsonContent);
        expect(parsedData.notes.length).toEqual(noteTrack.getNotes().length);
        expect(parsedData.toneChange).toBe(noteTrack.getToneChange());
        expect(parsedData.soundTrackShift).toBe(noteTrack.getSoundTrackShift());
    });

    it('should get the correct file extension for soundtrack MIME type', async () => {
        const fileExtension = noteTrackExporter['getFileExtensionFromMimeType']('audio/wav');
        expect(fileExtension).toBe('wav');
    });
});

describe('NoteTrackImporter', () => {
    let zipBlob;

    beforeEach(() => {
        zipBlob = new NoteTrackExporter().export(noteTrack);
    });

    it('should import NoteTrack from zip file', async () => {
        const noteTrackImporter = new NoteTrackImporter();
        const noteTrack = await noteTrackImporter.import(zipBlob);

        expect(noteTrack).toBeDefined();
        expect(noteTrack.getNotes()).not.toEqual(0);
    });

    it('should throw error if notes.json is missing', async () => {
        const noteTrackImporter = new NoteTrackImporter();
        const zip = await JSZip.loadAsync(zipBlob)
        zip.remove('notes.json')
        await expect(async () => noteTrackImporter.import(
            await zip.generateAsync({ type: 'blob' }))
        ).rejects.toThrow('The ZIP file does not contain notes.json.');
    });

    it('should get MIME type based on file extension', () => {
        const noteTrackImporter = new NoteTrackImporter();
        const mimeType = noteTrackImporter['getMimeTypeFromExtension']('wav');
        expect(mimeType).toBe('audio/wav');
    });
});