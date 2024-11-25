import type Note from './Note.js';
import NoteInTime from './NoteInTime.js';
import type NoteTrack from './NoteTrack.js';

class NoteInTrack extends NoteInTime {
    public constructor(
        private readonly noteInTime: NoteInTime, 
        private readonly track: NoteTrack
    ) {
        super(noteInTime.getNote(), noteInTime.getStartTime(), noteInTime.getEndTime());
        this.validate(noteInTime.getStartTime(), noteInTime.getEndTime());
    }
    
    public setStartTime(startTime: number): void {
        this.validate(startTime, this.noteInTime.getEndTime());
        this.noteInTime.setStartTime(startTime);
    }

    public setEndTime(endTime: number): void {
        this.validate(this.noteInTime.getStartTime(), endTime);
        this.noteInTime.setEndTime(endTime);
    }

    public setNote(note: Note): void {
        this.noteInTime.setNote(note);
    }

    public getNote(): Note {
        return this.noteInTime.getNote();
    }

    public getEndTime(): number {
        return this.noteInTime.getEndTime();
    }

    public getStartTime(): number {
        return this.noteInTime.getStartTime();
    }

    private validate(startTime: number, endTime: number): void {
        if (endTime < startTime) {
            throw new Error('Start time cannot be higher than end time');
        }
        this.track.getNotes().forEach(note => {
            if (note === this) return;
            if (
                startTime > note.getStartTime() && startTime < note.getEndTime() ||
                endTime > note.getStartTime() && endTime < note.getEndTime() ||
                startTime < note.getStartTime() && endTime > note.getEndTime() 
            ) {
                throw new Error('Cannot have two same notes at one time');
            }
        });
    }
}

export default NoteInTrack;