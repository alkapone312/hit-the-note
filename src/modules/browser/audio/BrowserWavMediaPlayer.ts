import type MediaPlayerInterface from '../../note/MediaPlayerInterface.js';

class BrowserWavMediaPlayer implements MediaPlayerInterface {
    private audioContext: AudioContext | null = null;

    private sourceNode: AudioBufferSourceNode | null = null;

    private audioBuffer: AudioBuffer | null = null;

    private isPlaying = false;

    private startTime = 0;

    private elapsedTime = 0;

    public constructor(private readonly wavFile: File) {}

    public play(): void {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            this.wavFile.arrayBuffer().then(b => {
                this.audioContext!.decodeAudioData(b).then(buffer => {
                    this.audioBuffer = buffer;
                    this.playTrack();
                });
            });
        } else {
            this.playTrack();
        }
    }

    public stop(): void {
        if (this.isPlaying && this.sourceNode && this.audioContext) {
            this.sourceNode.stop();
            this.elapsedTime += new Date().getTime() - this.startTime;
            this.isPlaying = false;
        }
    }

    public getCurrentTime(): number {
        if (this.isPlaying && this.audioContext) {
            return this.audioContext.currentTime - this.startTime;
        } else if (this.elapsedTime) {
            return this.elapsedTime;
        }
        return 0;
    }

    private playTrack(): void {
        if (!this.isPlaying) {
            this.sourceNode = this.audioContext!.createBufferSource();
            this.sourceNode.buffer = this.audioBuffer;
            this.sourceNode.connect(this.audioContext!.destination);

            const offset = (this.elapsedTime ? this.elapsedTime : 0) / 1000;
            this.startTime = new Date().getTime();
            this.sourceNode.start(0, offset);

            this.isPlaying = true;
        }
    }
}

export default BrowserWavMediaPlayer;
