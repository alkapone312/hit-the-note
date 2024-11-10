import type MediaPlayerInterface from '../../note/MediaPlayerInterface.js';

class BrowserWavMediaPlayer implements MediaPlayerInterface {
    private audioElement: HTMLAudioElement;
    private isPlaying = false;
    private elapsedTime = 0;

    public constructor(private readonly wavFile: File) {
        this.audioElement = new Audio();
        this.loadAudioFile(wavFile);
    }

    private loadAudioFile(file: File): void {
        const fileURL = URL.createObjectURL(file);
        this.audioElement.src = fileURL;
        this.audioElement.onloadeddata = () => {
            this.audioElement.currentTime = this.elapsedTime;
        };
    }

    public play(): boolean {
        if (!this.isPlaying) {
            this.audioElement.currentTime = this.elapsedTime;
            this.audioElement.play();
            this.isPlaying = true;
        }
        return this.isPlaying;
    }

    public stop(): boolean {
        if (this.isPlaying) {
            this.audioElement.pause();
            this.elapsedTime = this.audioElement.currentTime;
            this.isPlaying = false;
        }
        return this.isPlaying;
    }

    public getCurrentTime(): number {
        return this.isPlaying ? this.audioElement.currentTime : this.elapsedTime;
    }

    public setCurrentTime(time: number): void {
        this.elapsedTime = Math.max(0, Math.min(time, this.getTimeLength()));
        this.audioElement.currentTime = this.elapsedTime;
        if (this.isPlaying) {
            this.play();
        }
    }

    public getTimeLength(): number {
        return this.audioElement.duration || 0;
    }
}

export default BrowserWavMediaPlayer;
