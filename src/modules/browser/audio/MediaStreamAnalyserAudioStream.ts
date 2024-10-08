import RecordingInterface from "@/audio/RecordingInterface";
import StreamException from "@/audio/StreamException.js";
import StreamNode from "@/audio/StreamNode";

class MediaRecorderAudioStream extends StreamNode<Float32Array, Float32Array> implements RecordingInterface {
    private analyser: AnalyserNode;
    
    private requestDataInterval = 0;
    
    private getDataFunction: () => void;
    
    public constructor(
        private readonly timeslice: number
    ) {
        super();
    }

    public async setUp(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        const audioCtx = new AudioContext({sampleRate: this.settings.sampleRate});
        this.analyser = audioCtx.createAnalyser();
        this.analyser.fftSize = this.settings.windowSize;
        audioCtx.createMediaStreamSource(stream).connect(this.analyser);
        this.getDataFunction = () => {
            const data = new Float32Array(this.analyser.frequencyBinCount);
            this.analyser.getFloatTimeDomainData(data);
            this.broadcast(data);
        }
    }
    
    public accept() {
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