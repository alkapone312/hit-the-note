/* eslint-disable @typescript-eslint/naming-convention */

import Note from './Note.js';
import NoteInTime from './NoteInTime.js';

/**
 * Factory of notes allowing for note creation 
 */
class NoteFactory {
    protected readonly notes: Record<string, number> = {
        'C0': 16.35,
        'C0#': 17.32,
        'D0': 18.35,
        'D0#': 19.45,
        'E0': 20.60,
        'F0': 21.83,
        'F0#': 23.12,
        'G0': 24.50,
        'G0#': 25.96,
        'A0': 27.50,
        'A0#': 29.14,
        'B0': 30.87,
        'C1': 32.70,
        'C1#': 34.65,
        'D1': 36.71,
        'D1#': 38.89,
        'E1': 41.20,
        'F1': 43.65,
        'F1#': 46.25,
        'G1': 49.00,
        'G1#': 51.91,
        'A1': 55.00,
        'A1#': 58.27,
        'B1': 61.74,
        'C2': 65.41,
        'C2#': 69.30,
        'D2': 73.42,
        'D2#': 77.78,
        'E2': 82.41,
        'F2': 87.31,
        'F2#': 92.50,
        'G2': 98.00,
        'G2#': 103.83,
        'A2': 110.00,
        'A2#': 116.54,
        'B2': 123.47,
        'C3': 130.81,
        'C3#': 138.59,
        'D3': 146.83,
        'D3#': 155.56,
        'E3': 164.81,
        'F3': 174.61,
        'F3#': 185.00,
        'G3': 196.00,
        'G3#': 207.65,
        'A3': 220.00,
        'A3#': 233.08,
        'B3': 246.94,
        'C4': 261.63,
        'C4#': 277.18,
        'D4': 293.66,
        'D4#': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'F4#': 369.99,
        'G4': 392.00,
        'G4#': 415.30,
        'A4': 440.00,
        'A4#': 466.16,
        'B4': 493.88,
        'C5': 523.25,
        'C5#': 554.37,
        'D5': 587.33,
        'D5#': 622.25,
        'E5': 659.25,
        'F5': 698.46,
        'F5#': 739.99,
        'G5': 783.99,
        'G5#': 830.61,
        'A5': 880.00,
        'A5#': 932.33,
        'B5': 987.77,
        'C6': 1046.50,
        'C6#': 1108.73,
        'D6': 1174.66,
        'D6#': 1244.51,
        'E6': 1318.51,
        'F6': 1396.91,
        'F6#': 1479.98,
        'G6': 1567.98,
        'G6#': 1661.22,
        'A6': 1760.00,
        'A6#': 1864.66,
        'B6': 1975.53,
        'C7': 2093.00,
        'C7#': 2217.46,
        'D7': 2349.32,
        'D7#': 2489.02,
        'E7': 2637.02,
        'F7': 2793.83,
        'F7#': 2959.96,
        'G7': 3135.96,
        'G7#': 3322.44,
        'A7': 3520.00,
        'A7#': 3729.31,
        'B7': 3951.07
    };
    
    public createClosestNoteForFrequency(frequency: number): Note {
        type Notes = keyof typeof this.notes;
        let closestNote: Notes = 'C0';
        let smallestDifference = Infinity;

        for (const [note, freq] of Object.entries(this.notes)) {
            const difference = Math.abs(frequency - freq);
            if (difference < smallestDifference) {
                smallestDifference = difference;
                closestNote = note;
            }
        }

        return new Note(closestNote, this.notes[closestNote]);
    }

    public createClosestNoteInTimeForFrequency(frequency: number, startTime: number, endTime: number): NoteInTime {
        return new NoteInTime(this.createClosestNoteForFrequency(frequency), startTime, endTime);
    }

    public createNoteForName(noteName: string): Note {
        if (!Object.keys(this.notes).includes(noteName)) {
            throw new Error(`No such a note ${noteName}`);
        }

        return new Note(noteName, this.notes[noteName]);
    }

    public createNoteInTimeForName(noteName: string, startTime: number, endTime: number): NoteInTime {
        return new NoteInTime(this.createNoteForName(noteName), startTime, endTime);
    }

    public createNoteInDifferentTone(note: Note, toneChange: number): Note {
        const notes = Object.keys(this.notes);
        const changedNoteName = notes[notes.indexOf(note.getName()) + toneChange];
        const frequency = this.notes[changedNoteName];

        return new Note(changedNoteName, frequency);
    }

    public createNoteInTimeInDifferentTone(note: NoteInTime, toneChange: number): NoteInTime {
        return new NoteInTime(this.createNoteInDifferentTone(note.getNote(), toneChange), note.getStartTime(), note.getEndTime());
    } 
}

export default NoteFactory;