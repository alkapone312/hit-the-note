import type Note from './Note.js';

/**
 * Wrapper for note class, placing it in time 
 */
class NoteInTime {
    public constructor(
        private note: Note, 
        private startTime: number, 
        private endTime: number
    ) {
        if (endTime <= startTime) {
            throw new Error('End time cannot be lower than start time!');
        }
    }

    public getNote(): Note {
        return this.note;
    }

    public getEndTime(): number {
        return this.endTime;
    }

    public getStartTime(): number {
        return this.startTime;
    }

    public setStartTime(startTime: number): void {
        this.startTime = startTime;
    }

    public setEndTime(endTime: number): void {
        this.endTime = endTime;
    }

    public setNote(note: Note): void {
        this.note = note;
    }
}

export default NoteInTime;