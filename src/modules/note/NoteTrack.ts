import MediaPlayerInterface from "./MediaPlayerInterface";
import Note from "./Note";

class NoteTrack {
    
    constructor(
        private readonly notes: Note[], 
        private readonly soundtrack: File,
        private readonly player: MediaPlayerInterface
    ) {
    }

    public play(): void {
        this.player.play();
    }

    public stop(): void {
        this.player.stop();
    }

    public getCurrentNote(): Note | null {
        return this.notes.find(note => {
            if(
                note.getStartTime() >= this.player.getCurrentTime() &&
                note.getEndTime() <= this.player.getCurrentTime()
            ) {
                return note;
            }
        }) ?? null;
    }

    public getNotes(): Note[] {
        return this.notes;
    }

    public getSoundtrack(): File {
        return this.soundtrack;
    }
}