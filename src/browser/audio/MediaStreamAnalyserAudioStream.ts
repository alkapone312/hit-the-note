import AudioStream from "@/audio/AudioStream.js";
import StreamException from "@/audio/StreamException.js";

class MediaRecorderAudioStream extends AudioStream {
    private analyser: AnalyserNode;
    
    private requestDataInterval = 0;
    
    private getDataFunction: () => void;
    
    public constructor(
        private readonly timeslice: number, 
        private readonly windowSize: number,
        sampleRate: number
    ) {
        super(sampleRate);
    }

    public async setUp(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        const audioCtx = new AudioContext({sampleRate: this.getSampleRate()});
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = this.windowSize;
        audioCtx.createMediaStreamSource(stream).connect(this.analyser);
        this.getDataFunction = () => {
            const data = new Float32Array(this.analyser.frequencyBinCount);
            this.analyser.getFloatTimeDomainData(data);
            this.broadcast(data);
        }
    }
    
    public accept(data: Float32Array) {
        throw new StreamException("This node cannot accept data.");
    }

    public startRecording(): void {
        if(this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
        this.requestDataInterval = setInterval(this.getDataFunction, this.timeslice);
    }

    public stopRecording(): void {
        if(this.requestDataInterval !== 0) {
            clearInterval(this.requestDataInterval);
        }
    }
}

export default MediaRecorderAudioStream;