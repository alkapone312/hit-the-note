import type RecordingInterface from '@/audio/RecordingInterface.js';
import StreamException from '@/audio/StreamException.js';
import StreamNode from '@/audio/StreamNode.js';

class MediaRecorderAudioStream extends StreamNode implements RecordingInterface {
    private analyser: AnalyserNode;

    private requestDataInterval: string | number | NodeJS.Timeout | undefined = 0;
    
    private getDataFunction: () => void;
    
    public constructor(
        private readonly timeslice: number
    ) {
        super();
    }

    public async setUp(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        const audioCtx = new AudioContext({sampleRate: this.settings.sampleRate});
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = this.settings.windowSize;
        audioCtx.createMediaStreamSource(stream).connect(this.analyser);
        this.getDataFunction = (): void => {
            const data = new Float32Array(this.analyser.frequencyBinCount);
            this.analyser.getFloatTimeDomainData(data);
            this.broadcast(data);
        };
    }
    
    public accept(): void {
        throw new StreamException('This node cannot accept data.');
    }

    public startRecording(): void {
        if (this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
        this.requestDataInterval = setInterval(this.getDataFunction, this.timeslice);
    }

    public stopRecording(): void {
        if (this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
    }
}

export default MediaRecorderAudioStream;