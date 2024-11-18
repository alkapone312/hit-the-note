import NotePoints from '@/note/NotePoints.js';
import NoteTrack from '@/note/NoteTrack.js';
import NoteFactory from '@/note/NoteFactory.js';
import { describe, it, expect, beforeEach } from 'vitest';
import NoteTrackMetadata from '@/note/NoteTrackMetadata.js';

describe('NotePoints', () => {
    let noteTrack: NoteTrack;
    let notePoints: NotePoints;

    beforeEach(() => {
        const noteFactory = new NoteFactory();
        const notes = [
            noteFactory.createNoteInTimeForName('A4', 0, 2),
            noteFactory.createNoteInTimeForName('B4', 2, 4)
        ];

        noteTrack = new NoteTrack(notes, null, new NoteTrackMetadata('a', 'b', 'c'));
        notePoints = new NotePoints(noteTrack);
    });

    it('should start with zero points', () => {
        expect(notePoints.getTotalPoints()).toBe(0);
    });

    it('should correctly add points for hitting the correct frequency during note', () => {
        // Analyze correct frequencies for the first note.
        notePoints.analyzeAndAddPoints(0.5, 440); // 440Hz (perfect match for A4).
        notePoints.analyzeAndAddPoints(1.0, 440); // Another perfect match.
        
        // Check total points.
        const points = notePoints.getTotalPoints();
        expect(points).toEqual(100); // Max points = 2s * 100.
    });

    it('should correctly add points for hitting the correct frequency for full note', () => {
        notePoints.analyzeAndAddPoints(0.5, 440);
        notePoints.analyzeAndAddPoints(1.0, 440);
        notePoints.analyzeAndAddPoints(1.1, 440);
        notePoints.analyzeAndAddPoints(1.2, 440);
        notePoints.analyzeAndAddPoints(1.3, 440);
        notePoints.analyzeAndAddPoints(1.4, 440);
        notePoints.analyzeAndAddPoints(2.0, 440);
        notePoints.analyzeAndAddPoints(2.1, 440); // points recognized after note - should not count
        notePoints.analyzeAndAddPoints(2.2, 440);
        notePoints.analyzeAndAddPoints(2.3, 440);

        const points = notePoints.getTotalPoints();
        expect(points).toEqual(200);
    })

    it('should handle missed notes correctly', () => {
        notePoints.analyzeAndAddPoints(0.5, 400); // 400Hz (far from A4's 440Hz).

        const points = notePoints.getTotalPoints();
        expect(points).toBe(0); // Outside the tolerance range, no points awarded.
    });

    it('should transition to the next note and calculate points', () => {
        // Hit the first note (A4).
        notePoints.analyzeAndAddPoints(0.5, 440); // 440Hz (perfect match).
        notePoints.analyzeAndAddPoints(1.0, 440); // Another perfect match.
        notePoints.analyzeAndAddPoints(2.0, 440)

        let points = notePoints.getTotalPoints();
        expect(points).toEqual(200);

        // Move to the second note (B4).
        notePoints.analyzeAndAddPoints(2.5, 493.88); // Perfect match for B4.
        notePoints.analyzeAndAddPoints(4, 493.88)
        notePoints.analyzeAndAddPoints(4.5, 493.88)

        // Expect points to increase.
        points = notePoints.getTotalPoints();
        expect(points).toEqual(400);
    });

    it('should assign 1/4 of the points for hitting 1/4 of the note', () => {
        notePoints.analyzeAndAddPoints(0.1, 440)
        notePoints.analyzeAndAddPoints(0.2, 440)
        notePoints.analyzeAndAddPoints(0.3, 440)
        notePoints.analyzeAndAddPoints(0.4, 440)
        notePoints.analyzeAndAddPoints(0.5, 440)

        const points = notePoints.getTotalPoints()
        expect(points).toEqual(50)
    })

    it('should assign points on the edge of tolerance', () => {
        notePoints.analyzeAndAddPoints(2, 445) // 5 Hz is the tolerance

        const points = notePoints.getTotalPoints();
        expect(points).toEqual(200)
    })


    it('should not assign points after the edge of tolerance', () => {
        notePoints.analyzeAndAddPoints(2, 445.0000001) // 5 Hz is the tolerance

        const points = notePoints.getTotalPoints();
        expect(points).toBe(0)
    })
});
