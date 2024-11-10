import StreamNode from '@/audio/StreamNode.js';
import type MediaPlayerInterface from '../../note/MediaPlayerInterface.js';
import RecordingInterface from '@/audio/RecordingInterface.js';

class BrowserWavMediaPlayer extends StreamNode implements MediaPlayerInterface, RecordingInterface {
    private readonly audioContext: AudioContext | null = null;
    
    private sourceNode: AudioBufferSourceNode | null = null;
    
    private audioBuffer: AudioBuffer | null = null;

    private analyser: AnalyserNode | null = null;

    private isPlaying = false;
    
    private startTime = 0;
    
    private elapsedTime = 0;

    private timeslice = 10;

    private getDataFunction: () => void;

    private requestDataInterval: string | number | NodeJS.Timeout | undefined = 0;
    
    public constructor(private readonly wavFile: File) {
        super();
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.getDataFunction = (): void => {
            const data = new Float32Array(this.analyser!.frequencyBinCount);
            this.analyser!.getFloatTimeDomainData(data);
            this.broadcast(data);
        };
        this.wavFile.arrayBuffer().then(b => {
            this.audioContext!.decodeAudioData(b).then(buffer => {
                this.audioBuffer = buffer;
            });
        });
    }

    startRecording(): void {
        this.play();
    }
    
    stopRecording(): void {
        this.stop();
    }
    
    setUp(): Promise<void> {
        return Promise.resolve();
    }
    
    public accept(data: Float32Array): void {
        throw new Error('This node cannot accept data.');
    }

    public play(): boolean {
        if (!this.isPlaying && this.audioBuffer) {
            this.analyser!.fftSize = this.settings.windowSize;
            this.sourceNode = this.audioContext!.createBufferSource();
            this.sourceNode.buffer = this.audioBuffer;
            this.sourceNode.connect(this.analyser!);
            this.analyser!.connect(this.audioContext!.destination)
            
            const offset = this.elapsedTime ? this.elapsedTime : 0;
            this.startTime = new Date().getTime();
            this.sourceNode.start(0, offset);
            
            this.isPlaying = true;
        }

        if (this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
        this.requestDataInterval = setInterval(this.getDataFunction, this.timeslice);

        return this.isPlaying;
    }

    public stop(): boolean {
        if (this.isPlaying && this.sourceNode && this.audioContext) {
            this.sourceNode.stop();
            this.elapsedTime += (new Date().getTime() - this.startTime) / 1000;
            this.isPlaying = false;
        }
        if (this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
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
        if (time < 0) {
            time = 0;
        }
        if (time > this.getTimeLength()) {
            time = this.getTimeLength();
        }
        const wasPlaying = this.isPlaying;
        if (this.isPlaying) {
            this.stop();
        }
    
        this.elapsedTime = time;

        if (wasPlaying) {
            this.play();
        }
    }

    public getTimeLength(): number {
        return this.audioBuffer ? this.audioBuffer.duration : 0;
    }
}

export default BrowserWavMediaPlayer;
