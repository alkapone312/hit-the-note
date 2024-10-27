import type MediaPlayerInterface from '../../note/MediaPlayerInterface.js';

class BrowserWavMediaPlayer implements MediaPlayerInterface {
    private audioContext: AudioContext | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private isPlaying = false;
    private startTime = 0;
    private elapsedTime = 0;

    public constructor(private readonly wavFile: File) {
        this.audioContext = new AudioContext();
        this.wavFile.arrayBuffer().then(b => {
            this.audioContext!.decodeAudioData(b).then(buffer => {
                this.audioBuffer = buffer;
            });
        });
    }

    public play(): boolean {
        if (!this.isPlaying && this.audioBuffer) {
            this.sourceNode = this.audioContext!.createBufferSource();
            this.sourceNode.buffer = this.audioBuffer;
            this.sourceNode.connect(this.audioContext!.destination);
            
            const offset = (this.elapsedTime ? this.elapsedTime : 0);
            this.startTime = new Date().getTime();
            this.sourceNode.start(0, offset);
            
            this.isPlaying = true;
        }

        return this.isPlaying;
    }

    public stop(): boolean {
        if (this.isPlaying && this.sourceNode && this.audioContext) {
            this.sourceNode.stop();
            this.elapsedTime += (new Date().getTime() - this.startTime) / 1000;
            this.isPlaying = false;
        }

        return this.isPlaying;
    }

    public getCurrentTime(): number {
        if (this.isPlaying && this.audioContext) {
            this.stop();
            this.play();
            return this.elapsedTime;
        } else if (this.elapsedTime) {
            return this.elapsedTime;
        }
        return 0;
    }

    public setCurrentTime(time: number): void {
        if(time < 0) {
            time = 0;
        }
        if(time > this.getTimeLength()) {
            time = this.getTimeLength();
        }
        const wasPlaying = this.isPlaying;
        if(this.isPlaying) {
            this.stop();
        }
    
        this.elapsedTime = time;

        if(wasPlaying) {
            this.play();
        }
    }

    public getTimeLength(): number {
        return (this.audioBuffer ? this.audioBuffer.duration : 0);
    }
}

export default BrowserWavMediaPlayer;
