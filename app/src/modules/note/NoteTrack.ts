import NoteFactory from './NoteFactory.js';
import type NoteInTime from './NoteInTime.js';
import NoteInTrack from './NoteInTrack.js';
import type NoteTrackMetadata from './NoteTrackMetadata.js';

/**
 * Model class that stores notes placed in time.
 */
class NoteTrack {
    
    private readonly noteFactory: NoteFactory;

    private toneChange = 0;

    private soundTrackShift = 0;

    public constructor(
        private notes: NoteInTime[],
        private readonly metadata: NoteTrackMetadata,
        private soundtrack: File | null = null
    ) {
        this.notes = this.notes.map(note => {
            return new NoteInTrack(note, this);
        });
        this.noteFactory = new NoteFactory();
    }
    
    public addNote(newNote: NoteInTime): void {
        this.notes.push(new NoteInTrack(newNote, this));
    }
    
    public removeNote(note: NoteInTime): void {
        this.notes = this.notes.filter(item => item !== note);
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
    
    public getToneChange(): number {
        return this.toneChange;
    }
    
    public getSoundtrack(): File | null {
        return this.soundtrack;
    }
    
    public getSoundTrackShift(): number {
        return this.soundTrackShift;
    }
    
    public getMetadata(): NoteTrackMetadata {
        return this.metadata;
    }

    public setSoundtrack(file: File): void {
        this.soundtrack = file;
    }    

    public setSoundTrackShift(shift: number): void {
        this.soundTrackShift = shift;
    }
    
    public changeTone(numberOfSemitones: number): void {
        this.toneChange = numberOfSemitones;
        this.notes = this.notes.map(
            note => new NoteInTrack(
                this.noteFactory.createNoteInTimeInDifferentTone(note, numberOfSemitones), 
                this
            )
        );
    }
}

export default NoteTrack;