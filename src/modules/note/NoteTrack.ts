import NoteFactory from './NoteFactory.js';
import type NoteInTime from './NoteInTime.js';

class NoteTrack {
    
    private readonly noteFactory: NoteFactory;

    private toneChange = 0;

    public constructor(
        private notes: NoteInTime[], 
        private readonly soundtrack: File
    ) {
        this.noteFactory = new NoteFactory();
    }

    public addNote(newNote: NoteInTime): void {
        this.notes.forEach(note => {
            if (
                newNote.getStartTime() > note.getStartTime() && newNote.getStartTime() < note.getEndTime() ||
                newNote.getEndTime() > note.getStartTime() && newNote.getEndTime() < note.getEndTime() ||
                newNote.getStartTime() < note.getStartTime() && newNote.getEndTime() > note.getEndTime() 
            ) {
                throw new Error('Cannot have two same notes at one time');
            }
        });

        this.notes.push(newNote);
    }

    public getNote(time: number): NoteInTime | null {
        return this.notes.find(note => {
            if (
                note.getStartTime() <= time &&
                note.getEndTime() >= time
            ) {
                return true;
            }

            return false;
        }) ?? null;
    }

    public getNotes(): NoteInTime[] {
        return this.notes;
    }

    public getSoundtrack(): File {
        return this.soundtrack;
    }

    public getToneChange(): number {
        return this.toneChange;
    }

    public changeTone(numberOfSemitones: number): void {
        this.toneChange = numberOfSemitones;
        this.notes = this.notes.map(note => this.noteFactory.createNoteInTimeInDifferentTone(note, numberOfSemitones));
    }
}

export default NoteTrack;