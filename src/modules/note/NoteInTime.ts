import type Note from './Note.js';

class NoteInTime {
    public constructor(
        private readonly note: Note, 
        private readonly startTime: number, 
        private readonly endTime: number
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
}

export default NoteInTime;