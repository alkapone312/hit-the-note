import NoteInTime from "./NoteInTime.js";
import NoteTrack from "./NoteTrack.js";

interface NoteAnalysis {
    note: NoteInTime;
    hitTimes: number[];
    missTimes: number[];
    currentNotePoints: number; // Store the current points for the note.
}

class NotePoints {
    private totalPoints: number = 0;
    private currentNote: NoteInTime | null = null;
    private lastAnalyzedTime: number = 0;
    private noteAnalysis: NoteAnalysis[] = [];

    public constructor(private noteTrack: NoteTrack) {}

    public analyzeAndAddPoints(time: number, frequency: number): void {
        if (time < this.lastAnalyzedTime) {
            throw new Error('Time cannot move backwards!');
        }

        this.lastAnalyzedTime = time;

        // Fetch the current note if it has changed.
        if (!this.currentNote || time > this.currentNote.getEndTime()) {
            if (this.currentNote) {
                // Finalize the previous note's analysis.
                this.finalizeNoteAnalysis(this.currentNote);
            }

            this.currentNote = this.noteTrack.getNote(time);

            if (this.currentNote) {
                // Start tracking a new note.
                this.noteAnalysis.push({
                    note: this.currentNote,
                    hitTimes: [],
                    missTimes: [],
                    currentNotePoints: 0, // Initialize current points to 0.
                });
            }
        }

        if (!this.currentNote) {
            return; // No note at the current time.
        }

        const targetFrequency = this.currentNote.getNote().getFrequency();
        const difference = Math.abs(targetFrequency - frequency);
        const tolerance = 5; // Tolerance in Hz.

        const noteAnalysis = this.getCurrentNoteAnalysis();

        if(!noteAnalysis) {
            return;
        }

        if (difference <= tolerance) {
            noteAnalysis.hitTimes.push(time);
        } else {
            noteAnalysis.missTimes.push(time);
        }

        // Update current points for the note.
        this.calculatePointsForCurrentNote();
    }

    private finalizeNoteAnalysis(note: NoteInTime): void {
        const noteAnalysis = this.noteAnalysis.find((n) => n.note === note);
        if (!noteAnalysis) return;

        // Add the current note's points to the total points.
        this.totalPoints += noteAnalysis.currentNotePoints;
    }

    private calculatePointsForCurrentNote(): void {
        if (!this.currentNote) return;

        const noteAnalysis = this.getCurrentNoteAnalysis();
        if (!noteAnalysis) return;

        const duration = this.currentNote.getEndTime() - this.currentNote.getStartTime();
        const maxPoints = duration * 100;

        const elapsedTime = this.lastAnalyzedTime - this.currentNote.getStartTime();
        const remainingTime = duration - elapsedTime;

        const hitRatio = noteAnalysis.hitTimes.length / (noteAnalysis.missTimes.length + noteAnalysis.hitTimes.length);
        const points = maxPoints * hitRatio * elapsedTime / duration;
        noteAnalysis.currentNotePoints = points;
    }

    private getCurrentNoteAnalysis(): NoteAnalysis | null {
        return this.noteAnalysis.find((n) => n.note === this.currentNote) || null;
    }

    public getTotalPoints(): number {
        return this.totalPoints + (this.getCurrentNoteAnalysis()?.currentNotePoints ?? 0);
    }

    public getCurrentNote(): NoteInTime | null {
        return this.currentNote;
    }

    public reset(): void {
        this.totalPoints = 0;
        this.currentNote = null;
        this.lastAnalyzedTime = 0;
        this.noteAnalysis = [];
    }
}

export default NotePoints;
